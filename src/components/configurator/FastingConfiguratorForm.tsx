"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  fastingConfigSchema,
  FastingConfigInput,
} from "@/features/schedule/schema";
import { useFastingStore } from "@/store/useFastingStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AccordionItem } from "@/components/ui/Accordion";
import {
  Calendar,
  Clock,
  Sliders,
  Sparkles,
  ShieldAlert,
  Droplets,
  TrendingUp,
  Shuffle,
  Sun,
  Sunrise,
  Sunset,
  Check,
} from "lucide-react";
import { clsx } from "clsx";

const DURATION_PRESETS = [
  { label: "1 Dia", value: 1, period: "custom" as const },
  { label: "3 Dias", value: 3, period: "custom" as const },
  { label: "7 Dias (1 Sem)", value: 7, period: "weekly" as const },
  { label: "14 Dias (2 Sem)", value: 14, period: "custom" as const },
  { label: "21 Dias (Daniel)", value: 21, period: "custom" as const },
  { label: "30 Dias (1 Mês)", value: 30, period: "monthly" as const },
];

const WINDOW_PRESETS = [
  { hours: 12, label: "12h Jejum", sub: "12h Jejum / 12h Alimentação" },
  { hours: 14, label: "14h Jejum", sub: "14h Jejum / 10h Alimentação" },
  { hours: 16, label: "16h Jejum", sub: "16h Jejum / 8h Alimentação (Clássico)" },
  { hours: 18, label: "18h Jejum", sub: "18h Jejum / 6h Alimentação" },
  { hours: 24, label: "24h Jejum", sub: "Dia Inteiro de Consagração" },
];

const START_TIMES = [
  { value: "08:00", label: "08:00", sub: "Manhã", icon: Sunrise },
  { value: "12:00", label: "12:00", sub: "Meio-dia", icon: Sun },
  { value: "18:00", label: "18:00", sub: "Noite", icon: Sunset },
];

const WEEKDAYS = [
  { day: 0, label: "Dom", full: "Domingo" },
  { day: 1, label: "Seg", full: "Segunda" },
  { day: 2, label: "Ter", full: "Terça" },
  { day: 3, label: "Qua", full: "Quarta" },
  { day: 4, label: "Qui", full: "Quinta" },
  { day: 5, label: "Sex", full: "Sexta" },
  { day: 6, label: "Sáb", full: "Sábado" },
];

export function FastingConfiguratorForm({ onGenerated }: { onGenerated?: () => void }) {
  const { config, setConfig, generateSchedule } = useFastingStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FastingConfigInput>({
    resolver: zodResolver(fastingConfigSchema),
    defaultValues: config,
  });

  const watchedValues = watch();

  // Keep store in sync when values change
  useEffect(() => {
    const subscription = watch((value) => {
      if (value) {
        setConfig(value as any);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setConfig]);

  const onSubmit = (data: FastingConfigInput) => {
    setConfig(data as any);
    generateSchedule();
    if (onGenerated) onGenerated();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* 1. Duração do Propósito */}
      <Card className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-on-surface dark:text-white">Duração do Propósito</h2>
            <p className="text-xs text-on-surface-variant dark:text-gray-400">Quantos dias durará sua jornada espiritual total</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {DURATION_PRESETS.map((preset) => {
            const isSelected = watchedValues.durationDays === preset.value;
            return (
              <button
                type="button"
                key={preset.value}
                onClick={() => {
                  setValue("durationDays", preset.value);
                  setValue("period", preset.period);
                  if (watchedValues.frequencyDays > preset.value) {
                    setValue("frequencyDays", preset.value);
                  }
                }}
                className={clsx(
                  "p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[68px]",
                  isSelected
                    ? "border-primary dark:border-primary-fixed-dim bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim ring-1 ring-primary dark:ring-primary-fixed-dim shadow-sm"
                    : "border-outline-variant/40 dark:border-white/10 hover:border-primary/50 text-on-surface dark:text-gray-300 dark:hover:text-white"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{preset.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-primary dark:text-primary-fixed-dim" />}
                </div>
                <span className="text-xs text-on-surface-variant dark:text-gray-400">
                  {preset.value === 1 ? "1 dia único" : `${preset.value} dias corridos`}
                </span>
              </button>
            );
          })}
        </div>
        {errors.durationDays && (
          <p className="text-xs text-error mt-2">{errors.durationDays.message}</p>
        )}
      </Card>

      {/* 2. Janela Diária de Jejum */}
      <Card className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-on-surface dark:text-white">Janela Diária de Jejum</h2>
            <p className="text-xs text-on-surface-variant dark:text-gray-400">
              Quantidade de horas consecutivas de abstinência por sessão
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {WINDOW_PRESETS.map((preset) => {
            const isSelected = watchedValues.targetHours === preset.hours;
            return (
              <button
                type="button"
                key={preset.hours}
                onClick={() => setValue("targetHours", preset.hours)}
                className={clsx(
                  "p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1",
                  isSelected
                    ? "border-primary dark:border-primary-fixed-dim bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim ring-1 ring-primary dark:ring-primary-fixed-dim shadow-sm"
                    : "border-outline-variant/40 dark:border-white/10 hover:border-primary/50 text-on-surface dark:text-gray-300 dark:hover:text-white"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{preset.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-primary dark:text-primary-fixed-dim" />}
                </div>
                <span className="text-xs text-on-surface-variant dark:text-gray-400 leading-tight">{preset.sub}</span>
              </button>
            );
          })}
        </div>
        {errors.targetHours && (
          <p className="text-xs text-error mt-2">{errors.targetHours.message}</p>
        )}
      </Card>

      {/* 3. Frequência de Dias */}
      <Card className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-on-surface dark:text-white">Frequência no Período</h2>
              <p className="text-xs text-on-surface-variant dark:text-gray-400">
                Quantos dias você fará o jejum dentro dos {watchedValues.durationDays} dias totais
              </p>
            </div>
          </div>
          <div className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim font-semibold px-3.5 py-1.5 rounded-full text-sm">
            {watchedValues.frequencyDays} {watchedValues.frequencyDays === 1 ? "dia" : "dias"}
          </div>
        </div>

        <div className="space-y-3">
          <input
            type="range"
            min={1}
            max={watchedValues.durationDays || 7}
            value={watchedValues.frequencyDays}
            onChange={(e) => setValue("frequencyDays", parseInt(e.target.value, 10))}
            className="w-full h-2 bg-surface-container-high dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-secondary dark:text-gray-400">
            <span>1 dia</span>
            <span>{Math.round((watchedValues.durationDays || 7) / 2)} dias</span>
            <span>{watchedValues.durationDays || 7} dias (Todos)</span>
          </div>
        </div>
        {errors.frequencyDays && (
          <p className="text-xs text-error mt-2">{errors.frequencyDays.message}</p>
        )}
      </Card>

      {/* 4. Configurações Avançadas e Espirituais */}
      <div className="flex flex-col gap-4">
        {/* Horário de Início & Ponto de Partida */}
        <AccordionItem
          defaultOpen={true}
          icon={<Sunrise className="w-5 h-5" />}
          title="Horário de Início & Momento"
          subtitle="Escolha a hora do dia e se deseja iniciar hoje ou amanhã"
        >
          <div className="flex flex-col gap-5 pt-2">
            {/* Início Hoje / Amanhã */}
            <div>
              <label className="text-xs font-semibold uppercase text-secondary dark:text-gray-400 tracking-wider block mb-2">
                Começar quando?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setValue("startOption", "today")}
                  className={clsx(
                    "p-3 rounded-xl border text-center font-medium text-sm transition-all",
                    watchedValues.startOption === "today"
                      ? "border-primary dark:border-primary-fixed-dim bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim ring-1 ring-primary dark:ring-primary-fixed-dim"
                      : "border-outline-variant/40 dark:border-white/10 hover:border-primary/50 text-on-surface dark:text-gray-300 dark:hover:text-white"
                  )}
                >
                  Hoje
                </button>
                <button
                  type="button"
                  onClick={() => setValue("startOption", "tomorrow")}
                  className={clsx(
                    "p-3 rounded-xl border text-center font-medium text-sm transition-all",
                    watchedValues.startOption === "tomorrow"
                      ? "border-primary dark:border-primary-fixed-dim bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim ring-1 ring-primary dark:ring-primary-fixed-dim"
                      : "border-outline-variant/40 dark:border-white/10 hover:border-primary/50 text-on-surface dark:text-gray-300 dark:hover:text-white"
                  )}
                >
                  Amanhã
                </button>
              </div>
            </div>

            {/* Presets de Horário */}
            <div>
              <label className="text-xs font-semibold uppercase text-secondary dark:text-gray-400 tracking-wider block mb-2">
                Horário de Início
              </label>
              <div className="grid grid-cols-3 gap-3">
                {START_TIMES.map((time) => {
                  const isSelected = watchedValues.startTime === time.value;
                  const Icon = time.icon;
                  return (
                    <button
                      type="button"
                      key={time.value}
                      onClick={() => setValue("startTime", time.value)}
                      className={clsx(
                        "p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1",
                        isSelected
                          ? "border-primary dark:border-primary-fixed-dim bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim ring-1 ring-primary dark:ring-primary-fixed-dim"
                          : "border-outline-variant/40 dark:border-white/10 hover:border-primary/50 text-on-surface dark:text-gray-300 dark:hover:text-white"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-semibold text-sm">{time.label}</span>
                      <span className="text-[11px] text-on-surface-variant dark:text-gray-400">{time.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </AccordionItem>

        {/* Estratégia de Distribuição & Dias Bloqueados */}
        <AccordionItem
          defaultOpen={true}
          icon={<Shuffle className="w-5 h-5" />}
          title="Distribuição & Dias Bloqueados"
          subtitle="Controle a alternância dos dias e proteja dias específicos de descanso"
        >
          <div className="flex flex-col gap-5 pt-2">
            {/* Alternado vs Aleatório */}
            <div>
              <label className="text-xs font-semibold uppercase text-secondary dark:text-gray-400 tracking-wider block mb-2">
                Padrão de Distribuição
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setValue("distribution", "alternated")}
                  className={clsx(
                    "p-3 rounded-xl border text-left transition-all",
                    watchedValues.distribution === "alternated"
                      ? "border-primary dark:border-primary-fixed-dim bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim ring-1 ring-primary dark:ring-primary-fixed-dim"
                      : "border-outline-variant/40 dark:border-white/10 hover:border-primary/50 text-on-surface dark:text-gray-300 dark:hover:text-white"
                  )}
                >
                  <div className="font-semibold text-sm">Alternado</div>
                  <div className="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5">
                    Pula pelo menos 1 dia de descanso entre cada jejum
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setValue("distribution", "random")}
                  className={clsx(
                    "p-3 rounded-xl border text-left transition-all",
                    watchedValues.distribution === "random"
                      ? "border-primary dark:border-primary-fixed-dim bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim ring-1 ring-primary dark:ring-primary-fixed-dim"
                      : "border-outline-variant/40 dark:border-white/10 hover:border-primary/50 text-on-surface dark:text-gray-300 dark:hover:text-white"
                  )}
                >
                  <div className="font-semibold text-sm">Aleatório Saudável</div>
                  <div className="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5">
                    Espaçamento equilibrado ao longo do período
                  </div>
                </button>
              </div>
            </div>

            {/* Dias Bloqueados */}
            <div>
              <label className="text-xs font-semibold uppercase text-secondary dark:text-gray-400 tracking-wider block mb-1">
                Dias Bloqueados (NUNCA agendar nestes dias)
              </label>
              <p className="text-xs text-on-surface-variant dark:text-gray-400 mb-2.5">
                Clique nos dias da semana em que você tem compromissos ou reuniões inadiáveis.
              </p>
              <div className="grid grid-cols-7 gap-2">
                {WEEKDAYS.map((w) => {
                  const isBlocked = (watchedValues.blockedDays || []).includes(w.day);
                  return (
                    <button
                      type="button"
                      key={w.day}
                      onClick={() => {
                        const current = watchedValues.blockedDays || [];
                        const updated = isBlocked
                          ? current.filter((d) => d !== w.day)
                          : [...current, w.day];
                        setValue("blockedDays", updated);
                      }}
                      className={clsx(
                        "p-2.5 rounded-lg border text-center transition-all flex flex-col items-center",
                        isBlocked
                          ? "bg-error-container/60 dark:bg-red-950/60 border-error/40 text-on-error-container dark:text-red-300 line-through"
                          : "border-outline-variant/40 dark:border-white/10 hover:border-primary/50 text-on-surface dark:text-gray-300"
                      )}
                    >
                      <span className="text-xs font-semibold">{w.label}</span>
                    </button>
                  );
                })}
              </div>
              {errors.blockedDays && (
                <p className="text-xs text-error mt-2">{errors.blockedDays.message}</p>
              )}
            </div>
          </div>
        </AccordionItem>

        {/* Ramp-up & Jejum Absoluto (Hidratação) */}
        <AccordionItem
          defaultOpen={true}
          icon={<Droplets className="w-5 h-5" />}
          title="Adaptação (Ramp-up) & Hidratação"
          subtitle="Progressão de horas e diretrizes de jejum com água vs absoluto"
        >
          <div className="flex flex-col gap-4 pt-2">
            {/* Ramp-up toggle */}
            <label className="flex items-start justify-between p-4 rounded-xl border border-outline-variant/30 dark:border-white/10 bg-surface-container-low dark:bg-slate-800/60 cursor-pointer hover:border-primary/40 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim mt-0.5">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-on-surface dark:text-white">
                    Progressão Gradual (Ramp-up)
                  </div>
                  <div className="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5">
                    Inicia os primeiros jejuns com menor duração e sobe gradualmente até atingir a meta de {watchedValues.targetHours}h.
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={watchedValues.rampUp}
                onChange={(e) => setValue("rampUp", e.target.checked)}
                className="w-5 h-5 text-primary rounded border-outline-variant focus:ring-primary mt-1 accent-primary"
              />
            </label>

            {/* Absolute Fast toggle */}
            <label className="flex items-start justify-between p-4 rounded-xl border border-outline-variant/30 dark:border-white/10 bg-surface-container-low dark:bg-slate-800/60 cursor-pointer hover:border-primary/40 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-error/10 dark:bg-red-900/30 text-error dark:text-red-400 mt-0.5">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-on-surface dark:text-white">
                    Jejum Absoluto (Sem Água)
                  </div>
                  <div className="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5">
                    Abstenção total incluindo líquidos. Se desmarcado (padrão), os títulos e lembretes sugerem consumo saudável de água.
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={watchedValues.isAbsoluteFast}
                onChange={(e) => setValue("isAbsoluteFast", e.target.checked)}
                className="w-5 h-5 text-error rounded border-outline-variant focus:ring-error mt-1 accent-red-600"
              />
            </label>
          </div>
        </AccordionItem>

        {/* Intenção Espiritual & Nome do Propósito */}
        <AccordionItem
          icon={<Sparkles className="w-5 h-5" />}
          title="Intenção & Dedicação do Propósito"
          subtitle="Adicione um título e motivo de oração personalizado para a sua escala"
        >
          <div className="flex flex-col gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold uppercase text-secondary dark:text-gray-400 tracking-wider block mb-1">
                Título do Propósito (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: Jejum de Daniel, Consagração Familiar, Direção Profissional..."
                {...register("purposeTitle")}
                className="w-full p-3 rounded-xl border border-outline-variant/40 dark:border-white/10 bg-surface-bright dark:bg-slate-800 text-on-surface dark:text-white text-sm focus:border-primary dark:focus:border-primary-fixed-dim focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-secondary dark:text-gray-400 tracking-wider block mb-1">
                Motivo / Intenção de Oração (Opcional)
              </label>
              <textarea
                rows={3}
                placeholder="Escreva pelo que você está clamando e jejuando neste período..."
                {...register("intention")}
                className="w-full p-3 rounded-xl border border-outline-variant/40 dark:border-white/10 bg-surface-bright dark:bg-slate-800 text-on-surface dark:text-white text-sm focus:border-primary dark:focus:border-primary-fixed-dim focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
          </div>
        </AccordionItem>
      </div>

      {/* Botão de Geração / Salvar */}
      <div className="mt-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full shadow-md hover:shadow-lg text-base"
          icon={<Sparkles className="w-5 h-5" />}
        >
          Salvar Propósito & Gerar Escala
        </Button>
      </div>
    </form>
  );
}
