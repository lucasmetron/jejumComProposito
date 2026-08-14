import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SpiritualFastEvent } from "@/features/schedule/types";

export async function POST(req: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      return NextResponse.json(
        {
          error: "Não autorizado",
          message: "Você precisa estar conectado com sua conta Google para sincronizar com a agenda.",
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { events, previousEventIds, includeWaterReminders } = body as {
      events: SpiritualFastEvent[];
      previousEventIds?: string[];
      includeWaterReminders?: boolean;
    };

    // 1. Limpar eventos anteriores se houver (para atualizações / reagendamento)
    if (previousEventIds && Array.isArray(previousEventIds) && previousEventIds.length > 0) {
      for (const eventId of previousEventIds) {
        try {
          await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
              },
            }
          );
        } catch (delErr) {
          console.warn(`Aviso ao excluir evento anterior ${eventId}:`, delErr);
        }
      }
    }

    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        {
          error: "Requisição inválida",
          message: "Nenhum evento de propósito foi fornecido para sincronização.",
        },
        { status: 400 }
      );
    }

    const createdEvents: any[] = [];
    const errors: any[] = [];

    for (const event of events) {
      // 1. Criar o evento principal do jejum
      try {
        const response = await fetch(
          "https://www.googleapis.com/calendar/v3/calendars/primary/events",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              summary: event.title,
              description: event.description,
              start: {
                dateTime: new Date(event.start).toISOString(),
              },
              end: {
                dateTime: new Date(event.end).toISOString(),
              },
              reminders: {
                useDefault: false,
                overrides: [
                  { method: "popup", minutes: 30 },
                  { method: "email", minutes: 60 },
                ],
              },
              colorId: "7", // Peacock / Teal color in Google Calendar
            }),
          }
        );

        if (!response.ok) {
          const errData = await response.json();
          errors.push({ eventTitle: event.title, error: errData });
        } else {
          const data = await response.json();
          createdEvents.push(data);
        }
      } catch (err: any) {
        errors.push({ eventTitle: event.title, error: err?.message || String(err) });
      }

      // 2. Se for jejum com água e os lembretes estiverem habilitados, criar lembretes a cada 2h na agenda
      if (!event.isAbsoluteFast && includeWaterReminders !== false) {
        const sessionHours = event.targetHours;
        const eventStart = new Date(event.start);

        for (let h = 2; h < sessionHours; h += 2) {
          const waterStart = new Date(eventStart.getTime() + h * 60 * 60 * 1000);
          const waterEnd = new Date(waterStart.getTime() + 15 * 60 * 1000); // 15 minutos

          try {
            const waterRes = await fetch(
              "https://www.googleapis.com/calendar/v3/calendars/primary/events",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${session.accessToken}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  summary: `💧 Lembrete de Água (250ml) - Sessão ${event.sessionNumber}/${event.totalSessions}`,
                  description: `Hora de beber água! Consuma 1 copo (250ml) para manter a hidratação e proteger sua saúde durante o jejum espiritual.\n\nSessão: ${event.title}`,
                  start: {
                    dateTime: waterStart.toISOString(),
                  },
                  end: {
                    dateTime: waterEnd.toISOString(),
                  },
                  reminders: {
                    useDefault: false,
                    overrides: [
                      { method: "popup", minutes: 0 },
                    ],
                  },
                  colorId: "9", // Blueberry / Azul Água no Google Calendar
                }),
              }
            );

            if (waterRes.ok) {
              const waterData = await waterRes.json();
              createdEvents.push(waterData);
            }
          } catch (waterErr) {
            console.warn("Aviso ao criar lembrete de água:", waterErr);
          }
        }
      }
    }

    if (createdEvents.length === 0 && errors.length > 0) {
      return NextResponse.json(
        {
          error: "Falha na sincronização",
          message: "Não foi possível inserir os eventos no Google Agenda. Verifique suas permissões.",
          details: errors,
        },
        { status: 500 }
      );
    }

    const eventIds = createdEvents.map((e) => e.id).filter(Boolean);

    return NextResponse.json({
      success: true,
      message: `${createdEvents.length} eventos de jejum foram sincronizados com seu Google Agenda com sucesso!`,
      syncedCount: createdEvents.length,
      eventIds,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Erro interno",
        message: "Ocorreu um erro ao processar a sincronização.",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
