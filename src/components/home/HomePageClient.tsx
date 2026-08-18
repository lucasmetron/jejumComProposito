"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useFastingStore } from "@/store/useFastingStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ManageFastModal } from "@/components/schedule/ManageFastModal";
import { VerseOfTheDay } from "@/components/spiritual/VerseOfTheDay";
import { PWAInstallButton } from "@/components/pwa/PWAInstallButton";
import { VerseData } from "@/lib/verseService";
import {
  Flame,
  Calendar as CalendarIcon,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Hourglass,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { format, differenceInSeconds } from "date-fns";
import { ptBR } from "date-fns/locale";

interface HomePageClientProps {
  initialVerse?: VerseData;
}

export function HomePageClient({ initialVerse }: HomePageClientProps) {
  const { hasConfigured, events, config } = useFastingStore();
  const [mounted, setMounted] = useState(false);
  const [timeLeftStr, setTimeLeftStr] = useState<string>("00:00:00");
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isFastingNow, setIsFastingNow] = useState<boolean>(false);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Real live timer calculation based on persisted events
  useEffect(() => {
    if (!hasConfigured || !events || events.length === 0) {
      setIsFastingNow(false);
      setActiveSession(null);
      return;
    }

    const calculateTimer = () => {
      const now = new Date();
      // Find current active session or next upcoming session
      const current = events.find((e) => {
        const start = new Date(e.start);
        const end = new Date(e.end);
        return now >= start && now <= end;
      });

      if (current) {
        setIsFastingNow(true);
        setActiveSession(current);
        const start = new Date(current.start);
        const end = new Date(current.end);
        const totalSecs = Math.max(1, differenceInSeconds(end, start));
        const remainSecs = Math.max(0, differenceInSeconds(end, now));
        const hours = Math.floor(remainSecs / 3600);
        const mins = Math.floor((remainSecs % 3600) / 60);
        const secs = remainSecs % 60;
        setTimeLeftStr(
          `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
        );
        const elapsed = totalSecs - remainSecs;
        setProgressPercent(Math.min(100, Math.max(0, (elapsed / totalSecs) * 100)));
      } else {
        setIsFastingNow(false);
        const next = events.find((e) => new Date(e.start) > now);
        if (next) {
          setActiveSession(next);
          const start = new Date(next.start);
          const diff = Math.max(0, differenceInSeconds(start, now));
          const hours = Math.floor(diff / 3600);
          const mins = Math.floor((diff % 3600) / 60);
          const secs = diff % 60;
          setTimeLeftStr(
            `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
          );
          setProgressPercent(0);
        } else {
          setActiveSession(events[0] || null);
          setTimeLeftStr("00:00:00");
          setProgressPercent(100);
        }
      }
    };

    calculateTimer();
    const interval = setInterval(calculateTimer, 1000);
    return () => clearInterval(interval);
  }, [hasConfigured, events]);

  const isZeroState = !mounted || !hasConfigured || !events || events.length === 0;

  // Real statistics when configured
  const totalDays = events.length;
  const avgHours = config.targetHours || 0;
  const purposeName = config.purposeTitle?.trim() || "Consagração & Intimidade";

  return (
    <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop pb-section-gap flex flex-col gap-8 md:gap-10">
      {/* 0. Apresentação & Finalidade do Aplicativo (Requisito de Verificação OAuth Google) */}
      <section className="bg-gradient-to-br from-primary/10 via-surface-container-lowest to-surface-container-low dark:from-primary/20 dark:via-slate-900 dark:to-slate-800/80 rounded-3xl p-6 sm:p-8 md:p-10 border border-primary/20 shadow-sm">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 dark:bg-primary/25 text-primary dark:text-primary-fixed-dim text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Planejador Devocional Espiritual
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface dark:text-white tracking-tight leading-tight">
            Jejum com Propósito
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant dark:text-gray-300 leading-relaxed">
            O <strong>Jejum com Propósito</strong> é um aplicativo devocional criado para ajudar
            você a planejar, organizar e manter suas jornadas de consagração e oração. Com ele, você
            define períodos de abstinência, recebe versículos bíblicos diários e pode{" "}
            <strong>
              sincronizar seus horários de jejum automaticamente com o Google Calendar (Google
              Agenda)
            </strong>{" "}
            para receber lembretes e manter sua disciplina espiritual.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-secondary dark:text-gray-400">
            <span className="flex items-center gap-1.5 bg-surface-bright dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-outline-variant/30 dark:border-white/10">
              <CalendarIcon className="w-3.5 h-3.5 text-primary dark:text-primary-fixed-dim" />{" "}
              Sincronização com Google Agenda
            </span>
            <span className="flex items-center gap-1.5 bg-surface-bright dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-outline-variant/30 dark:border-white/10">
              <Clock className="w-3.5 h-3.5 text-primary dark:text-primary-fixed-dim" /> Lembretes e
              Janelas Diárias
            </span>
            <span className="flex items-center gap-1.5 bg-surface-bright dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-outline-variant/30 dark:border-white/10">
              <Flame className="w-3.5 h-3.5 text-primary dark:text-primary-fixed-dim" /> Cronograma
              Personalizado
            </span>
          </div>
        </div>
      </section>

      {/* 1. Versículo do Dia (Renderizado no Servidor de forma instantânea) */}
      <VerseOfTheDay initialVerse={initialVerse} />

      {/* 2. Main Dashboard Area (Zero-state or Real Active Fast) */}
      {isZeroState ? (
        /* ================= ZERO STATE (Never configured / Clean) ================= */
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Zero State Quick Status Card */}
            <Card className="lg:col-span-12 p-8 md:p-10 flex flex-col items-center justify-center text-center gap-6 border-dashed border-2 border-outline-variant/50 dark:border-white/15 bg-surface-container-lowest/50 dark:bg-slate-900/50">
              <div className="w-20 h-20 rounded-full border-4 border-primary/20 bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary dark:text-primary-fixed-dim">
                <Hourglass className="w-8 h-8 stroke-[1.5]" />
              </div>

              <div className="max-w-md space-y-2">
                <h2 className="text-xl md:text-2xl font-medium text-on-surface dark:text-white">
                  Nenhum jejum ativo
                </h2>
                <p className="text-xs md:text-sm text-on-surface-variant dark:text-gray-400">
                  Você ainda não possui uma escala de jejum configurada. Crie seu primeiro propósito
                  espiritual personalizado para gerar seu cronograma devocional.
                </p>
              </div>

              <Link href="/proposito">
                <Button size="lg" className="px-8 shadow-md gap-2">
                  <Flame className="w-4 h-4" />
                  Configurar Meu Jejum
                </Button>
              </Link>
            </Card>
          </div>

          {/* Action Cards (Stitch Spec) */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Link
              href="/proposito"
              className="bg-surface-container-lowest dark:bg-slate-900 rounded-2xl border border-outline-variant/30 dark:border-white/10 p-6 shadow-sm hover:shadow-md hover:border-primary/40 dark:hover:border-primary/40 transition-all flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-fixed-dim group-hover:scale-105 transition-transform flex-shrink-0">
                <span className="material-symbols-outlined text-2xl">add_task</span>
              </div>
              <div className="flex-grow">
                <h3 className="text-base font-semibold text-on-surface dark:text-white group-hover:text-primary dark:group-hover:text-primary-fixed-dim transition-colors">
                  Configurar Novo Propósito
                </h3>
                <p className="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5">
                  Defina dias, horários e intenções para seu próximo período.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-secondary dark:text-gray-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Link>

            <Link
              href="/sobre"
              className="bg-surface-container-lowest dark:bg-slate-900 rounded-2xl border border-outline-variant/30 dark:border-white/10 p-6 shadow-sm hover:shadow-md hover:border-primary/40 dark:hover:border-primary/40 transition-all flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary-container dark:bg-slate-800 flex items-center justify-center text-secondary dark:text-gray-300 group-hover:scale-105 transition-transform flex-shrink-0">
                <span className="material-symbols-outlined text-2xl">info</span>
              </div>
              <div className="flex-grow">
                <h3 className="text-base font-semibold text-on-surface dark:text-white group-hover:text-primary dark:group-hover:text-primary-fixed-dim transition-colors">
                  Compreender o Propósito
                </h3>
                <p className="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5">
                  Orientações sobre fundamentação bíblica, saúde e reflexões.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-secondary dark:text-gray-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Link>
          </section>

          {/* Clean Journey Progress (Zero State) */}
          <section className="bg-surface-container-lowest dark:bg-slate-900 rounded-2xl border border-outline-variant/30 dark:border-white/10 p-6 md:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base md:text-lg font-semibold text-on-surface dark:text-white">
                Progresso da Jornada
              </h3>
              <span className="bg-surface-container-low dark:bg-slate-800 text-on-surface-variant dark:text-gray-300 text-xs px-3 py-1 rounded-full border border-outline-variant/30 dark:border-white/10 font-medium">
                Iniciante
              </span>
            </div>

            <div className="grid grid-cols-3 divide-x divide-outline-variant/30 dark:divide-white/10 text-center py-2">
              <div className="px-2">
                <div className="text-2xl md:text-3xl font-light text-primary dark:text-primary-fixed-dim mb-0.5">
                  0
                </div>
                <div className="text-[11px] md:text-xs text-on-surface-variant dark:text-gray-400">
                  Dias Seguidos
                </div>
              </div>
              <div className="px-2">
                <div className="text-2xl md:text-3xl font-light text-secondary dark:text-gray-300 mb-0.5">
                  0h
                </div>
                <div className="text-[11px] md:text-xs text-on-surface-variant dark:text-gray-400">
                  Horas Totais
                </div>
              </div>
              <div className="px-2">
                <div className="text-2xl md:text-3xl font-light text-secondary dark:text-gray-300 mb-0.5">
                  0/0
                </div>
                <div className="text-[11px] md:text-xs text-on-surface-variant dark:text-gray-400">
                  Sessões Feitas
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        /* ================= ACTIVE FAST CONFIGURED (Real Dynamic State) ================= */
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Live Progress Card (Left Column, 7 cols on Desktop) */}
            <Card className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden bg-surface-container-lowest dark:bg-slate-900 border-outline-variant/30 dark:border-white/10 shadow-sm">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[11px] font-semibold tracking-wider text-secondary dark:text-gray-400 uppercase">
                      Status da Jornada
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-on-surface dark:text-white mt-1">
                      {isFastingNow ? "Em Jejum Ativo" : "Próxima Consagração"}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        isFastingNow
                          ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-fixed-dim ring-1 ring-primary/30"
                          : "bg-surface-container-high dark:bg-slate-800 text-on-surface-variant dark:text-gray-300 border border-outline-variant/30 dark:border-white/10"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isFastingNow
                            ? "bg-primary animate-pulse"
                            : "bg-secondary dark:bg-gray-400"
                        }`}
                      />
                      {isFastingNow ? "Ativo" : "Aguardando"}
                    </span>

                    {/* Botão Gerenciar Jejum */}
                    <button
                      onClick={() => setIsManageModalOpen(true)}
                      className="p-1.5 rounded-full border border-outline-variant/40 dark:border-white/10 hover:border-primary text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-primary-fixed-dim transition-colors"
                      title="Gerenciar propósito atual"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Main Countdown Timer */}
                <div className="my-6 text-center lg:text-left">
                  <div className="text-4xl md:text-5xl font-mono font-light tracking-tight text-on-surface dark:text-white">
                    {timeLeftStr}
                  </div>
                  <p className="text-xs text-on-surface-variant dark:text-gray-400 mt-2">
                    {isFastingNow
                      ? "Tempo restante para concluir esta sessão"
                      : activeSession
                        ? `Inicia ${format(
                            new Date(activeSession.start),
                            "EEEE, dd/MM 'às' HH:mm",
                            {
                              locale: ptBR,
                            }
                          )}`
                        : "Todas as sessões concluídas com sucesso!"}
                  </p>
                </div>
              </div>

              {/* Progress Bar & Details */}
              <div className="space-y-4 pt-4 border-t border-outline-variant/20 dark:border-white/10">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-on-surface-variant dark:text-gray-400">
                      Progresso do Período
                    </span>
                    <span className="text-primary dark:text-primary-fixed-dim font-bold">
                      {Math.round(progressPercent)}%
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-high dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-secondary dark:text-gray-400 pt-1">
                  <span>
                    Propósito:{" "}
                    <strong className="text-on-surface dark:text-white">{purposeName}</strong>
                  </span>
                  <span>
                    Meta:{" "}
                    <strong className="text-on-surface dark:text-white">{avgHours}h diárias</strong>
                  </span>
                </div>
              </div>
            </Card>

            {/* Next Milestone & Scripture Card (Right Column, 5 cols on Desktop) */}
            <Card className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between bg-surface-container-lowest dark:bg-slate-900 border-outline-variant/30 dark:border-white/10 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold tracking-wider text-secondary dark:text-gray-400 uppercase">
                    Próximo Marco
                  </span>
                  <CalendarIcon className="w-4 h-4 text-primary dark:text-primary-fixed-dim" />
                </div>

                {activeSession ? (
                  <div className="space-y-2">
                    <h3 className="text-lg md:text-xl font-semibold text-on-surface dark:text-white">
                      {activeSession.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant dark:text-gray-400 leading-relaxed line-clamp-3">
                      {activeSession.description}
                    </p>
                  </div>
                ) : (
                  <div className="text-xs text-on-surface-variant dark:text-gray-400">
                    Nenhuma sessão agendada.
                  </div>
                )}
              </div>

              <div className="pt-6 mt-4 border-t border-outline-variant/20 dark:border-white/10 flex items-center justify-between">
                <div className="text-xs text-secondary dark:text-gray-400">
                  Total de sessões:{" "}
                  <strong className="text-on-surface dark:text-white">{totalDays} dias</strong>
                </div>
                <Link href="/proposito">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    Ver Cronograma
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Action Navigation Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Link
              href="/proposito"
              className="bg-surface-container-lowest dark:bg-slate-900 rounded-2xl border border-outline-variant/30 dark:border-white/10 p-6 shadow-sm hover:shadow-md hover:border-primary/40 dark:hover:border-primary/40 transition-all flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-fixed-dim group-hover:scale-105 transition-transform flex-shrink-0">
                <span className="material-symbols-outlined text-2xl">event_upcoming</span>
              </div>
              <div className="flex-grow">
                <h3 className="text-base font-semibold text-on-surface dark:text-white group-hover:text-primary dark:group-hover:text-primary-fixed-dim transition-colors">
                  Gerenciar e Ajustar Escala
                </h3>
                <p className="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5">
                  Visualize as datas, altere horários ou sincronize com o Google Agenda.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-secondary dark:text-gray-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Link>

            <Link
              href="/sobre"
              className="bg-surface-container-lowest dark:bg-slate-900 rounded-2xl border border-outline-variant/30 dark:border-white/10 p-6 shadow-sm hover:shadow-md hover:border-primary/40 dark:hover:border-primary/40 transition-all flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary-container dark:bg-slate-800 flex items-center justify-center text-secondary dark:text-gray-300 group-hover:scale-105 transition-transform flex-shrink-0">
                <span className="material-symbols-outlined text-2xl">menu_book</span>
              </div>
              <div className="flex-grow">
                <h3 className="text-base font-semibold text-on-surface dark:text-white group-hover:text-primary dark:group-hover:text-primary-fixed-dim transition-colors">
                  Guia Espiritual & Fundamentos
                </h3>
                <p className="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5">
                  Instruções bíblicas para alimentar a fé enquanto o corpo jejua.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-secondary dark:text-gray-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Link>
          </section>

          {/* Banner de Instalação PWA */}
          <PWAInstallButton variant="banner" />
        </div>
      )}

      {/* Modal de Gestão do Jejum */}
      <ManageFastModal isOpen={isManageModalOpen} onClose={() => setIsManageModalOpen(false)} />
    </div>
  );
}
