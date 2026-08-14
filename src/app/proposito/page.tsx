"use client";

import React, { useState, useEffect } from "react";
import { useFastingStore } from "@/store/useFastingStore";
import { FastingConfiguratorForm } from "@/components/configurator/FastingConfiguratorForm";
import { SchedulePreview } from "@/components/schedule/SchedulePreview";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Sliders,
  Calendar as CalendarIcon,
  Flame,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

export default function PropositoPage() {
  const { hasConfigured, events, saveAndGenerateSchedule } = useFastingStore();
  const [activeTab, setActiveTab] = useState<"config" | "schedule">("config");
  const [justSaved, setJustSaved] = useState(false);

  // Switch to schedule on save and scroll smoothly to top
  const handleSaved = () => {
    setActiveTab("schedule");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop pb-section-gap flex flex-col gap-8">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div>
          <div className="flex items-center gap-2 text-xs text-secondary dark:text-gray-400 mb-1">
            <Link href="/" className="hover:text-primary dark:hover:text-primary-fixed-dim transition-colors">
              Início
            </Link>
            <span>/</span>
            <span className="text-on-surface dark:text-gray-200 font-medium">Propósito</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface dark:text-white tracking-tight flex items-center gap-2.5">
            <Flame className="w-7 h-7 text-primary dark:text-primary-fixed-dim" />
            Configurador de Propósito & Escala
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant dark:text-gray-400 mt-1 max-w-2xl">
            Defina os parâmetros do seu jejum espiritual. O algoritmo calculará a distribuição ideal de dias e horários para você exportar e sincronizar.
          </p>
        </div>

        {/* Tab Toggle Buttons */}
        <div className="flex items-center bg-surface-container-low dark:bg-slate-900 p-1.5 rounded-2xl border border-outline-variant/30 dark:border-white/10 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("config")}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all",
              activeTab === "config"
                ? "bg-surface-container-lowest dark:bg-slate-800 text-primary dark:text-primary-fixed-dim shadow-sm font-semibold"
                : "text-secondary dark:text-gray-400 hover:text-on-surface dark:hover:text-gray-200"
            )}
          >
            <Sliders className="w-4 h-4" />
            Configuração
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all relative",
              activeTab === "schedule"
                ? "bg-surface-container-lowest dark:bg-slate-800 text-primary dark:text-primary-fixed-dim shadow-sm font-semibold"
                : "text-secondary dark:text-gray-400 hover:text-on-surface dark:hover:text-gray-200"
            )}
          >
            <CalendarIcon className="w-4 h-4" />
            Minha Escala
            {events.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {justSaved && (
        <div className="p-4 rounded-2xl bg-primary/10 dark:bg-primary/20 border border-primary/30 flex items-center justify-between gap-4 text-xs md:text-sm text-primary dark:text-primary-fixed-dim animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>
              <strong>Propósito salvo com sucesso!</strong> Seus dados foram persistidos no navegador e a escala foi gerada.
            </span>
          </div>
          <Link href="/">
            <Button size="sm" variant="primary" className="text-xs px-3">
              Ver no Início &rarr;
            </Button>
          </Link>
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Active view: Form or Preview */}
        <div className="lg:col-span-12">
          {activeTab === "config" ? (
            <div className="flex flex-col gap-6">
              <FastingConfiguratorForm onGenerated={handleSaved} />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <SchedulePreview onEdit={() => setActiveTab("config")} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
