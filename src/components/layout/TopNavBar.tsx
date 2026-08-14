"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { clsx } from "clsx";

export function TopNavBar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const navLinks = [
    { name: "Início", href: "/" },
    { name: "Propósito", href: "/proposito" },
    { name: "Sobre", href: "/sobre" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface/85 dark:bg-slate-900/85 backdrop-blur-[30px] border-b border-outline-variant/30 dark:border-white/10 transition-colors">
      <div className="flex justify-between items-center h-[72px] px-container-padding-mobile md:px-container-padding-desktop max-w-7xl mx-auto">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim text-2xl icon-fill group-hover:scale-105 transition-transform">
            local_fire_department
          </span>
          <span className="font-semibold text-lg text-primary dark:text-primary-fixed-dim tracking-tight">
            Jejum com Propósito
          </span>
        </Link>

        {/* Navigation Links (Desktop - matching Print 2) */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  "h-full flex items-center text-sm font-medium transition-all duration-200 border-b-2 pt-0.5",
                  isActive
                    ? "text-primary dark:text-primary-fixed-dim border-primary dark:border-primary-fixed-dim font-semibold"
                    : "text-secondary dark:text-gray-400 border-transparent hover:text-primary dark:hover:text-primary-fixed-dim"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Actions / Auth + Theme Toggle */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle (Light / Dark mode) */}
          <ThemeToggle />

          {status === "authenticated" && session?.user ? (
            <div className="flex items-center gap-2 bg-surface-container-low dark:bg-surface-container/20 pl-2 pr-1.5 py-1 rounded-full border border-outline-variant/30 dark:border-white/10">
              {session.user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.user.image}
                  alt={session.user.name || "Usuário"}
                  className="w-7 h-7 rounded-full object-cover border border-primary/20"
                />
              ) : (
                <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim text-xl">
                  account_circle
                </span>
              )}
              <span className="text-xs font-medium text-on-surface dark:text-gray-200 max-w-[100px] truncate hidden sm:inline px-1">
                {session.user.name?.split(" ")[0] || "Usuário"}
              </span>
              <button
                onClick={() => signOut()}
                title="Sair da conta Google"
                className="p-1.5 rounded-full text-secondary dark:text-gray-400 hover:text-error hover:bg-error-container/30 transition-colors ml-1"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => signIn("google")}
                className="px-5 py-2 rounded-full bg-primary text-on-primary text-xs md:text-sm font-medium hover:bg-primary/90 transition-all shadow-sm hover:shadow active:scale-95"
              >
                Entrar
              </button>
              <button
                onClick={() => signIn("google")}
                title="Entrar com Google"
                className="hidden sm:flex items-center justify-center p-2 rounded-full text-primary dark:text-primary-fixed-dim hover:bg-surface-container dark:hover:bg-white/5 transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">account_circle</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
