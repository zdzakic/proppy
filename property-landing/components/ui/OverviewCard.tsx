/**
 * OverviewCard
 *
 * Purpose:
 * Reusable UI card for Overview roles (Owners, Directors, Management).
 *
 * Why:
 * - Keeps visual symmetry
 * - Ensures identical structure for all cards
 * - Makes future styling changes centralized
 *
 * Usage:
 * Pass icon, title, body content and emphasis statement.
 */

import { ReactNode } from "react";

interface OverviewCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  emphasis: string;
}

export default function OverviewCard({
  icon,
  title,
  children,
  emphasis,
}: OverviewCardProps) {
  return (
    <div className="relative p-8 rounded-2xl bg-brand-surface border border-brand-border hover:border-brand-accent/50 hover:shadow-xl transition-all duration-300 flex flex-col h-full">

      {/* Subtle glow layer */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-accent/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-brand-accent/10 flex items-center justify-center mb-6">
          {icon}
        </div>

        <h3 className="font-display text-2xl mb-6">
          {title}
        </h3>
      </div>

      {/* Body */}
      <div className="relative space-y-2 text-brand-muted leading-relaxed">
        {children}
      </div>

      {/* Emphasis (always aligned bottom for symmetry) */}
      <div className="mt-auto pt-8">
        <div className="border-l-2 border-brand-accent/40 pl-4">
          <p className="font-medium text-brand-text">
            {emphasis}
          </p>
        </div>
      </div>
    </div>
  );
}