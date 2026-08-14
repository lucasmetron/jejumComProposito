import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "water" | "absolute" | "outline";
}

export function Badge({ children, className, variant = "primary", ...props }: BadgeProps) {
  const variantStyles = {
    primary: "bg-primary/10 text-primary border border-primary/20",
    secondary: "bg-secondary-container text-on-secondary-container",
    water: "bg-primary-fixed text-on-primary-fixed border border-primary/20",
    absolute: "bg-error-container text-on-error-container border border-error/20",
    outline: "border border-outline-variant text-secondary",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide transition-colors",
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
}
