"use client";

import React, { useState, useEffect } from "react";
import { useFastingStore } from "@/store/useFastingStore";
import { FastingConfiguratorForm } from "@/components/configurator/FastingConfiguratorForm";
import { SchedulePreview } from "@/components/schedule/SchedulePreview";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Sun,
  Flame,
  Calendar as CalendarIcon,
  Sliders,
  Sparkles,
  Heart,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { format, differenceInSeconds } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { clsx } from "clsx";

export default function HomePage() {
  const { events, config, generateSchedule } = useFastingStore();
  const [activeTab, setActiveTab] = useState<"config" | "schedule">("config");
  const [timeLeftStr, setTimeLeftStr] = useState<string>("14:22:05");
  const [progressPercent, setProgressPercent] = useState<number>(65);

  // Initialize schedule on mount if empty
  useEffect(() => {
    if (!events || events.length === 0) {
      generateSchedule();
    }
  }, [events, generateSchedule]);

  // Live timer simulation for active session
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const nextEvent = events.find((e) => new Date(e.end) > now);

      if (nextEvent) {
        const start = new Date(nextEvent.start);
        const end = new Date(nextEvent.end);

        if (now >= start && now <= end) {
          const totalSecs = differenceInSeconds(end, start);
          const remainSecs = differenceInSeconds(end, now);
          const hours = Math.floor(remainSecs / 3600);
          const mins = Math.floor((remainSecs % 3600) / 60);
          const secs = remainSecs % 60;
          setTimeLeftStr(
            `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
          );
          const elapsed = totalSecs - remainSecs;
          setProgressPercent(Math.min(100, Math.max(0, (elapsed / totalSecs) * 100)));
        } else {
          // Time until next start
          const diff = differenceInSeconds(start, now);
          if (diff > 0) {
            const hours = Math.floor(diff / 3600);
            const mins = Math.floor((diff % 3600) / 60);
            const secs = diff % 60;
            setTimeLeftStr(
              `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
            );
            setProgressPercent(0);
          }
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [events]);

  const activeEvent = events[0];

  return (
    <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop pb-section-gap flex flex-col gap-10">
      {/* 1. Hero Section (Devotional Banner) */}
      <section
        className="relative rounded-3xl overflow-hidden min-h-[280px] flex items-center justify-center p-8 md:p-12 border border-outline-variant/30 shadow-[0_4px_30px_rgba(65,100,106,0.06)]"
        style={{
          background:
            "linear-gradient(135deg, rgba(238, 244, 255, 0.95) 0%, rgba(248, 249, 255, 0.9) 100%)",
        }}
      >
        <div className="relative z-10 text-center max-w-2xl flex flex-col items-center gap-4">
          <span className="px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold uppercase tracking-widest inline-flex items-center gap-2">
            <Sun className="w-4 h-4 text-primary" />
            Inspiração Diária
          </span>

          <h1 className="text-2xl md:text-4xl font-normal text-on-surface tracking-tight">
            &quot;O silêncio do corpo é a voz do espírito.&quot;
          </h1>

          <p className="text-sm md:text-base text-on-surface-variant max-w-lg leading-relaxed">
            Reserve este momento para interiorizar suas intenções. Cada hora consagrada é um passo
            mais próximo do seu propósito espiritual.
          </p>
        </div>
      </section>

      {/* 2. Bento Dashboard Section (Active Fast & Fast Stats) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Fast Card with Circular Progress */}
        <Card className="lg:col-span-8 p-6 md:p-8 flex flex-col justify-between gap-6 shadow-[0_4px_24px_rgba(65,100,106,0.04)]">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-on-surface">Jejum Atual & Próxima Sessão</h2>
              <p className="text-xs text-secondary mt-0.5">
                {config.purposeTitle?.trim()
                  ? `Propósito: ${config.purposeTitle}`
                  : "Propósito: Consagração & Intimidade"}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
              {activeEvent ? "Escala Ativa" : "Configurando"}
            </span>
          </div>

          {/* Circular Progress Timer */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-56 h-56 flex items-center justify-center rounded-full border border-outline-variant/30">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-surface-container-high"
                  cx="50"
                  cy="50"
                  fill="none"
                  r="44"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <circle
                  className="text-primary transition-all duration-1000 ease-out"
                  cx="50"
                  cy="50"
                  fill="none"
                  r="44"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeDasharray="276"
                  strokeDashoffset={276 - (276 * progressPercent) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="flex flex-col items-center text-center z-10">
                <span className="text-3xl md:text-4xl font-light text-on-surface tracking-tight font-mono">
                  {timeLeftStr}
                </span>
                <span className="text-xs text-secondary mt-1">tempo de consagração</span>
              </div>
            </div>
          </div>

          {/* Session start / end info */}
          <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20 text-xs sm:text-sm">
            <div>
              <span className="text-xs text-secondary font-semibold uppercase block">Início</span>
              <span className="font-semibold text-on-surface">
                {activeEvent ? format(activeEvent.start, "dd/MM 'às' HH:mm", { locale: ptBR }) : "Hoje, 08:00"}
              </span>
            </div>
            <div className="text-center">
              <span className="text-xs text-secondary font-semibold uppercase block">Janela</span>
              <span className="font-semibold text-primary">
                {activeEvent ? `${activeEvent.targetHours} horas` : `${config.targetHours}h`}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-secondary font-semibold uppercase block">Término</span>
              <span className="font-semibold text-on-surface">
                {activeEvent ? format(activeEvent.end, "dd/MM 'às' HH:mm", { locale: ptBR }) : "Hoje, 20:00"}
              </span>
            </div>
          </div>
        </Card>

        {/* Quick Actions & Spiritual Anchor Card */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="p-6 flex flex-col gap-4">
            <h3 className="font-semibold text-base text-on-surface">Ações do Propósito</h3>

            <button
              onClick={() => {
                setActiveTab("config");
                const elem = document.getElementById("configurador");
                if (elem) elem.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full flex items-center gap-3.5 p-3.5 rounded-xl border border-outline-variant/30 bg-surface hover:bg-surface-container-low transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <Sliders className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-on-surface">Configurar Propósito</span>
                <span className="text-xs text-secondary">Defina horas, dias e metas</span>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveTab("schedule");
                const elem = document.getElementById("configurador");
                if (elem) elem.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full flex items-center gap-3.5 p-3.5 rounded-xl border border-outline-variant/30 bg-surface hover:bg-surface-container-low transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-on-surface">Ver Cronograma Completo</span>
                <span className="text-xs text-secondary">{events.length} sessões planejadas</span>
              </div>
            </button>
          </Card>

          {/* Spiritual Verse Box */}
          <Card className="p-6 bg-surface-container-high border-outline-variant/20 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-primary">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Palavra de Fortalecimento</span>
            </div>
            <p className="text-xs text-on-surface italic leading-relaxed">
              &quot;Mas tu, quando jejuares, unge a tua cabeça, e lava o teu rosto, para não pareceres aos homens que jejuas, mas a teu Pai, que está em secreto; e teu Pai, que vê em secreto, te recompensará.&quot;
            </p>
            <span className="text-[11px] font-semibold text-secondary text-right">— Mateus 6:17-18</span>
          </Card>
        </div>
      </section>

      {/* 3. Main Interactive Workspace (Configurator & Preview Tabs) */}
      <section id="configurador" className="pt-4 scroll-mt-24">
        {/* Workspace Tab Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("config")}
              className={clsx(
                "px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2",
                activeTab === "config"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-secondary hover:bg-surface-container hover:text-on-surface"
              )}
            >
              <Sliders className="w-4 h-4" />
              Configurar Jejum
            </button>

            <button
              onClick={() => setActiveTab("schedule")}
              className={clsx(
                "px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2",
                activeTab === "schedule"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-secondary hover:bg-surface-container hover:text-on-surface"
              )}
            >
              <CalendarIcon className="w-4 h-4" />
              Visualizar Cronograma ({events.length})
            </button>
          </div>

          <Link
            href="/sobre"
            className="text-xs font-semibold text-primary hover:underline hidden sm:flex items-center gap-1"
          >
            Entenda o Propósito <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Tab Contents */}
        {activeTab === "config" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <FastingConfiguratorForm onGenerated={() => setActiveTab("schedule")} />
            </div>
            <div className="lg:col-span-4 sticky top-28">
              <Card className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                  <Sparkles className="w-4 h-4" />
                  Resumo em Tempo Real
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-outline-variant/20">
                    <span className="text-secondary">Duração total:</span>
                    <span className="font-semibold text-on-surface">{config.durationDays} dias</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-outline-variant/20">
                    <span className="text-secondary">Janela diária:</span>
                    <span className="font-semibold text-on-surface">{config.targetHours} horas</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-outline-variant/20">
                    <span className="text-secondary">Frequência:</span>
                    <span className="font-semibold text-on-surface">{config.frequencyDays} sessões</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-outline-variant/20">
                    <span className="text-secondary">Horário inicial:</span>
                    <span className="font-semibold text-on-surface">{config.startTime}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-outline-variant/20">
                    <span className="text-secondary">Ramp-up progressivo:</span>
                    <span className="font-semibold text-on-surface">
                      {config.rampUp ? "Ativado" : "Desativado"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-outline-variant/20">
                    <span className="text-secondary">Hidratação:</span>
                    <span className="font-semibold text-on-surface">
                      {config.isAbsoluteFast ? "Sem Água" : "Água Permitida"}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("schedule")}
                  className="w-full mt-2"
                >
                  Ver Cronograma Completo →
                </Button>
              </Card>
            </div>
          </div>
        ) : (
          <SchedulePreview />
        )}
      </section>
    </div>
  );
}
