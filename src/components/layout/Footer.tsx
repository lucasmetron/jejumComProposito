import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-outline-variant/30 dark:border-white/10 bg-surface-container-low dark:bg-slate-950 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop py-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim text-xl icon-fill">
            local_fire_department
          </span>
          <span className="font-semibold text-primary dark:text-primary-fixed-dim text-sm">
            Jejum com Propósito
          </span>
          <span className="text-secondary dark:text-gray-400 text-xs hidden sm:inline">
            — Planejador Espiritual & Devocional
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs text-secondary dark:text-gray-400">
          <Link href="/" className="hover:text-primary dark:hover:text-primary-fixed-dim transition-colors">
            Início
          </Link>
          <Link href="/proposito" className="hover:text-primary dark:hover:text-primary-fixed-dim transition-colors">
            Propósito
          </Link>
          <Link href="/sobre" className="hover:text-primary dark:hover:text-primary-fixed-dim transition-colors">
            Sobre
          </Link>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant dark:text-gray-400">
          <span>Criado para o fortalecimento da fé e oração</span>
          <Heart className="w-3.5 h-3.5 text-primary dark:text-primary-fixed-dim fill-current inline" />
        </div>
      </div>
    </footer>
  );
}
