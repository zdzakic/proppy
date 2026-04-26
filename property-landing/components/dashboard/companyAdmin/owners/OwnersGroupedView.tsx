"use client";

import { useMemo } from "react";
import OwnersTable from "./OwnersTable";
import type { PropertyWithMeta } from "@/types/property";
import type { TableViewMode } from "@/utils/table/viewMode";

type Props = {
  properties: PropertyWithMeta[];
  onView: (property: PropertyWithMeta) => void;
  onEdit: (property: PropertyWithMeta) => void;
  onDelete: (property: PropertyWithMeta) => void;
  onAssignOwner: (property: PropertyWithMeta) => void;
  viewMode?: TableViewMode;
};

/**
 * OwnersGroupedView
 *
 * What it does: Groups properties by company and renders one collapsible OwnersTable per group.
 * Why it exists: Mirrors BlocksGroupedView — provides the same multi-company UX pattern for owners.
 * What would break if removed: OwnersManager would lose the grouped, collapsible view entirely.
 */
export default function OwnersGroupedView({
  properties,
  onView,
  onEdit,
  onDelete,
  onAssignOwner,
  viewMode = "auto",
}: Props) {
  // Group by company_name — PropertyWithMeta has no company_id, so name is the stable key here.
  const grouped = useMemo(() => {
    return properties.reduce(
      (acc, property) => {
        const key = property.company_name ?? "Unknown";
        if (!acc[key]) acc[key] = [];
        acc[key].push(property);
        return acc;
      },
      {} as Record<string, PropertyWithMeta[]>,
    );
  }, [properties]);

  if (properties.length === 0) {
    return (
      <div className="rounded-lg border border-dashboard-border bg-dashboard-surface p-4 text-center">
        <p className="text-xs text-dashboard-muted">No properties found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {Object.entries(grouped).map(([companyName, companyProperties]) => (
        <OwnersTable
          key={companyName}
          properties={companyProperties}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onAssignOwner={onAssignOwner}
          viewMode={viewMode}
          headerTitle={companyName}
        />
      ))}
    </div>
  );
}
