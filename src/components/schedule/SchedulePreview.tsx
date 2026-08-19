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
  CalendarPlus,
  Share2,
  HelpCircle,
  Info,
  Smartphone,
} from "lucide-react";
import { clsx } from "clsx";

interface SchedulePreviewProps {
  onEdit?: () => void;
}

export function SchedulePreview({ onEdit }: SchedulePreviewProps) {
  const { events, config, setSyncedCalendarEventIds } = useFastingStore();
  const { data: session, status } = useSession();

  const [selectedEvent, setSelectedEvent] = useState<SpiritualFastEvent | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showICSInfoModal, setShowICSInfoModal] = useState(false);
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
      const previousEventIds = config.syncedCalendarEventIds || [];
      const res = await fetch("/api/calendar/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          events,
          previousEventIds,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Erro ao sincronizar eventos.");
      }

      if (data.eventIds && Array.isArray(data.eventIds)) {
        setSyncedCalendarEventIds(data.eventIds);
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
      <Card className="p-8 text-center flex flex-col items-center justify-center min-h-[300px] border-dashed border-2 border-outline-variant/50 dark:border-white/15 bg-surface-container-lowest/50 dark:bg-slate-900/50">
        <div className="w-14 h-14 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-fixed-dim mb-4">
          <CalendarIcon className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-semibold text-on-surface dark:text-white mb-1">
          Nenhuma escala gerada ainda
        </h3>
        <p className="text-xs md:text-sm text-on-surface-variant dark:text-gray-400 max-w-sm mb-5">
          Ajuste as preferências na aba de configuração e clique em &quot;Gerar Cronograma&quot;
          para visualizar sua escala devocional.
        </p>
        {onEdit && (
          <Button onClick={onEdit} variant="primary" size="sm">
            Ir para Configuração
          </Button>
        )}
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
              ? "bg-primary-fixed/40 dark:bg-primary/20 border-primary/30 text-on-primary-container dark:text-primary-fixed-dim"
              : "bg-error-container/60 dark:bg-red-950/50 border-error/30 text-on-error-container dark:text-red-300"
          )}
        >
          {syncStatus.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-primary dark:text-primary-fixed-dim flex-shrink-0" />
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <Card className="p-4 sm:p-5 flex flex-col justify-between">
          <span className="text-xs sm:text-sm text-secondary dark:text-gray-400 font-semibold uppercase tracking-wider">
            Total de Sessões
          </span>
          <span className="text-3xl font-extrabold text-on-surface dark:text-white mt-1.5">
            {events.length}
          </span>
          <span className="text-xs sm:text-sm text-on-surface-variant dark:text-gray-400 mt-1">
            em {config.durationDays} dias de propósito
          </span>
        </Card>

        <Card className="p-4 sm:p-5 flex flex-col justify-between">
          <span className="text-xs sm:text-sm text-secondary dark:text-gray-400 font-semibold uppercase tracking-wider">
            Horas Consagradas
          </span>
          <span className="text-3xl font-extrabold text-primary dark:text-primary-fixed-dim mt-1.5">
            {totalFastHours}h
          </span>
          <span className="text-xs sm:text-sm text-on-surface-variant dark:text-gray-400 mt-1">
            tempo total planejado
          </span>
        </Card>

        <Card className="p-4 sm:p-5 flex flex-col justify-between">
          <span className="text-xs sm:text-sm text-secondary dark:text-gray-400 font-semibold uppercase tracking-wider">
            Hidratação
          </span>
          <span className="text-lg sm:text-xl font-bold text-on-surface dark:text-white mt-1.5 truncate">
            {config.isAbsoluteFast ? "Jejum Absoluto" : "Água Permitida"}
          </span>
          <span className="text-xs sm:text-sm text-on-surface-variant dark:text-gray-400 mt-1">
            {config.isAbsoluteFast ? "Sem ingestão hídrica" : "Hidratação contínua"}
          </span>
        </Card>

        <Card className="p-4 sm:p-5 flex flex-col justify-between">
          <span className="text-xs sm:text-sm text-secondary dark:text-gray-400 font-semibold uppercase tracking-wider">
            Estratégia
          </span>
          <span className="text-lg sm:text-xl font-bold text-on-surface dark:text-white mt-1.5 capitalize">
            {config.distribution === "alternated" ? "Dias Alternados" : "Aleatório Saudável"}
          </span>
          <span className="text-xs sm:text-sm text-on-surface-variant dark:text-gray-400 mt-1">
            {config.rampUp ? "Com Ramp-up progressivo" : "Horário constante"}
          </span>
        </Card>
      </div>

      {/* Export & Sync Action Bar */}
      <Card className="p-5 sm:p-6 bg-surface-container-low dark:bg-slate-900 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-fixed-dim flex-shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base sm:text-lg text-on-surface dark:text-white">
                Exportar & Sincronizar
              </h4>
              <p className="text-xs sm:text-sm text-on-surface-variant dark:text-gray-400">
                Adicione aos seus calendários ou imprima o cronograma devocional
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => exportToPDF(events, config)}
              icon={<FileText className="w-4 h-4" />}
            >
              Baixar PDF
            </Button>

            <div className="inline-flex items-center gap-1 bg-surface dark:bg-slate-800 rounded-xl p-1 border border-outline-variant/30 dark:border-white/10">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => exportToICS(events)}
                icon={<Download className="w-4 h-4" />}
                title="Baixar arquivo universal (.ics) para Apple Calendar ou Outlook"
                className="hover:bg-transparent"
              >
                Baixar .ICS
              </Button>
              <button
                type="button"
                onClick={() => setShowICSInfoModal(true)}
                title="O que é o arquivo .ICS e como usar?"
                className="p-2 mr-1 rounded-lg text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-primary/10 dark:hover:bg-primary/20 transition-all flex items-center justify-center"
              >
                <HelpCircle className="w-4 h-4 text-primary dark:text-primary-fixed-dim" />
              </button>
            </div>

            <Button
              type="button"
              variant="primary"
              size="md"
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
        </div>

        {/* Faixa Explicativa sobre o Formato .ICS */}
        <div className="pt-3.5 border-t border-outline-variant/30 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-on-surface-variant dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary dark:text-primary-fixed-dim flex-shrink-0">
              💡 O que é .ICS?
            </span>
            <span>
              Arquivo universal para importar a escala no{" "}
              <strong className="text-on-surface dark:text-white">
                Apple Calendar (iPhone/Mac)
              </strong>
              , <strong className="text-on-surface dark:text-white">Outlook</strong> ou qualquer
              aplicativo de calendário.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowICSInfoModal(true)}
            className="text-primary dark:text-primary-fixed-dim font-bold hover:underline text-xs sm:text-sm flex-shrink-0"
          >
            Como importar &rarr;
          </button>
        </div>
      </Card>

      {/* Event Cards List */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-lg sm:text-xl text-on-surface dark:text-white flex items-center gap-2.5">
            <CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6 text-primary dark:text-primary-fixed-dim" />
            Cronograma de Sessões
          </h3>
          <span className="text-xs sm:text-sm text-secondary dark:text-gray-400">
            Clique em um dia para ver detalhes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {events.map((event, index) => {
            const startDate = new Date(event.start);
            const endDate = new Date(event.end);

            return (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={clsx(
                  "p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3.5 group",
                  "bg-surface-container-lowest dark:bg-slate-900 border-outline-variant/30 dark:border-white/10 hover:border-primary dark:hover:border-primary/50 hover:shadow-sm"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim text-xs sm:text-sm font-bold flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </span>
                      <h4 className="font-bold text-base text-on-surface dark:text-white group-hover:text-primary dark:group-hover:text-primary-fixed-dim transition-colors capitalize">
                        {format(startDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-secondary dark:text-gray-400 pl-9">
                      {event.title}
                    </p>
                  </div>
                  <Badge variant="primary" size="md">
                    {event.targetHours}h de Jejum
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm text-on-surface-variant dark:text-gray-400 pt-2.5 border-t border-outline-variant/20 dark:border-white/5 pl-9">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary dark:text-primary-fixed-dim flex-shrink-0" />
                    <span className="font-medium text-on-surface dark:text-gray-300">
                      {format(startDate, "HH:mm")} &rarr; {format(endDate, "HH:mm")}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-primary dark:text-primary-fixed-dim group-hover:underline">
                    Ver detalhes &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={selectedEvent.title}
        >
          <div className="flex flex-col gap-4">
            <div className="p-4 sm:p-5 rounded-xl bg-surface-container-low dark:bg-slate-800 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-secondary dark:text-gray-400 font-bold uppercase">
                  Data e Duração
                </span>
                <Badge variant="primary" size="md">
                  {selectedEvent.targetHours} horas
                </Badge>
              </div>
              <div className="text-base sm:text-lg font-bold text-on-surface dark:text-white capitalize">
                {format(new Date(selectedEvent.start), "EEEE, dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </div>
              <div className="text-xs sm:text-sm text-secondary dark:text-gray-300 flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-primary dark:text-primary-fixed-dim" />
                <span>
                  Início: {format(new Date(selectedEvent.start), "HH:mm")} &bull; Término:{" "}
                  {format(new Date(selectedEvent.end), "HH:mm")}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs sm:text-sm font-bold text-secondary dark:text-gray-400 uppercase">
                Orientações da Sessão
              </span>
              <p className="text-sm sm:text-base text-on-surface-variant dark:text-gray-200 leading-relaxed whitespace-pre-line bg-surface-bright dark:bg-slate-800/60 p-4 rounded-xl border border-outline-variant/20 dark:border-white/5">
                {selectedEvent.description}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <Button size="md" variant="primary" onClick={() => setSelectedEvent(null)}>
                Entendido
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Explicativa do Formato .ICS */}
      <Modal
        isOpen={showICSInfoModal}
        onClose={() => setShowICSInfoModal(false)}
        title="O que é o arquivo .ICS?"
        description="Entenda como funciona o formato universal de calendário e como utilizá-lo no seu celular ou computador."
      >
        <div className="flex flex-col gap-4 py-2 text-sm sm:text-base text-on-surface dark:text-gray-200 leading-relaxed">
          <div className="p-4 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/20 space-y-2">
            <h4 className="font-bold text-primary dark:text-primary-fixed-dim flex items-center gap-2 text-base">
              <CalendarCheck className="w-5 h-5" />
              <span>Formato Universal iCalendar (.ics)</span>
            </h4>
            <p className="text-xs sm:text-sm text-on-surface-variant dark:text-gray-300">
              O <strong>.ICS</strong> é o padrão internacional de troca de calendários. Ele permite
              que todos os dias, horários de abstinência e lembretes do seu propósito sejam
              importados de uma só vez para o seu aplicativo de agenda favorito, sem precisar
              digitar evento por evento.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-secondary dark:text-gray-400">
              Como importar no seu dispositivo:
            </h5>

            <div className="p-4 rounded-xl border border-outline-variant/30 dark:border-white/10 space-y-1 bg-surface-bright dark:bg-slate-800">
              <div className="font-bold text-sm text-on-surface dark:text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-primary dark:text-primary-fixed-dim" />
                <span>No iPhone / iPad (Apple Calendar):</span>
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant dark:text-gray-300 mt-1">
                1. Toque em <strong>&quot;Baixar .ICS&quot;</strong>.<br />
                2. Abra o arquivo baixado no iOS e toque em{" "}
                <strong>&quot;Adicionar Todos&quot;</strong>.<br />
                3. Pronto! Todas as sessões e notificações de oração ficam salvas no seu calendário
                da Apple.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-outline-variant/30 dark:border-white/10 space-y-1 bg-surface-bright dark:bg-slate-800">
              <div className="font-bold text-sm text-on-surface dark:text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary dark:text-primary-fixed-dim" />
                <span>No Microsoft Outlook / Outros Aplicativos:</span>
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant dark:text-gray-300 mt-1">
                Dê um duplo clique no arquivo <strong>.ics</strong> baixado no seu computador ou
                importe-o através do menu{" "}
                <em>Arquivo &rarr; Abrir e Exportar &rarr; Importar Calendário</em>.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" size="md" onClick={() => setShowICSInfoModal(false)}>
              Fechar
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setShowICSInfoModal(false);
                exportToICS(events);
              }}
              icon={<Download className="w-4 h-4" />}
            >
              Baixar .ICS Agora
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
