import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      return NextResponse.json(
        {
          error: "Não autorizado",
          message: "Você precisa estar conectado com sua conta Google para remover eventos da agenda.",
        },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { eventIds } = body as { eventIds?: string[] };

    if (!eventIds || !Array.isArray(eventIds) || eventIds.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Nenhum ID de evento informado para remoção.",
        deletedCount: 0,
      });
    }

    let deletedCount = 0;
    const errors: any[] = [];

    for (const eventId of eventIds) {
      try {
        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        // Se retornou 204 (No Content) ou 404 (já deletado), consideramos sucesso
        if (response.ok || response.status === 404 || response.status === 410) {
          deletedCount++;
        } else {
          const errData = await response.json().catch(() => ({}));
          errors.push({ eventId, error: errData });
        }
      } catch (err: any) {
        errors.push({ eventId, error: err?.message || String(err) });
      }
    }

    return NextResponse.json({
      success: true,
      message: `${deletedCount} eventos foram removidos do Google Agenda.`,
      deletedCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Erro interno",
        message: "Ocorreu um erro ao remover os eventos do Google Agenda.",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
