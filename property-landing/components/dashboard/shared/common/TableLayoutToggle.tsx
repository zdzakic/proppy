"use client";

import { LayoutGrid, MonitorSmartphone, Table2 } from "lucide-react";

import type { TableViewMode } from "@/utils/table/viewMode";

type TableLayoutToggleProps = {
  value: TableViewMode;
  onChange: (mode: TableViewMode) => void;
  className?: string;
  ariaLabelPrefix?: string;
};

export default function TableLayoutToggle({
  value,
  onChange,
  className = "",
  ariaLabelPrefix = "",
}: TableLayoutToggleProps) {
  const withPrefix = (label: string) =>
    ariaLabelPrefix.trim() ? `${ariaLabelPrefix} ${label}` : label;

  return (
    <div
      className={[
        "inline-flex items-center gap-1 rounded-lg border border-dashboard-border bg-dashboard-bg/60 p-1",
        className,
      ].join(" ")}
    >
      <button
        type="button"
        aria-label={withPrefix("Auto layout")}
        onClick={() => onChange("auto")}
        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs transition-colors ${
          value === "auto"
            ? "bg-dashboard-hover text-dashboard-text"
            : "text-dashboard-muted hover:bg-dashboard-hover"
        }`}
      >
        <MonitorSmartphone size={14} />
        Auto
      </button>

      <button
        type="button"
        aria-label={withPrefix("Table layout")}
        onClick={() => onChange("table")}
        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs transition-colors ${
          value === "table"
            ? "bg-dashboard-hover text-dashboard-text"
            : "text-dashboard-muted hover:bg-dashboard-hover"
        }`}
      >
        <Table2 size={14} />
        Table
      </button>

      <button
        type="button"
        aria-label={withPrefix("Cards layout")}
        onClick={() => onChange("cards")}
        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs transition-colors ${
          value === "cards"
            ? "bg-dashboard-hover text-dashboard-text"
            : "text-dashboard-muted hover:bg-dashboard-hover"
        }`}
      >
        <LayoutGrid size={14} />
        Cards
      </button>
    </div>
  );
}
