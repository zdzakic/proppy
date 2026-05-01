"use client";

import type { MouseEvent } from "react";
import { Pencil, Plus } from "lucide-react";
import type { TableViewMode } from "@/utils/table/viewMode";
import { useSort } from "@/hooks/useSort";
import type { PropertyWithMeta } from "@/types/property";
import CollapsibleTable from "@/components/ui/dashboard/CollapsibleTable";

/**
 * OwnersTable
 *
 * What it does: Collapsible, sortable table of properties for a single company group.
 * Why it exists: One instance is rendered per company inside OwnersGroupedView — mirrors
 *   BlocksTable's collapsible-per-company structure exactly.
 * What would break if removed: OwnersGroupedView would have no way to display property-owner data.
 */

type Props = {
  properties: PropertyWithMeta[];
  onView: (property: PropertyWithMeta) => void;
  onEdit: (property: PropertyWithMeta) => void;
  onDelete: (property: PropertyWithMeta) => void;
  onAssignOwner: (property: PropertyWithMeta) => void;
  viewMode?: TableViewMode;
  /** Company name shown as the collapsible section header. */
  headerTitle?: string;
};

// company_name column is omitted — it is now the collapsible section header.
type SortKey = "name" | "block_name" | "owner" | "display_label";

/**
 * Assign-owner icon button — dashboard tokens only (no `dark:`) so it stays readable in both themes.
 * Same token approach as addPropertyIconButtonClassName in BlocksTable.
 */
const assignOwnerIconButtonClassName =
  "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-1 border-dashboard-accent bg-dashboard-surface text-dashboard-accent shadow-sm transition-colors hover:bg-dashboard-accent/25";

/** Equal fifths + min-w-0 so Actions column cannot grow past 20% (buttons stay inside). */
const ownersTableCellWidthClass = "w-1/5 min-w-0 overflow-hidden";

export default function OwnersTable({
  properties,
  onView: _onView,
  onEdit,
  onDelete: _onDelete,
  onAssignOwner,
  viewMode = "auto",
  headerTitle = "Properties",
}: Props) {
  const { sortedItems, handleSort, getSortIndicator } = useSort<
    PropertyWithMeta,
    SortKey
  >(properties, {
    defaultKey: "name",
    getSortValueType: () => "string",
    getSortValue: (key, property) => {
      if (key === "name") return property.name;
      if (key === "block_name") return property.block_name ?? "";
      if (key === "owner") {
        const first = property.owners?.[0];
        const title = first?.user_title;
        const name = first?.display_name ?? first?.user_email ?? "";
        return title ? `${title} ${name}` : name;
      }
      if (key === "display_label") {
        const first = property.owners?.[0];
        return first?.display_label?.trim() ?? "";
      }
      return "";
    },
  });

  // Prevents the table-row click from bubbling when an action button is pressed.
  const stopRowClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const showCards = viewMode !== "table";
  const showTable = viewMode !== "cards";

  const cardsWrapperClassName =
    viewMode === "auto"
      ? "space-y-2 md:hidden"
      : "grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  const tableWrapperClassName =
    viewMode === "auto"
      ? "hidden overflow-x-auto rounded-lg border border-dashboard-border md:block"
      : "overflow-x-auto rounded-lg border border-dashboard-border";

  return (
    <CollapsibleTable title={headerTitle} defaultCollapsed={true}>
      {properties.length === 0 ? (
        <div className="rounded-lg border border-dashboard-border bg-dashboard-surface p-4 text-center">
          <p className="text-xs text-dashboard-muted">No properties found.</p>
        </div>
      ) : (
        <>
          {showCards ? (
            <div className={cardsWrapperClassName}>
              {sortedItems.map((property) => {
                const firstOwner = property.owners?.[0];
                const title = firstOwner?.user_title;
                const name = firstOwner?.display_name ?? firstOwner?.user_email ?? null;
                const ownerLabel = title ? `${title} ${name}` : name;
                const hasOwner = ownerLabel !== null;
                const blockLabel = property.block_name ?? "—";
                const displayLabelRaw = firstOwner?.display_label;
                const displayLabelText =
                  displayLabelRaw != null && String(displayLabelRaw).trim() !== ""
                    ? String(displayLabelRaw).trim()
                    : "—";

                return (
                  <article
                    key={property.id}
                    className="rounded-lg border border-dashboard-border bg-dashboard-surface p-3 transition-colors hover:bg-dashboard-hover"
                  >
                    <div className="space-y-2">
                      <p className="text-sm font-semibold leading-tight text-dashboard-text">
                        {property.name}
                      </p>

                      <p className="text-xs text-dashboard-muted">
                        Label: {displayLabelText}
                      </p>

                      <p className="text-xs text-dashboard-muted">
                        Owner: {ownerLabel ?? "—"}
                      </p>

                      <p className="text-xs text-dashboard-muted">Block: {blockLabel}</p>

                      <div className="flex flex-wrap gap-1.5">
                        {!hasOwner ? (
                          <button
                            onClick={(event) => {
                              stopRowClick(event);
                              onAssignOwner(property);
                            }}
                            title="Assign owner"
                            aria-label="Assign owner"
                            className={assignOwnerIconButtonClassName}
                          >
                            <Plus size={12} className="text-dashboard-accent" aria-hidden />
                          </button>
                        ) : null}

                        <button
                          onClick={(event) => {
                            stopRowClick(event);
                            onEdit(property);
                          }}
                          title="Edit property"
                          aria-label="Edit property"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-brand-accent bg-brand-accent/10 text-brand-accent transition-colors hover:bg-brand-accent/20"
                        >
                          <Pencil size={12} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}

          {showTable ? (
            <div className={tableWrapperClassName}>
              <table className="w-full table-fixed text-xs">
                <colgroup>
                  <col className="w-[20%]" />
                  <col className="w-[20%]" />
                  <col className="w-[20%]" />
                  <col className="w-[20%]" />
                  <col className="w-[20%]" />
                </colgroup>

                <thead className="bg-dashboard-hover text-left text-dashboard-muted">
                  <tr>
                    <th className={`px-3 py-2 font-medium ${ownersTableCellWidthClass}`}>
                      <button
                        type="button"
                        onClick={() => handleSort("name")}
                        className="inline-flex items-center gap-1 hover:text-dashboard-text"
                      >
                        <span>Property</span>
                        <span className="inline-flex w-4 justify-center text-dashboard-text">
                          {getSortIndicator("name")}
                        </span>
                      </button>
                    </th>

                    <th className={`px-3 py-2 font-medium ${ownersTableCellWidthClass}`}>
                      <button
                        type="button"
                        onClick={() => handleSort("display_label")}
                        className="inline-flex items-center gap-1 hover:text-dashboard-text"
                      >
                        <span>Label</span>
                        <span className="inline-flex w-4 justify-center text-dashboard-text">
                          {getSortIndicator("display_label")}
                        </span>
                      </button>
                    </th>

                    <th className={`px-3 py-2 font-medium ${ownersTableCellWidthClass}`}>
                      <button
                        type="button"
                        onClick={() => handleSort("owner")}
                        className="inline-flex items-center gap-1 hover:text-dashboard-text"
                      >
                        <span>Owner</span>
                        <span className="inline-flex w-4 justify-center text-dashboard-text">
                          {getSortIndicator("owner")}
                        </span>
                      </button>
                    </th>

                    <th className={`px-3 py-2 font-medium ${ownersTableCellWidthClass}`}>
                      <button
                        type="button"
                        onClick={() => handleSort("block_name")}
                        className="inline-flex items-center gap-1 hover:text-dashboard-text"
                      >
                        <span>Block</span>
                        <span className="inline-flex w-4 justify-center text-dashboard-text">
                          {getSortIndicator("block_name")}
                        </span>
                      </button>
                    </th>

                    <th
                      className={`px-3 py-2 text-right font-medium ${ownersTableCellWidthClass}`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {sortedItems.map((property) => {
                    const firstOwner = property.owners?.[0];
                    const title = firstOwner?.user_title;
                    const name = firstOwner?.display_name ?? firstOwner?.user_email ?? null;
                    const ownerLabel = title ? `${title} ${name}` : name;
                    const hasOwner = ownerLabel !== null;
                    const blockLabel = property.block_name ?? "—";
                    const displayLabelRaw = firstOwner?.display_label;
                    const displayLabelText =
                      displayLabelRaw != null && String(displayLabelRaw).trim() !== ""
                        ? String(displayLabelRaw).trim()
                        : "—";

                    return (
                      <tr
                        key={property.id}
                        className="border-t border-dashboard-border transition-colors hover:bg-dashboard-hover"
                      >
                        <td className={`px-3 py-2 ${ownersTableCellWidthClass}`}>
                          <span className="block truncate font-medium text-dashboard-text">
                            {property.name}
                          </span>
                        </td>

                        <td
                          className={`px-3 py-2 text-dashboard-muted ${ownersTableCellWidthClass}`}
                        >
                          <span className="block truncate">{displayLabelText}</span>
                        </td>

                        <td
                          className={`px-3 py-2 text-dashboard-muted ${ownersTableCellWidthClass}`}
                        >
                          <span className="block truncate">{ownerLabel ?? "—"}</span>
                        </td>

                        <td
                          className={`px-3 py-2 text-dashboard-muted ${ownersTableCellWidthClass}`}
                        >
                          <span className="block truncate">{blockLabel}</span>
                        </td>

                        <td className={`px-3 py-2 ${ownersTableCellWidthClass}`}>
                          <div className="flex min-w-0 items-center justify-end gap-1.5">
                            {!hasOwner ? (
                              <button
                                onClick={(event) => {
                                  stopRowClick(event);
                                  onAssignOwner(property);
                                }}
                                title="Assign owner"
                                aria-label="Assign owner"
                                className={assignOwnerIconButtonClassName}
                              >
                                <Plus size={12} className="text-dashboard-accent" aria-hidden />
                              </button>
                            ) : null}

                            <button
                              onClick={(event) => {
                                stopRowClick(event);
                                onEdit(property);
                              }}
                              title="Edit owner"
                              aria-label="Edit owner"
                              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-brand-accent bg-brand-accent/10 text-brand-accent transition-colors hover:bg-brand-accent/20"
                            >
                              <Pencil size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}
        </>
      )}
    </CollapsibleTable>
  );
}
