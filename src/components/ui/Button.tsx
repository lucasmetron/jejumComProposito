import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "tonal";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  icon,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100";

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5 min-h-[36px]",
    md: "px-5 py-2.5 text-sm gap-2 min-h-[44px]",
    lg: "px-7 py-3 text-base gap-2.5 min-h-[50px]",
  };

  const variantStyles = {
    primary:
      "bg-primary text-on-primary hover:bg-primary/90 shadow-sm hover:shadow-[0_4px_12px_rgba(65,100,106,0.25)]",
    secondary:
      "bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700",
    outline:
      "border border-outline-variant/50 dark:border-white/20 text-primary dark:text-primary-fixed-dim hover:bg-primary/5 dark:hover:bg-white/5 hover:border-primary",
    ghost:
      "text-on-surface dark:text-gray-200 hover:bg-surface-container dark:hover:bg-slate-800 hover:text-primary dark:hover:text-primary-fixed-dim",
    tonal:
      "bg-surface-container-high dark:bg-slate-800 text-primary dark:text-primary-fixed-dim hover:bg-surface-container-highest dark:hover:bg-slate-700",
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
