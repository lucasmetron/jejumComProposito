"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface AccordionItemProps {
  title: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function AccordionItem({
  title,
  subtitle,
  icon,
  children,
  defaultOpen = false,
  className,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={twMerge(
        clsx(
          "rounded-2xl border border-outline-variant/30 dark:border-white/10 bg-surface-container-lowest dark:bg-slate-900 overflow-hidden transition-all duration-200",
          className
        )
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-container-low dark:hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className="text-primary dark:text-primary-fixed-dim flex-shrink-0">{icon}</div>
          )}
          <div>
            <div className="font-bold text-on-surface dark:text-white text-base md:text-lg">
              {title}
            </div>
            {subtitle && (
              <div className="text-xs sm:text-sm text-on-surface-variant dark:text-gray-400 mt-0.5">
                {subtitle}
              </div>
            )}
          </div>
        </div>
        <ChevronDown
          className={clsx(
            "w-5 h-5 text-secondary dark:text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180 text-primary dark:text-primary-fixed-dim"
          )}
        />
      </button>
      {isOpen && (
        <div className="p-5 sm:p-6 pt-2 border-t border-outline-variant/20 dark:border-white/5 text-on-surface-variant dark:text-gray-300 text-sm sm:text-base animate-in fade-in-50 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
