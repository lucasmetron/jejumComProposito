"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useFastingStore } from "@/store/useFastingStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Sun,
  Flame,
  Calendar as CalendarIcon,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Hourglass,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { format, differenceInSeconds } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function HomePage() {
  const { hasConfigured, events, config, clearFastingData } = useFastingStore();
  const [mounted, setMounted] = useState(false);
  const [timeLeftStr, setTimeLeftStr] = useState<string>("00:00:00");
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isFastingNow, setIsFastingNow] = useState<boolean>(false);
  const [activeSession, setActiveSession] = useState<any>(null);

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

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop py-12 flex justify-center items-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const isZeroState = !hasConfigured || !events || events.length === 0;

  // Real statistics when configured
  const totalDays = events.length;
  const avgHours = config.targetHours || 0;
  const purposeName = config.purposeTitle?.trim() || "Consagração & Intimidade";

  return (
    <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop pb-section-gap flex flex-col gap-8 md:gap-10">
      {/* 1. Hero Section (Devotional Inspiration Banner) */}
      <section
        className="relative rounded-3xl overflow-hidden min-h-[240px] md:min-h-[280px] flex items-center justify-center p-6 md:p-12 border border-outline-variant/30 dark:border-white/10 shadow-[0_4px_30px_rgba(65,100,106,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)] bg-gradient-to-br from-surface-container-low/90 to-surface/90 dark:from-slate-900 dark:to-slate-800"
      >
        <div className="relative z-10 text-center max-w-2xl flex flex-col items-center gap-3 md:gap-4">
          <span className="px-4 py-1.5 rounded-full bg-secondary-container dark:bg-slate-800 text-on-secondary-container dark:text-primary-fixed-dim text-xs font-semibold uppercase tracking-widest inline-flex items-center gap-2 border border-outline-variant/30 dark:border-white/10">
            <Sun className="w-3.5 h-3.5 text-primary dark:text-primary-fixed-dim" />
            Inspiração Diária
          </span>

          <h1 className="text-2xl md:text-4xl font-normal text-on-surface dark:text-white tracking-tight leading-snug">
            &quot;O silêncio do corpo é a voz do espírito.&quot;
          </h1>

          <p className="text-xs md:text-sm text-on-surface-variant dark:text-gray-300 max-w-lg leading-relaxed">
            Reserve este momento para interiorizar suas intenções. Cada hora consagrada é um passo
            mais próximo do seu propósito espiritual.
          </p>
        </div>
      </section>

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
                  Você ainda não possui uma escala de jejum configurada. Crie seu primeiro propósito espiritual personalizado para gerar seu cronograma devocional.
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
                  Média Diária
                </div>
              </div>
              <div className="px-2">
                <div className="text-2xl md:text-3xl font-light text-tertiary dark:text-gray-400 mb-0.5">
                  0
                </div>
                <div className="text-[11px] md:text-xs text-on-surface-variant dark:text-gray-400">
                  Propósitos
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-outline-variant/20 dark:border-white/10">
              <div className="flex justify-between text-xs text-on-surface-variant dark:text-gray-400 mb-2">
                <span>Início da Jornada</span>
                <span>0% Concluído</span>
              </div>
              <div className="w-full bg-surface-container-high dark:bg-slate-800 rounded-full h-2">
                <div className="bg-primary dark:bg-primary-fixed-dim h-2 rounded-full w-0 transition-all duration-500" />
              </div>
            </div>
          </section>
        </div>
      ) : (
        /* ================= ACTIVE STATE (Configured & Persisted) ================= */
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Active / Next Fast Card */}
            <Card className="lg:col-span-8 p-6 md:p-8 flex flex-col justify-between gap-6 shadow-sm border border-outline-variant/30 dark:border-white/10 bg-surface dark:bg-slate-900">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim text-xl icon-fill">
                      local_fire_department
                    </span>
                    <h2 className="text-xl font-semibold text-on-surface dark:text-white">
                      {isFastingNow ? "Jejum em Andamento" : "Próximo Jejum Agendado"}
                    </h2>
                  </div>
                  <p className="text-xs md:text-sm text-secondary dark:text-gray-400 mt-1">
                    Propósito: <strong className="text-on-surface dark:text-gray-200">{purposeName}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      isFastingNow
                        ? "bg-primary/10 text-primary border-primary/30 dark:bg-primary/20 dark:text-primary-fixed-dim"
                        : "bg-secondary-container dark:bg-slate-800 text-on-secondary-container dark:text-gray-300 border-outline-variant/30 dark:border-white/10"
                    }`}
                  >
                    {isFastingNow ? "Em Andamento" : "Escala Agendada"}
                  </span>
                </div>
              </div>

              {/* Central Countdown & Progress */}
              <div className="flex flex-col md:flex-row items-center justify-around gap-6 py-4 bg-surface-container-low/50 dark:bg-slate-800/40 rounded-2xl p-6 border border-outline-variant/20 dark:border-white/5">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <span className="text-xs uppercase tracking-wider text-secondary dark:text-gray-400 font-semibold mb-1">
                    {isFastingNow ? "Tempo Restante para Concluir" : "Contagem Regressiva para Iniciar"}
                  </span>
                  <span className="text-3xl md:text-5xl font-mono font-light text-primary dark:text-primary-fixed-dim tracking-tight">
                    {timeLeftStr}
                  </span>
                  {activeSession && (
                    <span className="text-xs text-on-surface-variant dark:text-gray-400 mt-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {format(new Date(activeSession.start), "dd 'de' MMM, HH:mm", { locale: ptBR })} &rarr;{" "}
                      {format(new Date(activeSession.end), "HH:mm", { locale: ptBR })}
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-surface-container-high dark:text-slate-800"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-primary dark:text-primary-fixed-dim transition-all duration-1000 ease-linear"
                        strokeDasharray={`${progressPercent}, 100`}
                        strokeWidth="3"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-sm font-semibold text-on-surface dark:text-white">
                      {Math.round(progressPercent)}%
                    </span>
                  </div>
                  <span className="text-[11px] text-secondary dark:text-gray-400 font-medium">
                    Progresso da Sessão
                  </span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Link href="/proposito" className="text-xs text-primary dark:text-primary-fixed-dim font-medium hover:underline inline-flex items-center gap-1">
                  Gerenciar Escala & Sincronizar Google Agenda &rarr;
                </Link>

                <button
                  onClick={clearFastingData}
                  className="text-xs text-secondary dark:text-gray-400 hover:text-error dark:hover:text-red-400 inline-flex items-center gap-1 transition-colors"
                  title="Limpar e reiniciar jejum"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reiniciar Propósito
                </button>
              </div>
            </Card>

            {/* Quick Actions & Sessions Preview */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Upcoming sessions card */}
              <Card className="p-6 flex flex-col gap-4 border border-outline-variant/30 dark:border-white/10 bg-surface dark:bg-slate-900">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-on-surface dark:text-white flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    Próximas Sessões
                  </h3>
                  <span className="text-[11px] bg-primary/10 text-primary dark:text-primary-fixed-dim px-2 py-0.5 rounded-full font-medium">
                    {events.length} sessões
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {events.slice(0, 4).map((evt, idx) => (
                    <div
                      key={evt.id || idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low/70 dark:bg-slate-800/60 border border-outline-variant/20 dark:border-white/5 text-xs"
                    >
                      <div>
                        <div className="font-medium text-on-surface dark:text-gray-200">
                          {format(new Date(evt.start), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                        </div>
                        <div className="text-[11px] text-secondary dark:text-gray-400">
                          {format(new Date(evt.start), "HH:mm")} às {format(new Date(evt.end), "HH:mm")} ({evt.targetHours}h)
                        </div>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-primary/60 dark:bg-primary-fixed-dim flex-shrink-0" />
                    </div>
                  ))}
                </div>

                <Link href="/proposito" className="w-full">
                  <Button variant="secondary" size="sm" className="w-full text-xs">
                    Ver Escala Completa
                  </Button>
                </Link>
              </Card>
            </div>
          </div>

          {/* Journey Progress (Calculated Real) */}
          <section className="bg-surface-container-lowest dark:bg-slate-900 rounded-2xl border border-outline-variant/30 dark:border-white/10 p-6 md:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base md:text-lg font-semibold text-on-surface dark:text-white">
                Progresso da Jornada
              </h3>
              <span className="bg-primary-container/30 dark:bg-primary/20 text-on-primary-container dark:text-primary-fixed-dim text-xs px-3 py-1 rounded-full font-medium">
                {totalDays >= 21 ? "Avançado (Consagrado)" : totalDays >= 7 ? "Intermediário" : "Iniciante"}
              </span>
            </div>

            <div className="grid grid-cols-3 divide-x divide-outline-variant/30 dark:divide-white/10 text-center py-2">
              <div className="px-2">
                <div className="text-2xl md:text-3xl font-light text-primary dark:text-primary-fixed-dim mb-0.5">
                  {totalDays}
                </div>
                <div className="text-[11px] md:text-xs text-on-surface-variant dark:text-gray-400">
                  Dias Planejados
                </div>
              </div>
              <div className="px-2">
                <div className="text-2xl md:text-3xl font-light text-secondary dark:text-gray-300 mb-0.5">
                  {avgHours}h
                </div>
                <div className="text-[11px] md:text-xs text-on-surface-variant dark:text-gray-400">
                  Meta por Jejum
                </div>
              </div>
              <div className="px-2">
                <div className="text-2xl md:text-3xl font-light text-tertiary dark:text-gray-400 mb-0.5">
                  1
                </div>
                <div className="text-[11px] md:text-xs text-on-surface-variant dark:text-gray-400">
                  Propósito Ativo
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
