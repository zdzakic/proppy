"use client";

import { useMemo, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  sortByNumber,
  sortByString,
  type SortDirection,
} from "@/utils/table/sorting";
import type { TableViewMode } from "@/utils/table/viewMode";

type PropertyRow = {
  id: number;
  name: string;
  comment?: string;
};

type PropertiesTableProps = {
  properties: PropertyRow[];
  onDetails: (property: PropertyRow) => void;
  onEdit: (property: PropertyRow) => void;
  onDelete: (property: PropertyRow) => void;
  viewMode?: TableViewMode;
};

type SortKey = "id" | "name" | "comment";

export default function PropertiesTable({
  properties,
  onDetails,
  onEdit,
  onDelete,
  viewMode = "auto",
}: PropertiesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedProperties = useMemo(() => {
    if (sortKey === "id") {
      return sortByNumber(properties, (property) => property.id, sortDirection);
    }

    if (sortKey === "name") {
      return sortByString(properties, (property) => property.name, sortDirection);
    }

    return sortByString(properties, (property) => property.comment, sortDirection);
  }, [properties, sortDirection, sortKey]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection("asc");
  };

  const getSortIndicator = (key: SortKey) => {
    if (sortKey !== key) return "";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  if (properties.length === 0) {
    return (
      <div className="rounded-lg border border-dashboard-border bg-dashboard-surface p-4 text-center">
        <p className="text-xs text-dashboard-muted">No properties in this block yet.</p>
      </div>
    );
  }

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
        {sortedProperties.map((property) => (
          <article
            key={property.id}
            className="rounded-lg border border-dashboard-border bg-dashboard-surface p-3 transition-colors hover:bg-dashboard-hover"
          >
            <div className="space-y-2">
              <p className="text-[11px] text-dashboard-muted">ID: {property.id}</p>

              <p className="text-sm font-semibold leading-tight text-dashboard-text">
                {property.name}
              </p>

              <p className="text-xs text-dashboard-muted">
                Comment: {property.comment?.trim() ? property.comment : "-"}
              </p>

              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => onDetails(property)}
                  title="View property details"
                  aria-label="View property details"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-success bg-success/10 text-success transition-colors hover:bg-success/20"
                >
                  <Eye size={12} />
                </button>

                <button
                  onClick={() => onEdit(property)}
                  title="Edit property"
                  aria-label="Edit property"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-brand-accent bg-brand-accent/10 text-brand-accent transition-colors hover:bg-brand-accent/20"
                >
                  <Pencil size={12} />
                </button>

                <button
                  onClick={() => onDelete(property)}
                  title="Delete property"
                  aria-label="Delete property"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-error bg-error/10 text-error transition-colors hover:bg-error/20"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      ) : null}

      {showTable ? (
      <div className={tableWrapperClassName}>
        <table className="w-full table-fixed text-xs">
          <colgroup>
            <col className="w-[12%]" />
            <col className="w-[28%]" />
            <col className="w-[40%]" />
            <col className="w-[20%]" />
          </colgroup>

          <thead className="bg-dashboard-hover text-left text-dashboard-muted">
            <tr>
              <th className="px-3 py-2 font-medium">
                <button
                  type="button"
                  onClick={() => handleSort("id")}
                  className="inline-flex items-center gap-1 hover:text-dashboard-text"
                >
                  <span>ID</span>
                  <span className="inline-flex w-4 justify-center text-dashboard-text">
                    {getSortIndicator("id")}
                  </span>
                </button>
              </th>
              <th className="px-3 py-2 font-medium">
                <button
                  type="button"
                  onClick={() => handleSort("name")}
                  className="inline-flex items-center gap-1 hover:text-dashboard-text"
                >
                  <span>Name</span>
                  <span className="inline-flex w-4 justify-center text-dashboard-text">
                    {getSortIndicator("name")}
                  </span>
                </button>
              </th>
              <th className="px-3 py-2 font-medium">
                <button
                  type="button"
                  onClick={() => handleSort("comment")}
                  className="inline-flex items-center gap-1 hover:text-dashboard-text"
                >
                  <span>Comment</span>
                  <span className="inline-flex w-4 justify-center text-dashboard-text">
                    {getSortIndicator("comment")}
                  </span>
                </button>
              </th>
              <th className="px-3 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedProperties.map((property) => (
              <tr
                key={property.id}
                className="border-t border-dashboard-border transition-colors hover:bg-dashboard-hover"
              >
                <td className="px-3 py-2 text-dashboard-muted">{property.id}</td>
                <td className="px-3 py-2 font-medium text-dashboard-text">{property.name}</td>
                <td className="px-3 py-2 text-dashboard-muted">
                  {property.comment?.trim() ? property.comment : "-"}
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onDetails(property)}
                      title="View property details"
                      aria-label="View property details"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-success bg-success/10 text-success transition-colors hover:bg-success/20"
                    >
                      <Eye size={12} />
                    </button>

                    <button
                      onClick={() => onEdit(property)}
                      title="Edit property"
                      aria-label="Edit property"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-brand-accent bg-brand-accent/10 text-brand-accent transition-colors hover:bg-brand-accent/20"
                    >
                      <Pencil size={12} />
                    </button>

                    <button
                      onClick={() => onDelete(property)}
                      title="Delete property"
                      aria-label="Delete property"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-error bg-error/10 text-error transition-colors hover:bg-error/20"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      ) : null}
    </div>
  );
}
