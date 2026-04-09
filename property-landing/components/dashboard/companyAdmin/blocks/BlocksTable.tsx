"use client";

import { Eye, Pencil, Save, Trash2 } from "lucide-react";

type Block = {
  id: number;
  name: string;
  comment?: string;
  properties?: { id: number; name: string }[];
};

type Props = {
  blocks: Block[];
  editingId: number | null;
  editName: string;
  setEditName: (v: string) => void;
  onEditStart: (block: Block) => void;
  onDetails: (id: number) => void;
  onSave: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function BlocksTable({
  blocks,
  editingId,
  editName,
  setEditName,
  onEditStart,
  onDetails,
  onSave,
  onDelete,
}: Props) {
  if (blocks.length === 0) {
    return (
      <div className="rounded-lg border border-dashboard-border bg-dashboard-surface p-4 text-center">
        <p className="text-xs text-dashboard-muted">No blocks yet. Add your first block.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="space-y-2 md:hidden">
        {blocks.map((block) => (
          <article
            key={block.id}
            className="rounded-lg border border-dashboard-border bg-dashboard-surface p-3"
          >
            <div className="space-y-2">
              {editingId === block.id ? (
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-md border border-dashboard-border bg-dashboard-surface px-2.5 py-1.5 text-xs text-dashboard-text focus:outline-none focus:ring-2 focus:ring-dashboard-ring"
                />
              ) : (
                <p className="text-sm font-semibold leading-tight text-dashboard-text">{block.name}</p>
              )}

              <p className="text-xs text-dashboard-muted">
                Properties: {block.properties?.length ?? 0}
              </p>

              <p className="text-xs text-dashboard-muted">
                Comment: {block.comment?.trim() ? block.comment : "-"}
              </p>

              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => onDetails(block.id)}
                  title="View details"
                  aria-label="View details"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-success bg-success/10 text-success transition-colors hover:bg-success/20"
                >
                  <Eye size={12} />
                </button>

                {editingId === block.id ? (
                  <button
                    onClick={() => onSave(block.id)}
                    className="inline-flex items-center gap-1 rounded-md border border-brand-primary bg-brand-primary px-2.5 py-1 text-[11px] font-medium text-white transition-opacity hover:opacity-90"
                  >
                    <Save size={12} />
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => onEditStart(block)}
                    title="Edit block"
                    aria-label="Edit block"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-brand-accent bg-brand-accent/10 text-brand-accent transition-colors hover:bg-brand-accent/20"
                  >
                    <Pencil size={12} />
                  </button>
                )}

                <button
                  onClick={() => onDelete(block.id)}
                  title="Delete block"
                  aria-label="Delete block"
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
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Properties</th>
              <th className="px-3 py-2 font-medium">Comment</th>
              <th className="px-3 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {blocks.map((block) => (
              <tr key={block.id} className="border-t border-dashboard-border">
                <td className="px-3 py-2">
                  {editingId === block.id ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full rounded-md border border-dashboard-border bg-dashboard-surface px-2.5 py-1.5 text-xs text-dashboard-text focus:outline-none focus:ring-2 focus:ring-dashboard-ring"
                    />
                  ) : (
                    <span className="font-medium text-dashboard-text">{block.name}</span>
                  )}
                </td>

                <td className="px-3 py-2 text-dashboard-muted">
                  {block.properties?.length ?? 0}
                </td>

                <td className="px-3 py-2 text-dashboard-muted">
                  {block.comment?.trim() ? block.comment : "-"}
                </td>

                <td className="px-3 py-2">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onDetails(block.id)}
                      title="View details"
                      aria-label="View details"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-success bg-success/10 text-success transition-colors hover:bg-success/20"
                    >
                      <Eye size={12} />
                    </button>

                    {editingId === block.id ? (
                      <button
                        onClick={() => onSave(block.id)}
                        className="inline-flex items-center gap-1 rounded-md border border-brand-primary bg-brand-primary px-2.5 py-1 text-[11px] font-medium text-white transition-opacity hover:opacity-90"
                      >
                        <Save size={12} />
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => onEditStart(block)}
                        title="Edit block"
                        aria-label="Edit block"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-brand-accent bg-brand-accent/10 text-brand-accent transition-colors hover:bg-brand-accent/20"
                      >
                        <Pencil size={12} />
                      </button>
                    )}

                    <button
                      onClick={() => onDelete(block.id)}
                      title="Delete block"
                      aria-label="Delete block"
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