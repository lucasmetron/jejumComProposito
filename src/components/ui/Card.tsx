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
    lowest: "bg-surface-container-lowest",
    low: "bg-surface-container-low",
    default: "bg-surface",
    high: "bg-surface-container-high",
  };

  return (
    <div
      className={twMerge(
        clsx(
          "rounded-2xl transition-all duration-200",
          variantStyles[variant],
          bordered && "border border-outline-variant/30 shadow-[0_4px_20px_rgba(65,100,106,0.03)]",
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}
