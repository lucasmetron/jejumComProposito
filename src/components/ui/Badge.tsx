import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "water" | "absolute" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: BadgeProps) {
  const variantStyles = {
    primary:
      "bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim border border-primary/20 dark:border-primary/30",
    secondary:
      "bg-secondary-container dark:bg-slate-800 text-on-secondary-container dark:text-gray-200 border border-outline-variant/30 dark:border-white/10",
    water:
      "bg-primary-fixed dark:bg-teal-900/40 text-on-primary-fixed dark:text-teal-200 border border-primary/20",
    absolute:
      "bg-error-container dark:bg-red-900/30 text-on-error-container dark:text-red-300 border border-error/20",
    outline: "border border-outline-variant dark:border-white/10 text-secondary dark:text-gray-400",
  };

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs font-semibold",
    md: "px-3.5 py-1 text-xs sm:text-sm font-semibold",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1.5 rounded-full font-medium tracking-wide transition-colors",
          variantStyles[variant],
          sizeStyles[size],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
}
