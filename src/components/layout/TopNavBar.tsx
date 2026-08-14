"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Flame, LogOut, User as UserIcon } from "lucide-react";
import { clsx } from "clsx";

export function TopNavBar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const navLinks = [
    { name: "Início", href: "/" },
    { name: "Propósito", href: "/#configurador" },
    { name: "Sobre", href: "/sobre" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-[30px] border-b border-outline-variant/30 transition-all">
      <div className="flex justify-between items-center h-[72px] px-container-padding-mobile md:px-container-padding-desktop max-w-7xl mx-auto">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <span className="font-semibold text-lg text-primary tracking-wide">
            Jejum com Propósito
          </span>
        </Link>

        {/* Navigation Links (Desktop) */}
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
                    ? "text-primary border-primary"
                    : "text-secondary border-transparent hover:text-primary"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Actions / Auth */}
        <div className="flex items-center gap-3">
          {status === "authenticated" && session?.user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant/30">
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt={session.user.name || "Usuário"}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-4 h-4 text-primary" />
                )}
                <span className="text-xs font-medium text-on-surface max-w-[100px] truncate hidden sm:inline">
                  {session.user.name?.split(" ")[0] || "Usuário"}
                </span>
              </div>
              <button
                onClick={() => signOut()}
                title="Sair da conta Google"
                className="p-2 rounded-full text-secondary hover:text-error hover:bg-error-container/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => signIn("google")}
              className="text-xs px-4"
            >
              Conectar Google
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
