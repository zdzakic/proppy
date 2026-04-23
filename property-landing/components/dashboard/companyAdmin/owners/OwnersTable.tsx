"use client";

import type { MouseEvent } from "react";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import type { TableViewMode } from "@/utils/table/viewMode";
import { useSort } from "@/hooks/useSort";
import type { PropertyWithMeta } from "@/types/property";

/**
 * OwnersTable
 *
 * What it does: Flat, sortable table of all properties with ownership status and actions.
 * Why it exists: Mirrors CompaniesTable — same structure, same viewMode logic, same action
 *   button styles — so the Owners page looks and behaves identically to the Companies page.
 * What would break if removed: OwnersManager would have no way to display property-owner data.
 */

type Props = {
  properties: PropertyWithMeta[];
  onView: (property: PropertyWithMeta) => void;
  onEdit: (property: PropertyWithMeta) => void;
  onDelete: (property: PropertyWithMeta) => void;
  onAssignOwner: (property: PropertyWithMeta) => void;
  viewMode?: TableViewMode;
};

type SortKey = "name" | "block_name" | "company_name" | "owner";

/**
 * Assign-owner icon button (copied from BlocksTable).
 * Uses dashboard tokens only to remain readable in both themes.
 */
const assignOwnerIconButtonClassName =
  "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-1 border-dashboard-accent bg-dashboard-surface text-dashboard-accent shadow-sm transition-colors hover:bg-dashboard-accent/25";

export default function OwnersTable({
  properties,
  onView,
  onEdit,
  onDelete,
  onAssignOwner,
  viewMode = "auto",
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
      if (key === "company_name") return property.company_name ?? "";
      if (key === "owner") {
        const first = property.owners?.[0];
        return first?.display_name ?? first?.user_email ?? "";
      }
      return "";
    },
  });

  // Prevents the table-row click from bubbling when an action button is pressed.
  const stopRowClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  if (properties.length === 0) {
    return (
      <div className="rounded-lg border border-dashboard-border bg-dashboard-surface p-4 text-center">
        <p className="text-xs text-dashboard-muted">No properties found.</p>
      </div>
    );
  }

  // viewMode logic mirrors CompaniesTable exactly.
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
    <div className="space-y-2">
      {showCards ? (
        <div className={cardsWrapperClassName}>
          {sortedItems.map((property) => {
            const firstOwner = property.owners?.[0];
            const ownerLabel =
              firstOwner?.display_name ?? firstOwner?.user_email ?? null;
            const hasOwner = ownerLabel !== null;
            const blockLabel = property.block_name ?? "—";
            const companyLabel = property.company_name ?? "—";

            return (
              <article
                key={property.id}
                className="rounded-lg border border-dashboard-border bg-dashboard-surface p-3 transition-colors hover:bg-dashboard-hover"
              >
                <div className="space-y-2">
                  <p className="text-sm font-semibold leading-tight text-dashboard-text">
                    {property.name}
                  </p>

                  <p className="text-xs text-dashboard-muted">Block: {blockLabel}</p>
                  <p className="text-xs text-dashboard-muted">Company: {companyLabel}</p>

                  <p className="text-xs text-dashboard-muted">
                    Owner: {ownerLabel ?? "—"}
                  </p>

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

                    {/* <button
                      onClick={(event) => {
                        stopRowClick(event);
                        onView(property);
                      }}
                      title="View property"
                      aria-label="View property"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-success bg-success/10 text-success transition-colors hover:bg-success/20"
                    >
                      <Eye size={12} />
                    </button> */}

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

                    {/* <button
                      onClick={(event) => {
                        stopRowClick(event);
                        onDelete(property);
                      }}
                      title="Delete property"
                      aria-label="Delete property"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-error bg-error/10 text-error transition-colors hover:bg-error/20"
                    >
                      <Trash2 size={12} />
                    </button> */}
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
              <col className="w-[22%]" />
              <col className="w-[18%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
            </colgroup>

            <thead className="bg-dashboard-hover text-left text-dashboard-muted">
              <tr>
                <th className="px-3 py-2 font-medium">
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

                <th className="px-3 py-2 font-medium">
                  <button
                    type="button"
                    onClick={() => handleSort("company_name")}
                    className="inline-flex items-center gap-1 hover:text-dashboard-text"
                  >
                    <span>Company</span>
                    <span className="inline-flex w-4 justify-center text-dashboard-text">
                      {getSortIndicator("company_name")}
                    </span>
                  </button>
                </th>

                <th className="px-3 py-2 font-medium">
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

                <th className="px-3 py-2 font-medium">
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

                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {sortedItems.map((property) => {
                const firstOwner = property.owners?.[0];
                const ownerLabel =
                  firstOwner?.display_name ?? firstOwner?.user_email ?? null;
                const hasOwner = ownerLabel !== null;
                const blockLabel =  property.block_name ?? "—";
                const companyLabel = property.company_name ?? "—";

                return (
                  <tr
                    key={property.id}
                    className="border-t border-dashboard-border transition-colors hover:bg-dashboard-hover"
                  >
                    <td className="px-3 py-2">
                      <span className="font-medium text-dashboard-text">
                        {property.name}
                      </span>
                    </td>

                    <td className="px-3 py-2 text-dashboard-muted">
                      {companyLabel}
                    </td>

                    <td className="px-3 py-2 text-dashboard-muted">
                      {blockLabel}
                    </td>

                    <td className="px-3 py-2 text-dashboard-muted">
                      {ownerLabel ?? "—"}
                    </td>

                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-1.5">
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

                        {/* <button
                          onClick={(event) => {
                            stopRowClick(event);
                            onView(property);
                          }}
                          title="View property"
                          aria-label="View property"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-success bg-success/10 text-success transition-colors hover:bg-success/20"
                        >
                          <Eye size={12} />
                        </button> */}

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

                        {/* <button
                          onClick={(event) => {
                            stopRowClick(event);
                            onDelete(property);
                          }}
                          title="Delete property"
                          aria-label="Delete property"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-error bg-error/10 text-error transition-colors hover:bg-error/20"
                        >
                          <Trash2 size={12} />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
