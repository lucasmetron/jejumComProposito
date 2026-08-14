"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession, signIn } from "next-auth/react";
import {
  fastingConfigSchema,
  FastingConfigInput,
} from "@/features/schedule/schema";
import { useFastingStore, DEFAULT_CONFIG } from "@/store/useFastingStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AccordionItem } from "@/components/ui/Accordion";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Flame,
  Sparkles,
  ShieldAlert,
  Droplets,
  Shuffle,
  Sun,
  Sunrise,
  Sunset,
  CalendarDays,
  Lock,
  ChevronUp,
  ChevronDown,
  SlidersHorizontal,
  BellRing,
} from "lucide-react";
import { clsx } from "clsx";

interface TimePeriod {
  id: "morning" | "afternoon" | "night";
  name: string;
  hours: string[];
  rangeLabel: string;
  icon: any;
}

const TIME_PERIODS: TimePeriod[] = [
  {
    id: "morning",
    name: "Manhã",
    hours: ["04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00"],
    rangeLabel: "04h às 11h",
    icon: Sunrise,
  },
  {
    id: "afternoon",
    name: "Tarde",
    hours: ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
    rangeLabel: "12h às 17h",
    icon: Sun,
  },
  {
    id: "night",
    name: "Noite",
    hours: ["18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "00:00", "01:00", "02:00", "03:00"],
    rangeLabel: "18h às 03h",
    icon: Sunset,
  },
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

import { toast } from "react-toastify";

// In FastingConfiguratorForm component:
export function FastingConfiguratorForm({ onGenerated }: { onGenerated?: () => void }) {
  const { config, hasConfigured, setConfig, generateSchedule, saveAndGenerateSchedule, setSyncedCalendarEventIds, setIsGoogleCalendarSynced } = useFastingStore();
  const { data: session, status } = useSession();

  // No primeiro acesso (hasConfigured: false), usa estritamente os valores padrão estabelecidos
  const initialValues = hasConfigured ? config : DEFAULT_CONFIG;

  const [syncWithGoogle, setSyncWithGoogle] = useState(
    hasConfigured ? (config.isGoogleCalendarSynced ?? true) : true
  );
  const [includeWaterReminders, setIncludeWaterReminders] = useState(
    hasConfigured ? (config.includeWaterReminders ?? true) : true
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isGeneratingModalOpen, setIsGeneratingModalOpen] = useState(false);
  const [loadingStepText, setLoadingStepText] = useState("Gerando Jejum...");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FastingConfigInput>({
    resolver: zodResolver(fastingConfigSchema),
    defaultValues: initialValues,
  });

  const watchedValues = watch();

  const [slotTimes, setSlotTimes] = useState<{
    morning: string;
    afternoon: string;
    night: string;
  }>(() => {
    const pool = (hasConfigured ? config?.allowedStartTimes : null) || ["08:00", "12:00", "18:00"];
    const morning = pool.find((t) => TIME_PERIODS[0].hours.includes(t)) || "08:00";
    const afternoon = pool.find((t) => TIME_PERIODS[1].hours.includes(t)) || "12:00";
    const night = pool.find((t) => TIME_PERIODS[2].hours.includes(t)) || "18:00";
    return { morning, afternoon, night };
  });

  const handleStepTime = (periodId: "morning" | "afternoon" | "night", delta: number) => {
    const period = TIME_PERIODS.find((p) => p.id === periodId);
    if (!period) return;

    const currentVal = slotTimes[periodId];
    const currentIndex = period.hours.indexOf(currentVal);
    let nextIndex = currentIndex + delta;

    if (nextIndex < 0) nextIndex = period.hours.length - 1;
    if (nextIndex >= period.hours.length) nextIndex = 0;

    const newTime = period.hours[nextIndex];
    setSlotTimes((prev) => ({ ...prev, [periodId]: newTime }));

    // Atualizar no allowedStartTimes se estiver presente
    const currentPool = watchedValues.allowedStartTimes || ["08:00", "12:00", "18:00"];
    if (currentPool.includes(currentVal)) {
      const updated = currentPool.map((t) => (t === currentVal ? newTime : t));
      setValue("allowedStartTimes", updated);
    }

    // Atualizar startTime se for o selecionado no modo fixo
    if (watchedValues.startTime === currentVal) {
      setValue("startTime", newTime);
    }
  };

  // Sincronizar store e recálculo da escala em tempo real sempre que os campos mudarem
  useEffect(() => {
    const subscription = watch((value) => {
      if (value) {
        const dur = value.durationDays ? Number(value.durationDays) : 7;
        const freq = value.frequencyDays ? Number(value.frequencyDays) : dur;
        const target = value.targetHours ? Number(value.targetHours) : 12;
        setConfig({
          ...value,
          durationDays: dur,
          frequencyDays: freq,
          targetHours: target,
          isGoogleCalendarSynced: syncWithGoogle,
          includeWaterReminders,
        } as any);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setConfig, syncWithGoogle, includeWaterReminders]);

  const onSubmit = async (data: FastingConfigInput) => {
    setIsGeneratingModalOpen(true);
    setLoadingStepText("Gerando Jejum...");

    // Timer fake de no mínimo 2 segundos para dar tempo visual de processamento
    const minWaitPromise = new Promise((resolve) => setTimeout(resolve, 2000));

    const isAllDays = (data.frequencyDays || data.durationDays) >= data.durationDays;
    const finalData = {
      ...data,
      blockedDays: isAllDays ? [] : data.blockedDays,
      isGoogleCalendarSynced: syncWithGoogle,
      includeWaterReminders,
    };

    setConfig(finalData as any);
    setIsGoogleCalendarSynced(syncWithGoogle);
    const generatedEvents = saveAndGenerateSchedule();

    let syncSuccess = true;
    let syncErrorMessage = "";

    const syncTask = (async () => {
      if (syncWithGoogle && status === "authenticated" && generatedEvents.length > 0) {
        setLoadingStepText("Sincronizando com o Google Agenda & Lembretes...");
        try {
          const previousEventIds = config.syncedCalendarEventIds || [];
          const res = await fetch("/api/calendar/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              events: generatedEvents,
              previousEventIds,
              includeWaterReminders,
            }),
          });

          const json = await res.json();
          if (!res.ok) {
            syncSuccess = false;
            syncErrorMessage = json.message || "Erro ao sincronizar com Google Agenda.";
          } else if (json.eventIds && Array.isArray(json.eventIds)) {
            setSyncedCalendarEventIds(json.eventIds);
          }
        } catch (err: any) {
          syncSuccess = false;
          syncErrorMessage = err.message || "Falha na conexão com o Google Agenda.";
        }
      }
    })();

    // Aguarda o processamento E o tempo mínimo de 2 segundos (o que demorar mais)
    await Promise.all([syncTask, minWaitPromise]);

    setIsGeneratingModalOpen(false);

    if (syncSuccess) {
      toast.success(
        syncWithGoogle && status === "authenticated"
          ? "Jejum gerado e sincronizado com o Google Agenda com sucesso!"
          : "Escala de jejum espiritual gerada com sucesso!",
        {
          position: "top-right",
          autoClose: 4000,
        }
      );

      if (onGenerated) {
        onGenerated();
      }
    } else {
      toast.error(`Atenção: ${syncErrorMessage}`, {
        position: "top-right",
        autoClose: 5000,
      });

      if (onGenerated) {
        onGenerated();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* ========================================================================= */}
      {/* SEÇÃO 1: CONFIGURAÇÃO RÁPIDA (PRINCIPAL)                                  */}
      {/* ========================================================================= */}

      {/* 1. Duração & Frequência do Propósito */}
      <Card className="p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-on-surface dark:text-white">Duração & Frequência do Propósito</h2>
            <p className="text-xs text-on-surface-variant dark:text-gray-400">
              Defina a quantidade de dias totais e quantos dias de jejum fará no período
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Input de Quantidade de Dias */}
          <div>
            <label className="text-xs font-semibold uppercase text-secondary dark:text-gray-400 tracking-wider block mb-2">
              Quantidade de dias do propósito
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={40}
                value={watchedValues.durationDays ?? 7}
                onChange={(e) => {
                  const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                  setValue("durationDays", val);
                  setValue("period", val === 7 ? "weekly" : val === 30 ? "monthly" : "custom");
                  setValue("frequencyDays", val);
                }}
                className="w-full p-3.5 pl-4 pr-16 rounded-xl border border-outline-variant/40 dark:border-white/10 bg-surface-bright dark:bg-slate-800 text-on-surface dark:text-white text-base font-medium focus:border-primary dark:focus:border-primary-fixed-dim focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                placeholder="Ex: 7"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-secondary dark:text-gray-400 pointer-events-none">
                dias
              </span>
            </div>
            {errors.durationDays && (
              <p className="text-xs text-error mt-1.5">{errors.durationDays.message}</p>
            )}
          </div>

          {/* Slider de Frequência */}
          <div className="pt-4 border-t border-outline-variant/20 dark:border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase text-secondary dark:text-gray-400 tracking-wider">
                Frequência no período
              </label>
              <div className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim font-semibold px-3 py-1 rounded-full text-xs">
                {watchedValues.frequencyDays || watchedValues.durationDays || 7} {(watchedValues.frequencyDays || watchedValues.durationDays || 7) === 1 ? "dia" : "dias"} de jejum
              </div>
            </div>

            <input
              type="range"
              min={1}
              max={watchedValues.durationDays || 7}
              value={watchedValues.frequencyDays || watchedValues.durationDays || 7}
              onChange={(e) => setValue("frequencyDays", parseInt(e.target.value, 10))}
              className="w-full h-2 bg-surface-container-high dark:bg-slate-800 rounded-lg appearance-none cursor-grab active:cursor-grabbing accent-primary"
            />

            <div className="flex justify-between text-xs text-secondary dark:text-gray-400">
              <span>1 dia</span>
              <span>{Math.round((watchedValues.durationDays || 7) / 2)} dias</span>
              <span>{watchedValues.durationDays || 7} dias (Todos os dias)</span>
            </div>
            {errors.frequencyDays && (
              <p className="text-xs text-error mt-1.5">{errors.frequencyDays.message}</p>
            )}
          </div>
        </div>
      </Card>

      {/* 2. Janela Diária de Jejum */}
      <Card className="p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
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
          <div className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim font-semibold px-3.5 py-1.5 rounded-full text-sm">
            {watchedValues.targetHours}h {watchedValues.targetHours === 24 ? "(Dia Completo)" : `Jejum / ${24 - (watchedValues.targetHours || 12)}h Alimentação`}
          </div>
        </div>

        <div className="space-y-3">
          <input
            type="range"
            min={1}
            max={24}
            value={watchedValues.targetHours || 12}
            onChange={(e) => setValue("targetHours", parseInt(e.target.value, 10))}
            className="w-full h-2 bg-surface-container-high dark:bg-slate-800 rounded-lg appearance-none cursor-grab active:cursor-grabbing accent-primary"
          />
          <div className="flex justify-between text-xs text-secondary dark:text-gray-400">
            <span>1 hora (Mínimo)</span>
            <span>12 horas (Padrão)</span>
            <span>24 horas (Dia Inteiro)</span>
          </div>
        </div>
        {errors.targetHours && (
          <p className="text-xs text-error mt-2">{errors.targetHours.message}</p>
        )}
      </Card>

      {/* 3. Google Agenda & Lembretes (Visível no topo da Configuração) */}
      <Card className="p-6 md:p-8 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase text-secondary dark:text-gray-400 tracking-wider block mb-1">
            Google Agenda & Lembretes
          </label>
          <p className="text-xs text-on-surface-variant dark:text-gray-400">
            Adicione automaticamente as sessões e notificações de oração à sua agenda pessoal
          </p>
        </div>

        {status === "authenticated" ? (
          <div className="space-y-3">
            {/* Checkbox Principal do Google Agenda */}
            <label className="flex items-start justify-between p-4 rounded-xl border border-primary/40 bg-primary/5 dark:bg-primary/10 cursor-pointer hover:border-primary transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim mt-0.5 flex-shrink-0">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-on-surface dark:text-white">
                    Sincronizar no Google Agenda automaticamente
                  </div>
                  <div className="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5">
                    Adiciona os dias e horários da escala na conta <strong>{session.user?.email}</strong>.
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={syncWithGoogle}
                onChange={(e) => setSyncWithGoogle(e.target.checked)}
                className="w-5 h-5 text-primary rounded border-outline-variant focus:ring-primary mt-1 accent-primary cursor-pointer flex-shrink-0"
              />
            </label>

            {/* Sub-opção: Lembretes de Beber Água (Aparece somente quando logado e com sync ativo) */}
            {syncWithGoogle && !watchedValues.isAbsoluteFast && (
              <label className="flex items-start justify-between p-3.5 rounded-xl border border-outline-variant/30 dark:border-white/10 bg-surface-container-low/50 dark:bg-slate-800/40 cursor-pointer hover:border-primary/40 transition-colors ml-2 sm:ml-4 animate-in fade-in duration-200">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim mt-0.5 flex-shrink-0">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-xs md:text-sm text-on-surface dark:text-white flex items-center gap-2">
                      <span>Lembrete para Beber Água</span>
                      <span className="text-[10px] uppercase font-bold bg-primary/10 text-primary dark:text-primary-fixed-dim px-2 py-0.5 rounded-full">
                        Recomendado
                      </span>
                    </div>
                    <div className="text-[11px] text-on-surface-variant dark:text-gray-400 mt-0.5">
                      Inclui o cálculo e horários de hidratação (~250ml a cada 2h) na descrição dos eventos para proteger sua saúde.
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={includeWaterReminders}
                  onChange={(e) => {
                    setIncludeWaterReminders(e.target.checked);
                    setValue("includeWaterReminders", e.target.checked);
                  }}
                  className="w-4 h-4 text-primary rounded border-outline-variant focus:ring-primary mt-1 accent-primary cursor-pointer flex-shrink-0"
                />
              </label>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-outline-variant/30 dark:border-white/10 bg-surface-container-low/60 dark:bg-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-surface-container-high dark:bg-slate-700 text-secondary dark:text-gray-300 mt-0.5 flex-shrink-0">
                <CalendarDays className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-sm text-on-surface dark:text-white">
                  Adicionar lembretes no Google Agenda
                </div>
                <div className="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5">
                  Conecte sua conta Google para enviar os horários e lembretes de hidratação diretamente para sua agenda.
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => signIn("google")}
              className="flex-shrink-0 text-xs font-semibold gap-2 border-primary/40 text-primary dark:text-primary-fixed-dim hover:bg-primary/10"
            >
              Entrar com o Google
            </Button>
          </div>
        )}
      </Card>

      {/* ========================================================================= */}
      {/* SEÇÃO 2: BOTÃO E CONTEÚDO DE CONFIGURAÇÕES AVANÇADAS (EXPANSÍVEL)         */}
      {/* ========================================================================= */}

      <div className="space-y-4">
        {/* Botão de Alternar Configurações Avançadas */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={clsx(
            "w-full p-4 rounded-2xl border transition-all flex items-center justify-between text-left group shadow-sm",
            showAdvanced
              ? "border-primary/40 dark:border-primary/40 bg-primary/5 dark:bg-primary/10"
              : "border-outline-variant/30 dark:border-white/10 hover:border-primary/40 bg-surface-container-lowest dark:bg-slate-900"
          )}
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2 rounded-xl bg-secondary-container dark:bg-slate-800 text-secondary dark:text-gray-300 group-hover:text-primary dark:group-hover:text-primary-fixed-dim transition-colors">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm text-on-surface dark:text-white group-hover:text-primary dark:group-hover:text-primary-fixed-dim transition-colors">
                Configurações Avançadas
              </div>
              <div className="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5">
                {showAdvanced
                  ? "Clique para ocultar as opções detalhadas de escala"
                  : "Horários de início, bloqueio de dias da semana, modalidade e dedicação espiritual"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-primary dark:text-primary-fixed-dim">
            <span>{showAdvanced ? "Ocultar" : "Personalizar"}</span>
            <ChevronDown
              className={clsx(
                "w-4 h-4 transition-transform duration-300",
                showAdvanced && "rotate-180"
              )}
            />
          </div>
        </button>

        {/* Blocos Avançados Desocultados */}
        {showAdvanced && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Bloco 1: Horário de Início & Momento */}
            <AccordionItem
              defaultOpen={true}
              icon={<Clock className="w-5 h-5" />}
              title="Horário de Início & Momento"
              subtitle="Escolha a hora do dia e se deseja iniciar hoje, amanhã ou escolher uma data"
            >
              <div className="flex flex-col gap-5 pt-2">
                {/* Quando Começar */}
                <div>
                  <label className="text-xs font-semibold uppercase text-secondary dark:text-gray-400 tracking-wider block mb-2">
                    Começar Quando? (Data de Início)
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setValue("startOption", "today")}
                      className={clsx(
                        "p-3 rounded-xl border text-center font-medium text-xs md:text-sm transition-all",
                        watchedValues.startOption === "today"
                          ? "border-primary dark:border-primary-fixed-dim bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim ring-1 ring-primary dark:ring-primary-fixed-dim font-semibold"
                          : "border-outline-variant/40 dark:border-white/10 hover:border-primary/50 text-on-surface dark:text-gray-300 dark:hover:text-white"
                      )}
                    >
                      Hoje
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue("startOption", "tomorrow")}
                      className={clsx(
                        "p-3 rounded-xl border text-center font-medium text-xs md:text-sm transition-all",
                        watchedValues.startOption === "tomorrow"
                          ? "border-primary dark:border-primary-fixed-dim bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim ring-1 ring-primary dark:ring-primary-fixed-dim font-semibold"
                          : "border-outline-variant/40 dark:border-white/10 hover:border-primary/50 text-on-surface dark:text-gray-300 dark:hover:text-white"
                      )}
                    >
                      Amanhã
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setValue("startOption", "custom");
                        if (!watchedValues.customStartDate) {
                          const tomorrow = new Date();
                          tomorrow.setDate(tomorrow.getDate() + 1);
                          setValue("customStartDate", format(tomorrow, "yyyy-MM-dd"));
                        }
                      }}
                      className={clsx(
                        "p-3 rounded-xl border text-center font-medium text-xs md:text-sm transition-all flex items-center justify-center gap-1.5",
                        watchedValues.startOption === "custom"
                          ? "border-primary dark:border-primary-fixed-dim bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim ring-1 ring-primary dark:ring-primary-fixed-dim font-semibold"
                          : "border-outline-variant/40 dark:border-white/10 hover:border-primary/50 text-on-surface dark:text-gray-300 dark:hover:text-white"
                      )}
                    >
                      <CalendarDays className="w-4 h-4" />
                      Escolher Data
                    </button>
                  </div>

                  {/* Seletor de Data */}
                  {watchedValues.startOption === "custom" && (
                    <div className="mt-3 p-3.5 rounded-xl border border-primary/30 bg-primary/5 dark:bg-primary/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
                      <div className="flex items-center gap-2 text-xs text-primary dark:text-primary-fixed-dim font-medium">
                        <CalendarDays className="w-4 h-4 flex-shrink-0" />
                        <span>Selecione a data exata no calendário:</span>
                      </div>
                      <input
                        type="date"
                        min={format(new Date(), "yyyy-MM-dd")}
                        value={
                          typeof watchedValues.customStartDate === "string"
                            ? watchedValues.customStartDate
                            : watchedValues.customStartDate instanceof Date
                            ? format(watchedValues.customStartDate, "yyyy-MM-dd")
                            : format(new Date(), "yyyy-MM-dd")
                        }
                        onChange={(e) => {
                          setValue("startOption", "custom");
                          setValue("customStartDate", e.target.value);
                        }}
                        className="p-2.5 rounded-lg border border-outline-variant/40 dark:border-white/10 bg-surface-bright dark:bg-slate-800 text-on-surface dark:text-white text-xs font-semibold focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Estratégia de Horário: Sorteio vs Fixo */}
                <div className="pt-2 border-t border-outline-variant/20 dark:border-white/5 space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase text-secondary dark:text-gray-400 tracking-wider block mb-2">
                      Regra de Horário para a Escala
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setValue("timeMode", "random")}
                        className={clsx(
                          "p-3.5 rounded-xl border text-left transition-all flex items-start gap-3",
                          (watchedValues.timeMode || "random") === "random"
                            ? "border-primary dark:border-primary-fixed-dim bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim ring-1 ring-primary dark:ring-primary-fixed-dim"
                            : "border-outline-variant/40 dark:border-white/10 hover:border-primary/50 text-on-surface dark:text-gray-300 dark:hover:text-white"
                        )}
                      >
                        <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim flex-shrink-0 mt-0.5">
                          <Shuffle className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Sorteio Aleatório (Padrão)</div>
                          <div className="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5 leading-tight">
                            Sorteia e varia os horários de início entre os dias da escala
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setValue("timeMode", "fixed")}
                        className={clsx(
                          "p-3.5 rounded-xl border text-left transition-all flex items-start gap-3",
                          watchedValues.timeMode === "fixed"
                            ? "border-primary dark:border-primary-fixed-dim bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim ring-1 ring-primary dark:ring-primary-fixed-dim"
                            : "border-outline-variant/40 dark:border-white/10 hover:border-primary/50 text-on-surface dark:text-gray-300 dark:hover:text-white"
                        )}
                      >
                        <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim flex-shrink-0 mt-0.5">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Horário Fixo / Exato</div>
                          <div className="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5 leading-tight">
                            Todas as sessões iniciarão sempre no mesmo horário pré-estabelecido
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Sorteio Aleatório: Steppers de Horários */}
                  {(watchedValues.timeMode || "random") === "random" && (
                    <div className="p-4 rounded-2xl border border-outline-variant/30 dark:border-white/10 bg-surface-container-low/50 dark:bg-slate-800/40 space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-on-surface dark:text-white">
                          Horários participantes do sorteio:
                        </span>
                        <span className="text-[11px] text-secondary dark:text-gray-400">
                          Use as setas para ajustar o horário
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {TIME_PERIODS.map((period) => {
                          const currentTime = slotTimes[period.id];
                          const pool = watchedValues.allowedStartTimes || ["08:00", "12:00", "18:00"];
                          const isIncluded = pool.includes(currentTime);
                          const Icon = period.icon;

                          return (
                            <div
                              key={period.id}
                              onClick={() => {
                                let updated: string[];
                                if (isIncluded) {
                                  if (pool.length <= 1) return;
                                  updated = pool.filter((t) => t !== currentTime);
                                } else {
                                  updated = [...pool, currentTime];
                                }
                                setValue("allowedStartTimes", updated);
                              }}
                              className={clsx(
                                "p-3.5 rounded-2xl border transition-all flex flex-col items-center text-center cursor-pointer select-none relative",
                                isIncluded
                                  ? "border-primary dark:border-primary-fixed-dim bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim ring-1 ring-primary shadow-sm"
                                  : "border-outline-variant/30 dark:border-white/5 opacity-55 hover:opacity-90 bg-surface-container-lowest dark:bg-slate-900 text-on-surface dark:text-gray-400"
                              )}
                            >
                              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1">
                                <Icon className="w-4 h-4" />
                                <span>{period.name}</span>
                              </div>

                              {/* Stepper */}
                              <div className="flex items-center justify-center gap-1 my-1 w-full">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStepTime(period.id, -1);
                                  }}
                                  className="p-1 rounded-lg hover:bg-primary/20 dark:hover:bg-slate-700 text-primary dark:text-primary-fixed-dim hover:scale-110 active:scale-95 transition-all"
                                  title={`Horário anterior (${period.rangeLabel})`}
                                >
                                  <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                                </button>

                                <span className="font-mono font-bold text-base md:text-lg text-on-surface dark:text-white px-2 py-0.5 rounded-md bg-surface-container-high/50 dark:bg-slate-800/80 min-w-[65px]">
                                  {currentTime}
                                </span>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStepTime(period.id, 1);
                                  }}
                                  className="p-1 rounded-lg hover:bg-primary/20 dark:hover:bg-slate-700 text-primary dark:text-primary-fixed-dim hover:scale-110 active:scale-95 transition-all"
                                  title={`Próximo horário (${period.rangeLabel})`}
                                >
                                  <ChevronUp className="w-4 h-4 stroke-[2.5]" />
                                </button>
                              </div>

                              <span className="text-[10px] text-on-surface-variant dark:text-gray-400 font-medium">
                                Range: {period.rangeLabel}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Horário Fixo: Stepper Único */}
                  {watchedValues.timeMode === "fixed" && (
                    <div className="p-4 rounded-2xl border border-outline-variant/30 dark:border-white/10 bg-surface-container-low/50 dark:bg-slate-800/40 space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-on-surface dark:text-white">
                          Selecione o horário fixo de início:
                        </span>
                        <span className="text-[11px] text-secondary dark:text-gray-400">
                          Use as setas para ajustar o horário
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {TIME_PERIODS.map((period) => {
                          const currentTime = slotTimes[period.id];
                          const isSelected = watchedValues.startTime === currentTime;
                          const Icon = period.icon;

                          return (
                            <div
                              key={period.id}
                              onClick={() => setValue("startTime", currentTime)}
                              className={clsx(
                                "p-3.5 rounded-2xl border transition-all flex flex-col items-center text-center cursor-pointer select-none relative",
                                isSelected
                                  ? "border-primary dark:border-primary-fixed-dim bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim ring-1 ring-primary shadow-sm"
                                  : "border-outline-variant/30 dark:border-white/5 opacity-55 hover:opacity-90 bg-surface-container-lowest dark:bg-slate-900 text-on-surface dark:text-gray-400"
                              )}
                            >
                              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1">
                                <Icon className="w-4 h-4" />
                                <span>{period.name}</span>
                              </div>

                              {/* Stepper */}
                              <div className="flex items-center justify-center gap-1 my-1 w-full">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStepTime(period.id, -1);
                                  }}
                                  className="p-1 rounded-lg hover:bg-primary/20 dark:hover:bg-slate-700 text-primary dark:text-primary-fixed-dim hover:scale-110 active:scale-95 transition-all"
                                  title={`Horário anterior (${period.rangeLabel})`}
                                >
                                  <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                                </button>

                                <span className="font-mono font-bold text-base md:text-lg text-on-surface dark:text-white px-2 py-0.5 rounded-md bg-surface-container-high/50 dark:bg-slate-800/80 min-w-[65px]">
                                  {currentTime}
                                </span>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStepTime(period.id, 1);
                                  }}
                                  className="p-1 rounded-lg hover:bg-primary/20 dark:hover:bg-slate-700 text-primary dark:text-primary-fixed-dim hover:scale-110 active:scale-95 transition-all"
                                  title={`Próximo horário (${period.rangeLabel})`}
                                >
                                  <ChevronUp className="w-4 h-4 stroke-[2.5]" />
                                </button>
                              </div>

                              <span className="text-[10px] text-on-surface-variant dark:text-gray-400 font-medium">
                                Range: {period.rangeLabel}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </AccordionItem>

            {/* Bloco 2: Distribuição & Dias Bloqueados */}
            {(() => {
              const isAllDaysFasting = (watchedValues.frequencyDays || watchedValues.durationDays || 7) >= (watchedValues.durationDays || 7);
              return (
                <AccordionItem
                  defaultOpen={!isAllDaysFasting}
                  icon={<Shuffle className="w-5 h-5" />}
                  title="Distribuição & Dias Bloqueados"
                  subtitle={
                    isAllDaysFasting
                      ? "Opção desativada porque você selecionou jejuar em todos os dias do propósito"
                      : "Controle a alternância dos dias e proteja dias específicos de descanso"
                  }
                >
                  {isAllDaysFasting ? (
                    <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 dark:bg-primary/10 flex items-start gap-3.5 text-xs leading-relaxed text-on-surface dark:text-gray-300 animate-in fade-in">
                      <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim flex-shrink-0 mt-0.5">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <strong className="block text-sm text-primary dark:text-primary-fixed-dim font-semibold">
                          Jejum em Todos os Dias Selecionado ({watchedValues.durationDays || 7} de {watchedValues.durationDays || 7} dias)
                        </strong>
                        <p className="text-xs text-on-surface-variant dark:text-gray-400 leading-relaxed">
                          Como você escolheu jejuar em todos os dias do propósito, a escala será realizada em todos os dias consecutivos do período. Por isso, a alternância de dias e o bloqueio de datas estão desativados.
                        </p>
                      </div>
                    </div>
                  ) : (
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
                  )}
                </AccordionItem>
              );
            })()}

            {/* Bloco 3: Modalidade de Jejum (Com Água vs Sem Água) */}
            <AccordionItem
              defaultOpen={false}
              icon={<Droplets className="w-5 h-5" />}
              title="Modalidade de Jejum & Hidratação"
              subtitle="Escolha se o jejum será com água (recomendado) ou absoluto"
            >
              <div className="flex flex-col gap-4 pt-2">
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase text-secondary dark:text-gray-400 tracking-wider block">
                    Tipo de Jejum (Ingestão de Água)
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Com Água */}
                    <button
                      type="button"
                      onClick={() => setValue("isAbsoluteFast", false)}
                      className={clsx(
                        "p-4 rounded-xl border text-left transition-all flex items-start gap-3.5",
                        !watchedValues.isAbsoluteFast
                          ? "border-primary dark:border-primary-fixed-dim bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim ring-1 ring-primary dark:ring-primary-fixed-dim"
                          : "border-outline-variant/40 dark:border-white/10 hover:border-primary/50 text-on-surface dark:text-gray-300 dark:hover:text-white"
                      )}
                    >
                      <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim flex-shrink-0 mt-0.5">
                        <Droplets className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">Com Água (Padrão)</span>
                          <span className="text-[10px] uppercase font-bold bg-primary/10 text-primary dark:text-primary-fixed-dim px-2 py-0.5 rounded-full">
                            Recomendado
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant dark:text-gray-400 mt-1 leading-relaxed">
                          Permite a ingestão de água durante as {watchedValues.targetHours}h de consagração.
                        </p>
                      </div>
                    </button>

                    {/* Sem Água (Absoluto) */}
                    <button
                      type="button"
                      onClick={() => setValue("isAbsoluteFast", true)}
                      className={clsx(
                        "p-4 rounded-xl border text-left transition-all flex items-start gap-3.5",
                        watchedValues.isAbsoluteFast
                          ? "border-error dark:border-red-500 bg-error/5 dark:bg-red-950/30 text-error dark:text-red-400 ring-1 ring-error"
                          : "border-outline-variant/40 dark:border-white/10 hover:border-error/50 text-on-surface dark:text-gray-300 dark:hover:text-white"
                      )}
                    >
                      <div className="p-2 rounded-lg bg-error/10 dark:bg-red-900/40 text-error dark:text-red-400 flex-shrink-0 mt-0.5">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-error dark:text-red-400">Jejum Absoluto (Sem Água)</div>
                        <p className="text-xs text-on-surface-variant dark:text-gray-400 mt-1 leading-relaxed">
                          Abstenção total incluindo líquidos. Requer discernimento e atenção à saúde.
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Explicação do Cálculo */}
                  {!watchedValues.isAbsoluteFast && (
                    <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/10 text-xs text-on-surface dark:text-gray-300 leading-relaxed space-y-1 animate-in fade-in">
                      <div className="flex items-center gap-2 font-semibold text-primary dark:text-primary-fixed-dim">
                        <Droplets className="w-4 h-4 flex-shrink-0" />
                        <span>Como calculamos sua hidratação:</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant dark:text-gray-400">
                        Durante sua janela de <strong>{watchedValues.targetHours} horas</strong>, recomendamos o consumo de cerca de <strong>{Math.max(1, Math.floor((watchedValues.targetHours || 12) / 2)) * 250}ml</strong> de água (1 copo de 250ml a cada 2 horas) para proteger os rins e preservar a clareza mental e espiritual.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </AccordionItem>

            {/* Bloco 4: Intenção & Dedicação do Propósito */}
            <AccordionItem
              defaultOpen={false}
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
        )}
      </div>

      {/* Botão de Salvar & Gerar Escala */}
      <div className="mt-2">
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

      {/* Modal de Loading Animado ao Gerar Jejum */}
      {isGeneratingModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-surface dark:bg-slate-900 border border-outline-variant/30 dark:border-white/10 p-8 flex flex-col items-center justify-center text-center shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="relative flex items-center justify-center">
              {/* Spinning ring */}
              <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary dark:border-t-primary-fixed-dim animate-spin" />
              {/* Brand symbol pulsing inside */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/symbol.png"
                  alt="Símbolo Jejum com Propósito"
                  className="w-10 h-10 object-contain animate-pulse rounded-full"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-on-surface dark:text-white">
                {loadingStepText}
              </h3>
              <p className="text-xs text-on-surface-variant dark:text-gray-400 max-w-xs leading-relaxed">
                Calculando janelas de abstinência, hidratação e preparando sua escala espiritual.
              </p>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
