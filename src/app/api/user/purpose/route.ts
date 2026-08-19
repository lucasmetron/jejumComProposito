import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Não autenticado", message: "Faça login para carregar seu propósito salvo." },
        { status: 401 }
      );
    }

    const email = session.user.email.toLowerCase().trim();

    const { data, error } = await supabaseAdmin
      .from("user_fasting")
      .select("*")
      .eq("user_email", email)
      .maybeSingle();

    if (error) {
      console.error("Erro ao buscar propósito no Supabase:", error);
      return NextResponse.json(
        { error: "Erro no banco de dados", message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data
        ? {
            config: data.config,
            events: data.events,
            hasConfigured: data.has_configured,
            history: data.history || [],
            updatedAt: data.updated_at,
          }
        : null,
    });
  } catch (err: any) {
    console.error("Erro interno ao buscar propósito:", err);
    return NextResponse.json(
      { error: "Erro interno", message: err?.message || String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Não autenticado", message: "Faça login para salvar seu propósito na nuvem." },
        { status: 401 }
      );
    }

    const email = session.user.email.toLowerCase().trim();
    const body = await req.json();
    const { config, events, hasConfigured, history } = body;

    const { error } = await supabaseAdmin.from("user_fasting").upsert(
      {
        user_email: email,
        config: config || {},
        events: events || [],
        has_configured: hasConfigured ?? true,
        history: history || [],
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_email" }
    );

    if (error) {
      console.error("Erro ao salvar propósito no Supabase:", error);
      return NextResponse.json(
        { error: "Erro ao salvar no banco de dados", message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Propósito salvo e sincronizado na nuvem com sucesso!",
    });
  } catch (err: any) {
    console.error("Erro interno ao salvar propósito:", err);
    return NextResponse.json(
      { error: "Erro interno", message: err?.message || String(err) },
      { status: 500 }
    );
  }
}
