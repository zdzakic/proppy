"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

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
};

export default function PropertiesTable({
  properties,
  onDetails,
  onEdit,
  onDelete,
}: PropertiesTableProps) {
  if (properties.length === 0) {
    return (
      <div className="rounded-lg border border-dashboard-border bg-dashboard-surface p-4 text-center">
        <p className="text-xs text-dashboard-muted">No properties in this block yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="space-y-2 md:hidden">
        {properties.map((property) => (
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

      <div className="hidden overflow-x-auto rounded-lg border border-dashboard-border md:block">
        <table className="w-full text-xs">
          <thead className="bg-dashboard-hover text-left text-dashboard-muted">
            <tr>
              <th className="px-3 py-2 font-medium">ID</th>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Comment</th>
              <th className="px-3 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {properties.map((property) => (
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
    </div>
  );
}
