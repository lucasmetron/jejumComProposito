import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "lowest" | "low" | "default" | "high";
  bordered?: boolean;
}

export function Card({
  children,
  className,
  variant = "lowest",
  bordered = true,
  ...props
}: CardProps) {
  const variantStyles = {
    lowest: "bg-surface-container-lowest dark:bg-slate-900",
    low: "bg-surface-container-low dark:bg-slate-800/80",
    default: "bg-surface dark:bg-slate-900",
    high: "bg-surface-container-high dark:bg-slate-800",
  };

  return (
    <div
      className={twMerge(
        clsx(
          "rounded-2xl transition-all duration-200",
          variantStyles[variant],
          bordered && "border border-outline-variant/30 dark:border-white/10 shadow-[0_4px_20px_rgba(65,100,106,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)]",
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}
