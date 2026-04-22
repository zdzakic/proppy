"use client";

import { useState } from "react";
import TableLayoutToggle from "@/components/dashboard/shared/common/TableLayoutToggle";
import type { TableViewMode } from "@/utils/table/viewMode";
import { useOwnersPage } from "@/hooks/useOwnersPage";
import type { PropertyWithMeta } from "@/types/property";
import OwnersTable from "./OwnersTable";

/**
 * OwnersManager
 *
 * What it does: Composes the Owners page — header, count row, view-mode toggle, flat table.
 * Why it exists: Mirrors CompaniesManager structure exactly so the Owners page is visually
 *   and structurally identical to the Companies page (no grouped/collapsible view).
 * What would break if removed: The Owners page would have no layout, data, or controls.
 */
export default function OwnersManager() {
  const { properties, loading, error } = useOwnersPage();
  const [viewMode, setViewMode] = useState<TableViewMode>("auto");

  // Placeholder handlers — future modals will replace these console.logs.
  const handleView = (property: PropertyWithMeta) => {
    console.log("View:", property.name);
  };

  const handleEdit = (property: PropertyWithMeta) => {
    console.log("Edit:", property.name);
  };

  const handleDelete = (property: PropertyWithMeta) => {
    console.log("Delete:", property.name);
  };

  const handleAssignOwner = (property: PropertyWithMeta) => {
    console.log("Assign owner to:", property.name);
  };

  if (loading) {
    return <p className="text-sm text-dashboard-muted">Loading properties...</p>;
  }

  return (
    // Same section container as CompaniesManager.
    <section className="space-y-2 rounded-2xl border border-dashboard-border bg-dashboard-surface p-4 sm:p-6">
      <div className="space-y-2">
        {/* Title row — mirrors CompaniesManager header (no Add button for now) */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-dashboard-text">Owners</h1>
            <p className="text-xs text-dashboard-muted">
              All properties and their ownership status.
            </p>
          </div>
        </div>

        {/* Count + toggle row — same layout as CompaniesManager, hidden on mobile */}
        <div className="hidden items-center justify-between md:flex">
          {error ? (
            <p className="text-xs text-error">{error}</p>
          ) : (
            <p className="text-xs text-dashboard-muted">
              Showing {properties.length} propert{properties.length === 1 ? "y" : "ies"}.
            </p>
          )}

          <TableLayoutToggle
            value={viewMode}
            onChange={setViewMode}
            ariaLabelPrefix="Owners"
          />
        </div>

        {error ? <p className="text-xs text-error md:hidden">{error}</p> : null}
      </div>

      <OwnersTable
        properties={properties}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAssignOwner={handleAssignOwner}
        viewMode={viewMode}
      />
    </section>
  );
}
