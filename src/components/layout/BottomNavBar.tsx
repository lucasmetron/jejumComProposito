"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

export function BottomNavBar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Início",
      href: "/",
      icon: "home",
    },
    {
      name: "Propósito",
      href: "/proposito",
      icon: "settings_heart",
    },
    {
      name: "Sobre",
      href: "/sobre",
      icon: "info",
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 z-50 bg-surface/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-outline-variant/30 dark:border-white/10 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-4 flex justify-around items-center">
      {navItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.name}
            href={item.href}
            className={clsx(
              "flex flex-col items-center justify-center transition-all duration-200 min-w-[72px] py-1",
              isActive
                ? "bg-primary/15 dark:bg-primary/25 text-primary dark:text-primary-fixed-dim rounded-2xl px-4 py-1.5 font-medium"
                : "text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-primary-fixed-dim"
            )}
          >
            <span
              className={clsx(
                "material-symbols-outlined text-[22px] leading-none mb-0.5",
                isActive && "icon-fill"
              )}
            >
              {item.icon}
            </span>
            <span className="text-[11px] font-medium tracking-tight">
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
