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
          "rounded-xl border border-outline-variant/30 bg-surface-container-lowest overflow-hidden transition-all duration-200",
          className
        )
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-container-low transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-primary flex-shrink-0">{icon}</div>}
          <div>
            <div className="font-medium text-on-surface text-base">{title}</div>
            {subtitle && <div className="text-xs text-on-surface-variant mt-0.5">{subtitle}</div>}
          </div>
        </div>
        <ChevronDown
          className={clsx(
            "w-5 h-5 text-secondary transition-transform duration-200",
            isOpen && "rotate-180 text-primary"
          )}
        />
      </button>
      {isOpen && (
        <div className="p-5 pt-0 border-t border-outline-variant/10 text-on-surface-variant text-sm animate-in fade-in-50 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
