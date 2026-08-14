"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { clsx } from "clsx";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={clsx("w-9 h-9 rounded-full bg-surface-container-low dark:bg-surface-container/20 border border-outline-variant/30", className)} />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={theme === "light" ? "Mudar para modo escuro" : "Mudar para modo claro"}
      title={theme === "light" ? "Mudar para modo escuro" : "Mudar para modo claro"}
      className={clsx(
        "relative p-2 rounded-full transition-all duration-200 border border-outline-variant/30",
        "bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-primary",
        "dark:bg-surface-container-high/30 dark:border-white/10 dark:text-gray-300 dark:hover:text-primary-fixed-dim",
        className
      )}
    >
      {theme === "light" ? (
        <Moon className="w-4 h-4 text-secondary hover:text-primary transition-transform duration-200 hover:rotate-12" />
      ) : (
        <Sun className="w-4 h-4 text-primary-fixed-dim hover:text-yellow-400 transition-transform duration-200 hover:rotate-45" />
      )}
    </button>
  );
}
