"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  title: string;
  children: React.ReactNode;
  /** Start collapsed (default: true — matches BlocksTable behaviour). */
  defaultCollapsed?: boolean;
};

/**
 * CollapsibleTable
 *
 * What it does: Renders a labelled, collapsible section header that wraps any table content.
 * Why it exists: Eliminates duplicated toggle-button markup across BlocksTable, OwnersTable, etc.
 * What would break if removed: Grouped views (OwnersGroupedView, BlocksGroupedView) would lose
 *   their collapsible section headers and the toggle state that drives them.
 */
export default function CollapsibleTable({
  title,
  children,
  defaultCollapsed = true,
}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setIsCollapsed((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-lg border border-dashboard-border bg-dashboard-surface px-3 py-2 text-left transition-colors hover:bg-dashboard-hover"
        aria-expanded={!isCollapsed}
      >
        <span className="text-sm font-semibold text-dashboard-text">{title}</span>
        <span className="inline-flex items-center justify-center rounded-md border border-dashboard-border bg-dashboard-surface p-1.5 text-dashboard-text">
          {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </span>
      </button>

      {!isCollapsed ? children : null}
    </div>
  );
}
