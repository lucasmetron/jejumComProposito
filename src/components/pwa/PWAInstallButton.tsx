"use client";

import React, { useState } from "react";
import { usePWAInstall } from "./usePWAInstall";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  Download,
  Smartphone,
  Share,
  PlusSquare,
  CheckCircle2,
  Sparkles,
  Monitor,
  Flame,
} from "lucide-react";
import { clsx } from "clsx";

interface PWAInstallButtonProps {
  variant?: "header" | "mobile-nav" | "banner" | "card";
  className?: string;
}

export function PWAInstallButton({
  variant = "header",
  className,
}: PWAInstallButtonProps) {
  const {
    isInstallable,
    isInstalled,
    isIOS,
    showIOSModal,
    setShowIOSModal,
    promptInstall,
  } = usePWAInstall();

  const [showDesktopInfoModal, setShowDesktopInfoModal] = useState(false);

  const handleClick = async () => {
    const result = await promptInstall();
    if (result.outcome === "manual_instructions") {
      setShowDesktopInfoModal(true);
    }
  };

  if (isInstalled) {
    return null;
  }

  // 1. Header Variant (Mobile & Desktop)
  if (variant === "header") {
    return (
      <>
        <button
          onClick={handleClick}
          title="Baixar e Instalar Aplicativo"
          className={clsx(
            "inline-flex items-center justify-center rounded-full text-xs font-semibold border transition-all duration-200 shadow-sm hover:shadow active:scale-95",
            "p-2 sm:px-3.5 sm:py-1.5 sm:gap-2",
            "border-primary/40 dark:border-primary/40 bg-primary/5 dark:bg-primary/10 text-primary dark:text-primary-fixed-dim hover:bg-primary/15 dark:hover:bg-primary/20",
            className
          )}
        >
          <Download className="w-4 h-4 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">Baixar App</span>
        </button>

        {/* Modal de Instruções iOS */}
        <IOSInstallModal
          isOpen={showIOSModal}
          onClose={() => setShowIOSModal(false)}
        />

        {/* Modal de Instruções Desktop/Manual */}
        <DesktopInstallModal
          isOpen={showDesktopInfoModal}
          onClose={() => setShowDesktopInfoModal(false)}
        />
      </>
    );
  }

  // 2. Mobile Nav Variant (Button / Link item)
  if (variant === "mobile-nav") {
    return (
      <>
        <button
          onClick={handleClick}
          className={clsx(
            "flex flex-col items-center justify-center transition-all duration-200 min-w-[64px] py-1 text-primary dark:text-primary-fixed-dim",
            className
          )}
        >
          <div className="relative">
            <span className="material-symbols-outlined text-[22px] leading-none mb-0.5">
              download_for_offline
            </span>
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent-orange animate-pulse" />
          </div>
          <span className="text-[10px] font-semibold tracking-tight">
            Baixar
          </span>
        </button>

        <IOSInstallModal
          isOpen={showIOSModal}
          onClose={() => setShowIOSModal(false)}
        />

        <DesktopInstallModal
          isOpen={showDesktopInfoModal}
          onClose={() => setShowDesktopInfoModal(false)}
        />
      </>
    );
  }

  // 3. Banner / Card Variant
  return (
    <>
      <div
        className={clsx(
          "p-4 rounded-2xl border border-primary/30 bg-primary/5 dark:bg-primary/15 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm",
          className
        )}
      >
        <div className="flex items-center gap-3.5 text-left">
          <div className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/icon-96x96.png"
              alt="Logo Jejum com Propósito"
              className="w-7 h-7 object-contain rounded-lg"
            />
          </div>
          <div>
            <h4 className="font-bold text-sm text-on-surface dark:text-white flex items-center gap-1.5">
              <span>Instale o Jejum com Propósito</span>
              <span className="text-[10px] bg-primary/10 text-primary dark:text-primary-fixed-dim px-2 py-0.5 rounded-full font-bold uppercase">
                PWA
              </span>
            </h4>
            <p className="text-xs text-on-surface-variant dark:text-gray-300 mt-0.5">
              Acesse offline, receba notificações e tenha uma experiência nativa no seu celular ou computador.
            </p>
          </div>
        </div>

        <Button
          onClick={handleClick}
          variant="primary"
          size="sm"
          className="w-full sm:w-auto flex-shrink-0 text-xs font-semibold gap-2 shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Baixar Aplicativo</span>
        </Button>
      </div>

      <IOSInstallModal
        isOpen={showIOSModal}
        onClose={() => setShowIOSModal(false)}
      />

      <DesktopInstallModal
        isOpen={showDesktopInfoModal}
        onClose={() => setShowDesktopInfoModal(false)}
      />
    </>
  );
}

function IOSInstallModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-primary dark:text-primary-fixed-dim" />
          <span>Instalar no iPhone / iPad</span>
        </div>
      }
    >
      <div className="space-y-4 py-2">
        <p className="text-xs md:text-sm text-on-surface-variant dark:text-gray-300 leading-relaxed">
          Para instalar o <strong>Jejum com Propósito</strong> no seu dispositivo iOS através do Safari, siga estes 2 passos simples:
        </p>

        <div className="space-y-3">
          <div className="p-3.5 rounded-xl border border-outline-variant/30 dark:border-white/10 bg-surface-container-low/60 dark:bg-slate-800/60 flex items-start gap-3 text-xs md:text-sm">
            <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim flex-shrink-0 mt-0.5">
              <Share className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-on-surface dark:text-white font-semibold">
                1. Toque no botão Compartilhar
              </strong>
              <span className="text-on-surface-variant dark:text-gray-400 text-xs">
                Localizado na barra inferior do Safari (ícone de quadrado com uma seta para cima).
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-outline-variant/30 dark:border-white/10 bg-surface-container-low/60 dark:bg-slate-800/60 flex items-start gap-3 text-xs md:text-sm">
            <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim flex-shrink-0 mt-0.5">
              <PlusSquare className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-on-surface dark:text-white font-semibold">
                2. Selecione &quot;Adicionar à Tela de Início&quot;
              </strong>
              <span className="text-on-surface-variant dark:text-gray-400 text-xs">
                Role o menu para baixo e toque em Adicionar à Tela de Início (Add to Home Screen).
              </span>
            </div>
          </div>
        </div>

        <Button onClick={onClose} variant="primary" className="w-full mt-2 text-xs">
          Entendi, vou instalar
        </Button>
      </div>
    </Modal>
  );
}

function DesktopInstallModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Monitor className="w-5 h-5 text-primary dark:text-primary-fixed-dim" />
          <span>Instalar no Computador / Navegador</span>
        </div>
      }
    >
      <div className="space-y-4 py-2 text-xs md:text-sm text-on-surface-variant dark:text-gray-300 leading-relaxed">
        <p>
          Para instalar o <strong>Jejum com Propósito</strong> no Chrome, Edge ou Brave no Desktop:
        </p>

        <div className="p-3.5 rounded-xl border border-outline-variant/30 dark:border-white/10 bg-surface-container-low/60 dark:bg-slate-800/60 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim flex-shrink-0 mt-0.5">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <strong className="block text-on-surface dark:text-white font-semibold mb-1">
              Ícone de Instalação na Barra de Endereços
            </strong>
            <span>
              Clique no ícone de instalação (computador com uma seta para baixo) localizado no lado direito da barra de endereços do seu navegador.
            </span>
          </div>
        </div>

        <Button onClick={onClose} variant="primary" className="w-full mt-2 text-xs">
          Fechar
        </Button>
      </div>
    </Modal>
  );
}
