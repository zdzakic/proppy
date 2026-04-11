import type { ReactNode } from "react";

type DashboardInfoRowProps = {
  label: string;
  value: ReactNode;
  className?: string;
};

export default function DashboardInfoRow({
  label,
  value,
  className = "",
}: DashboardInfoRowProps) {
  return (
    <div
      className={[
        "flex items-center justify-between gap-4 rounded-xl border border-dashboard-border bg-dashboard-bg/60 px-4 py-3",
        className,
      ].join(" ")}
    >
      <span className="text-sm text-dashboard-muted">{label}</span>
      <div className="text-right text-sm font-medium text-dashboard-text">
        {value}
      </div>
    </div>
  );
}