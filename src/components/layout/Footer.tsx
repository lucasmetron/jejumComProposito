import React from "react";
import Link from "next/link";
import { Flame, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-outline-variant/30 bg-surface-container-low mt-auto">
      <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Flame className="w-4 h-4 fill-current" />
          </div>
          <span className="font-semibold text-primary text-sm">
            Jejum com Propósito
          </span>
          <span className="text-secondary text-xs hidden sm:inline">
            — Planejador Espiritual & Devocional
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs text-secondary">
          <Link href="/" className="hover:text-primary transition-colors">
            Início
          </Link>
          <Link href="/#configurador" className="hover:text-primary transition-colors">
            Configurar Propósito
          </Link>
          <Link href="/sobre" className="hover:text-primary transition-colors">
            Sobre o Propósito
          </Link>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
          <span>Criado para o fortalecimento da fé e oração</span>
          <Heart className="w-3.5 h-3.5 text-primary fill-current inline" />
        </div>
      </div>
    </footer>
  );
}
