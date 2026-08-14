"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useFastingStore } from "@/store/useFastingStore";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  CalendarSync,
  HeartCrack,
  Trash2,
  SlidersHorizontal,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  CalendarDays,
} from "lucide-react";
import { clsx } from "clsx";

import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { Flame } from "lucide-react";

interface ManageFastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = "menu" | "reschedule" | "interrupt" | "delete";

export function ManageFastModal({ isOpen, onClose }: ManageFastModalProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { config, rescheduleSchedule, interruptFast, clearFastingData, setSyncedCalendarEventIds } = useFastingStore();

  const [view, setView] = useState<ViewState>("menu");
  const [reflection, setReflection] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [customDate, setCustomDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [loadingModalText, setLoadingModalText] = useState("Processando...");

  const handleClose = () => {
    setView("menu");
    setReflection("");
    setFeedbackMsg(null);
    setShowDatePicker(false);
    setIsLoadingModal(false);
    onClose();
  };

  const handleReschedule = async (startOption: "today" | "tomorrow" | "custom", date?: string) => {
    setIsLoadingModal(true);
    setLoadingModalText("Reajustando cronograma e atualizando Google Agenda...");

    const minWaitPromise = new Promise((resolve) => setTimeout(resolve, 2000));
    let syncError = false;

    const task = (async () => {
      const updatedEvents = rescheduleSchedule(startOption, date);

      // Se o usuário estiver autenticado e possuir eventos sincronizados no Google Agenda
      if (status === "authenticated" && (config.isGoogleCalendarSynced || (config.syncedCalendarEventIds && config.syncedCalendarEventIds.length > 0))) {
        try {
          const previousEventIds = config.syncedCalendarEventIds || [];
          const res = await fetch("/api/calendar/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              events: updatedEvents,
              previousEventIds,
              includeWaterReminders: config.includeWaterReminders,
            }),
          });
          if (res.ok) {
            const json = await res.json();
            if (json.eventIds) {
              setSyncedCalendarEventIds(json.eventIds);
            }
          } else {
            syncError = true;
          }
        } catch (err) {
          console.error("Erro ao sincronizar reagendamento no Google Agenda:", err);
          syncError = true;
        }
      }
    })();

    await Promise.all([task, minWaitPromise]);
    setIsLoadingModal(false);
    handleClose();

    if (syncError) {
      toast.warning("Cronograma reajustado, mas houve uma oscilação ao atualizar o Google Agenda.", {
        position: "top-right",
        autoClose: 4000,
      });
    } else {
      toast.success(
        startOption === "today"
          ? "Cronograma reajustado para iniciar hoje com sucesso!"
          : startOption === "tomorrow"
          ? "Cronograma reajustado para iniciar amanhã com sucesso!"
          : `Cronograma reajustado para iniciar em ${date}!`,
        {
          position: "top-right",
          autoClose: 4000,
        }
      );
    }
  };

  const handleInterrupt = async () => {
    setIsLoadingModal(true);
    setLoadingModalText("Finalizando propósito e atualizando Google Agenda...");

    const minWaitPromise = new Promise((resolve) => setTimeout(resolve, 2000));

    const task = (async () => {
      // Limpar eventos futuros do Google Agenda se houver
      if (status === "authenticated" && config.syncedCalendarEventIds && config.syncedCalendarEventIds.length > 0) {
        try {
          await fetch("/api/calendar/clear", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ eventIds: config.syncedCalendarEventIds }),
          });
        } catch (err) {
          console.error("Erro ao limpar eventos do Google Agenda:", err);
        }
      }

      interruptFast("Interrupção voluntária por saúde / imprevisto", reflection);
    })();

    await Promise.all([task, minWaitPromise]);
    setIsLoadingModal(false);
    handleClose();

    toast.success("Propósito finalizado e arquivado com sucesso.", {
      position: "top-right",
      autoClose: 4000,
    });

    router.push("/");
  };

  const handleDelete = async () => {
    setIsLoadingModal(true);
    setLoadingModalText("Cancelando propósito e limpando Google Agenda...");

    const minWaitPromise = new Promise((resolve) => setTimeout(resolve, 2000));

    const task = (async () => {
      // Remover todos os eventos do Google Agenda
      if (status === "authenticated" && config.syncedCalendarEventIds && config.syncedCalendarEventIds.length > 0) {
        try {
          await fetch("/api/calendar/clear", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ eventIds: config.syncedCalendarEventIds }),
          });
        } catch (err) {
          console.error("Erro ao remover eventos do Google Agenda:", err);
        }
      }

      clearFastingData();
    })();

    await Promise.all([task, minWaitPromise]);
    setIsLoadingModal(false);
    handleClose();

    toast.success("Jejum excluído, dados reiniciados e agenda limpa com sucesso!", {
      position: "top-right",
      autoClose: 4000,
    });

    router.push("/proposito");
  };

  const handleEditConfig = () => {
    handleClose();
    router.push("/proposito");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        view === "menu" ? (
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-primary dark:text-primary-fixed-dim" />
            <span>Gerenciar Propósito Atual</span>
          </div>
        ) : (
          <button
            onClick={() => {
              setView("menu");
              setShowDatePicker(false);
            }}
            className="flex items-center gap-2 text-xs md:text-sm text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-primary-fixed-dim transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao menu
          </button>
        )
      }
      description={
        view === "menu"
          ? "O jejum espiritual é uma prática de graça e intenção sincera. Escolha como deseja proceder:"
          : undefined
      }
    >
      {feedbackMsg ? (
        <div className="py-8 flex flex-col items-center justify-center text-center gap-3 animate-in fade-in">
          <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-on-surface dark:text-white max-w-sm">
            {feedbackMsg}
          </p>
        </div>
      ) : view === "menu" ? (
        /* ================= MENU PRINCIPAL ================= */
        <div className="flex flex-col gap-3 py-1">
          {/* Opção 1: Esqueci / Reagendar */}
          <button
            onClick={() => setView("reschedule")}
            className="p-4 rounded-2xl border border-outline-variant/30 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/50 bg-surface-container-low/60 dark:bg-slate-800/60 hover:bg-surface-container-low dark:hover:bg-slate-800 transition-all flex items-start gap-3.5 text-left group"
          >
            <div className="p-2.5 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim group-hover:scale-105 transition-transform flex-shrink-0 mt-0.5">
              <CalendarSync className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-on-surface dark:text-white group-hover:text-primary dark:group-hover:text-primary-fixed-dim transition-colors">
                Esqueci de começar / Reajustar início
              </h4>
              <p className="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5 leading-relaxed">
                Empurra o início da escala para hoje, amanhã ou outra data no calendário, mantendo suas preferências salvas.
              </p>
            </div>
          </button>

          {/* Opção 2: Interromper por Saúde / Imprevisto */}
          <button
            onClick={() => setView("interrupt")}
            className="p-4 rounded-2xl border border-outline-variant/30 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/50 bg-surface-container-low/60 dark:bg-slate-800/60 hover:bg-surface-container-low dark:hover:bg-slate-800 transition-all flex items-start gap-3.5 text-left group"
          >
            <div className="p-2.5 rounded-xl bg-secondary-container dark:bg-slate-700 text-secondary dark:text-gray-200 group-hover:scale-105 transition-transform flex-shrink-0 mt-0.5">
              <HeartCrack className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-on-surface dark:text-white group-hover:text-primary dark:group-hover:text-primary-fixed-dim transition-colors">
                Precisei interromper (Saúde / Imprevisto)
              </h4>
              <p className="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5 leading-relaxed">
                Encerra o propósito em paz, permitindo anotar uma reflexão sem sentimento de culpa.
              </p>
            </div>
          </button>

          {/* Opção 3: Editar Configuração */}
          <button
            onClick={handleEditConfig}
            className="p-4 rounded-2xl border border-outline-variant/30 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/50 bg-surface-container-low/60 dark:bg-slate-800/60 hover:bg-surface-container-low dark:hover:bg-slate-800 transition-all flex items-start gap-3.5 text-left group"
          >
            <div className="p-2.5 rounded-xl bg-surface-container-high dark:bg-slate-700 text-primary dark:text-primary-fixed-dim group-hover:scale-105 transition-transform flex-shrink-0 mt-0.5">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-on-surface dark:text-white group-hover:text-primary dark:group-hover:text-primary-fixed-dim transition-colors">
                Editar preferências da escala
              </h4>
              <p className="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5 leading-relaxed">
                Alterar meta de horas, dias bloqueados ou motivo de oração no formulário.
              </p>
            </div>
          </button>

          {/* Opção 4: Deletar e Recomeçar */}
          <button
            onClick={() => setView("delete")}
            className="p-4 rounded-2xl border border-error/20 dark:border-red-900/30 hover:border-error/50 bg-error-container/20 dark:bg-red-950/20 transition-all flex items-start gap-3.5 text-left group"
          >
            <div className="p-2.5 rounded-xl bg-error/10 dark:bg-red-900/40 text-error dark:text-red-400 group-hover:scale-105 transition-transform flex-shrink-0 mt-0.5">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-error dark:text-red-400 transition-colors">
                Excluir e recomeçar do zero
              </h4>
              <p className="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5 leading-relaxed">
                Apaga a escala atual e limpa os dados do navegador para iniciar um propósito novo.
              </p>
            </div>
          </button>
        </div>
      ) : view === "reschedule" ? (
        /* ================= SUBTELA: REAGENDAR ================= */
        <div className="flex flex-col gap-4 py-2">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim text-xs leading-relaxed">
            <Calendar className="w-5 h-5 flex-shrink-0" />
            <span>
              Esqueceu de iniciar ou precisa adiar? Escolha quando deseja que a escala comece. Todos os seus parâmetros serão preservados.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => handleReschedule("today")}
              className="p-4 rounded-2xl border border-outline-variant/30 dark:border-white/10 hover:border-primary bg-surface-container-low dark:bg-slate-800 text-center hover:shadow-sm transition-all flex flex-col items-center gap-1 group"
            >
              <span className="font-semibold text-xs md:text-sm text-on-surface dark:text-white group-hover:text-primary dark:group-hover:text-primary-fixed-dim">
                Começar Hoje
              </span>
              <span className="text-[11px] text-secondary dark:text-gray-400">
                Hoje ({config.startTime})
              </span>
            </button>

            <button
              onClick={() => handleReschedule("tomorrow")}
              className="p-4 rounded-2xl border border-outline-variant/30 dark:border-white/10 hover:border-primary bg-surface-container-low dark:bg-slate-800 text-center hover:shadow-sm transition-all flex flex-col items-center gap-1 group"
            >
              <span className="font-semibold text-xs md:text-sm text-on-surface dark:text-white group-hover:text-primary dark:group-hover:text-primary-fixed-dim">
                Começar Amanhã
              </span>
              <span className="text-[11px] text-secondary dark:text-gray-400">
                Amanhã ({config.startTime})
              </span>
            </button>

            <button
              onClick={() => setShowDatePicker(true)}
              className={clsx(
                "p-4 rounded-2xl border text-center hover:shadow-sm transition-all flex flex-col items-center gap-1 group",
                showDatePicker
                  ? "border-primary bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim font-semibold"
                  : "border-outline-variant/30 dark:border-white/10 hover:border-primary bg-surface-container-low dark:bg-slate-800 text-on-surface dark:text-white"
              )}
            >
              <span className="font-semibold text-xs md:text-sm group-hover:text-primary dark:group-hover:text-primary-fixed-dim">
                No Calendário
              </span>
              <span className="text-[11px] text-secondary dark:text-gray-400">
                Escolher Data
              </span>
            </button>
          </div>

          {showDatePicker && (
            <div className="p-4 rounded-2xl border border-primary/30 bg-primary/5 dark:bg-primary/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs text-primary dark:text-primary-fixed-dim font-medium">
                <CalendarDays className="w-4 h-4 flex-shrink-0" />
                <span>Escolha a data no calendário:</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  min={format(new Date(), "yyyy-MM-dd")}
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="p-2 rounded-lg border border-outline-variant/40 dark:border-white/10 bg-surface-bright dark:bg-slate-800 text-on-surface dark:text-white text-xs font-semibold focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-sm"
                />
                <Button
                  size="sm"
                  variant="primary"
                  className="text-xs px-3"
                  onClick={() => handleReschedule("custom", customDate)}
                >
                  Aplicar
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : view === "interrupt" ? (
        /* ================= SUBTELA: INTERROMPER COM CARINHO ================= */
        <div className="flex flex-col gap-4 py-2">
          <div className="p-4 rounded-2xl bg-secondary-container/40 dark:bg-slate-800 border border-outline-variant/30 dark:border-white/10 flex items-start gap-3 text-xs leading-relaxed text-on-surface dark:text-gray-300">
            <ShieldCheck className="w-5 h-5 text-primary dark:text-primary-fixed-dim flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block text-on-surface dark:text-white mb-0.5">
                Cuidar do templo de Deus é sabedoria.
              </strong>
              O jejum nunca deve ser motivo de culpa ou dano à sua saúde. Se precisou interromper por qualquer motivo, Deus conhece o seu coração.
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-secondary dark:text-gray-400 uppercase tracking-wider block mb-1.5">
              Reflexão ou Aprendizado deste período (Opcional):
            </label>
            <textarea
              rows={3}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Ex: Aprendi a ter mais paciência... Pretendo retornar na próxima semana..."
              className="w-full p-3 rounded-xl border border-outline-variant/40 dark:border-white/10 bg-surface-bright dark:bg-slate-800 text-on-surface dark:text-white text-xs md:text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setView("menu")}>
              Voltar
            </Button>
            <Button variant="primary" size="sm" onClick={handleInterrupt}>
              Concluir com Paz
            </Button>
          </div>
        </div>
      ) : (
        /* ================= SUBTELA: DELETAR TUDO ================= */
        <div className="flex flex-col gap-4 py-2">
          <div className="p-4 rounded-2xl bg-error-container/30 dark:bg-red-950/40 border border-error/30 text-xs text-on-surface dark:text-gray-200 leading-relaxed">
            <strong className="text-error dark:text-red-400 block mb-1">Atenção:</strong>
            Tem certeza que deseja apagar a escala e os dados salvos deste propósito? Esta ação não pode ser desfeita e você voltará à tela inicial limpa para criar um novo jejum.
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setView("menu")}>
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleDelete}
              className="bg-error hover:bg-error/90 text-white dark:bg-red-600 dark:hover:bg-red-700"
            >
              Sim, Excluir e Recomeçar
            </Button>
          </div>
        </div>
      )}

      {/* Modal de Loading de Tela Cheia com Spinner */}
      {isLoadingModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-surface dark:bg-slate-900 border border-outline-variant/30 dark:border-white/10 p-8 flex flex-col items-center justify-center text-center shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="relative flex items-center justify-center">
              {/* Spinning ring */}
              <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary dark:border-t-primary-fixed-dim animate-spin" />
              {/* Flame icon pulsing inside */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Flame className="w-8 h-8 text-primary dark:text-primary-fixed-dim animate-pulse" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-on-surface dark:text-white">
                {loadingModalText}
              </h3>
              <p className="text-xs text-on-surface-variant dark:text-gray-400 max-w-xs leading-relaxed">
                Aguarde um instante enquanto sincronizamos as alterações no seu dispositivo e na agenda.
              </p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
