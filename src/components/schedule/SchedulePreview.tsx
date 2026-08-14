"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSession, signIn } from "next-auth/react";
import { useFastingStore } from "@/store/useFastingStore";
import { SpiritualFastEvent } from "@/features/schedule/types";
import { exportToPDF } from "@/features/export/exportToPDF";
import { exportToICS } from "@/features/export/exportToICS";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  Calendar as CalendarIcon,
  Download,
  CalendarCheck,
  FileText,
  Clock,
  Droplets,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Share2,
  CalendarPlus,
} from "lucide-react";
import { clsx } from "clsx";

export function SchedulePreview() {
  const { events, config } = useFastingStore();
  const { data: session, status } = useSession();

  const [selectedEvent, setSelectedEvent] = useState<SpiritualFastEvent | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const totalFastHours = events.reduce((acc, ev) => acc + ev.targetHours, 0);

  const handleGoogleSync = async () => {
    if (status !== "authenticated") {
      signIn("google");
      return;
    }

    setIsSyncing(true);
    setSyncStatus({ type: null, message: "" });

    try {
      const res = await fetch("/api/calendar/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Erro ao sincronizar eventos.");
      }

      setSyncStatus({
        type: "success",
        message: data.message || "Eventos sincronizados com sucesso no Google Agenda!",
      });
    } catch (err: any) {
      setSyncStatus({
        type: "error",
        message: err.message || "Ocorreu um erro ao sincronizar com o Google Agenda.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  if (!events || events.length === 0) {
    return (
      <Card className="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          <CalendarIcon className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-semibold text-on-surface mb-1">Nenhum propósito gerado</h3>
        <p className="text-sm text-on-surface-variant max-w-sm">
          Ajuste as preferências no configurador ao lado e clique em &quot;Gerar Cronograma&quot; para visualizar sua escala de jejum.
        </p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Sync Status Banner */}
      {syncStatus.type && (
        <div
          className={clsx(
            "p-4 rounded-xl flex items-center gap-3 border text-sm animate-in fade-in duration-200",
            syncStatus.type === "success"
              ? "bg-primary-fixed/40 border-primary/30 text-on-primary-container"
              : "bg-error-container/60 border-error/30 text-on-error-container"
          )}
        >
          {syncStatus.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-error flex-shrink-0" />
          )}
          <span className="flex-grow">{syncStatus.message}</span>
          <button
            onClick={() => setSyncStatus({ type: null, message: "" })}
            className="text-xs underline opacity-80 hover:opacity-100"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Overview Stats Bento */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 flex flex-col">
          <span className="text-xs text-secondary font-medium uppercase tracking-wider">
            Total de Sessões
          </span>
          <span className="text-2xl font-bold text-on-surface mt-1">{events.length}</span>
          <span className="text-[11px] text-on-surface-variant mt-0.5">
            em {config.durationDays} dias de propósito
          </span>
        </Card>

        <Card className="p-4 flex flex-col">
          <span className="text-xs text-secondary font-medium uppercase tracking-wider">
            Horas de Consagração
          </span>
          <span className="text-2xl font-bold text-primary mt-1">{totalFastHours}h</span>
          <span className="text-[11px] text-on-surface-variant mt-0.5">tempo total consagrado</span>
        </Card>

        <Card className="p-4 flex flex-col">
          <span className="text-xs text-secondary font-medium uppercase tracking-wider">
            Hidratação
          </span>
          <span className="text-sm font-bold text-on-surface mt-2 truncate">
            {config.isAbsoluteFast ? "Jejum Absoluto" : "Água Permitida"}
          </span>
          <span className="text-[11px] text-on-surface-variant mt-0.5">
            {config.isAbsoluteFast ? "Sem ingestão hídrica" : "Hidratação contínua"}
          </span>
        </Card>

        <Card className="p-4 flex flex-col">
          <span className="text-xs text-secondary font-medium uppercase tracking-wider">
            Estratégia
          </span>
          <span className="text-sm font-bold text-on-surface mt-2 capitalize">
            {config.distribution === "alternated" ? "Dias Alternados" : "Aleatório Saudável"}
          </span>
          <span className="text-[11px] text-on-surface-variant mt-0.5">
            {config.rampUp ? "Com Ramp-up progressivo" : "Horário constante"}
          </span>
        </Card>
      </div>

      {/* Export & Sync Action Bar */}
      <Card className="p-5 bg-surface-container-low flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Share2 className="w-5 h-5 text-primary" />
          <div>
            <h4 className="font-semibold text-sm text-on-surface">Exportar & Sincronizar</h4>
            <p className="text-xs text-on-surface-variant">
              Adicione aos seus calendários ou imprima o cronograma devocional
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => exportToPDF(events, config)}
            icon={<FileText className="w-4 h-4" />}
          >
            Baixar PDF
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => exportToICS(events)}
            icon={<Download className="w-4 h-4" />}
          >
            Baixar .ICS
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleGoogleSync}
            disabled={isSyncing}
            icon={<CalendarPlus className="w-4 h-4" />}
          >
            {isSyncing
              ? "Sincronizando..."
              : status === "authenticated"
              ? "Sincronizar Google Agenda"
              : "Conectar & Sincronizar Google"}
          </Button>
        </div>
      </Card>

      {/* Event Cards List */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-semibold text-base text-on-surface flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-primary" />
            Cronograma de Sessões
          </h3>
          <span className="text-xs text-on-surface-variant">Clique para ver detalhes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {events.map((event, idx) => {
            const startFormatted = format(event.start, "EEEE, dd 'de' MMMM", { locale: ptBR });
            const timeRange = `${format(event.start, "HH:mm")} às ${format(event.end, "HH:mm")}`;

            return (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="p-5 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest hover:border-primary/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-surface-container-high text-primary">
                        Sessão {event.sessionNumber}/{event.totalSessions}
                      </span>
                      {event.isAbsoluteFast ? (
                        <Badge variant="absolute">Sem Água</Badge>
                      ) : (
                        <Badge variant="water">Água Permitida</Badge>
                      )}
                    </div>
                    <h4 className="font-semibold text-sm text-on-surface capitalize group-hover:text-primary transition-colors">
                      {startFormatted}
                    </h4>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-bold text-primary text-base">
                      {event.targetHours}h
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20 text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1.5 font-medium text-on-surface">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {timeRange}
                  </span>
                  <span className="text-primary font-medium group-hover:underline">
                    Ver detalhes →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={`Sessão ${selectedEvent.sessionNumber} de ${selectedEvent.totalSessions}`}
          description={format(selectedEvent.start, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        >
          <div className="flex flex-col gap-5 pt-2">
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-secondary uppercase font-semibold">
                  Janela de Consagração
                </span>
                <div className="text-lg font-bold text-primary">
                  {format(selectedEvent.start, "HH:mm")} às {format(selectedEvent.end, "HH:mm")}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-secondary uppercase font-semibold">Duração</span>
                <div className="text-lg font-bold text-on-surface">
                  {selectedEvent.targetHours} Horas
                </div>
              </div>
            </div>

            {/* Hydration Guidance Card */}
            <div
              className={clsx(
                "p-4 rounded-xl border flex items-start gap-3",
                selectedEvent.isAbsoluteFast
                  ? "bg-error-container/40 border-error/30 text-on-error-container"
                  : "bg-primary-fixed/30 border-primary/30 text-on-primary-container"
              )}
            >
              <Droplets className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <span className="font-semibold block mb-0.5">
                  {selectedEvent.isAbsoluteFast
                    ? "Jejum Absoluto (Sem Água)"
                    : "Orientação de Hidratação"}
                </span>
                {selectedEvent.isAbsoluteFast
                  ? "Este propósito é de abstenção completa sem ingestão de líquidos. Preserve suas energias e permaneça em oração contínua."
                  : "Beba água regularmente durante este período para preservar o bom funcionamento do corpo enquanto você dedica sua mente e espírito à oração."}
              </div>
            </div>

            {/* Description details */}
            <div>
              <span className="text-xs font-semibold uppercase text-secondary tracking-wider block mb-1">
                Descrição do Evento no Calendário
              </span>
              <pre className="text-xs bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30 text-on-surface whitespace-pre-wrap font-sans">
                {selectedEvent.description}
              </pre>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedEvent(null)}>
                Fechar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
