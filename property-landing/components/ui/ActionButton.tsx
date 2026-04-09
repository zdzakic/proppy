"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ActionButtonVariant = "primary" | "neutral" | "warning" | "danger";
type ActionButtonSize = "sm" | "md";

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ActionButtonVariant;
  size?: ActionButtonSize;
  fullWidth?: boolean;
};

const variantClasses: Record<ActionButtonVariant, string> = {
  primary:
    "border-brand-primary bg-brand-primary text-white hover:opacity-90 focus-visible:ring-brand-primary",
  neutral:
    "border-dashboard-border bg-dashboard-surface text-dashboard-text hover:bg-dashboard-hover focus-visible:ring-dashboard-ring",
  warning:
    "border-brand-accent bg-brand-accent/10 text-brand-accent hover:bg-brand-accent/20 focus-visible:ring-brand-accent",
  danger:
    "border-error bg-error/10 text-error hover:bg-error/20 focus-visible:ring-error",
};

const sizeClasses: Record<ActionButtonSize, string> = {
  sm: "px-2.5 py-1 text-[11px]",
  md: "px-4 py-2 text-sm",
};

export default function ActionButton({
  children,
  variant = "neutral",
  size = "md",
  fullWidth = false,
  className = "",
  type = "button",
  ...rest
}: ActionButtonProps) {
  return (
    <button
      type={type}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-md border font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2",
        fullWidth ? "w-full" : "w-auto",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
