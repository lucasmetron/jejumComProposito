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
    const { events } = body as { events: SpiritualFastEvent[] };

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

    return NextResponse.json({
      success: true,
      message: `${createdEvents.length} eventos de jejum foram sincronizados com seu Google Agenda com sucesso!`,
      syncedCount: createdEvents.length,
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
