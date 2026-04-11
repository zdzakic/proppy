"use client";

import { useMemo, useState } from "react";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import {
  sortByNumber,
  sortByString,
  type SortDirection,
} from "@/utils/table/sorting";

type Block = {
  id: number;
  name: string;
  comment?: string;
  properties?: { id: number; name: string }[];
};

type Props = {
  blocks: Block[];
  onEditStart: (block: Block) => void;
  onAddProperty: (block: Block) => void;
  onDetails: (id: number) => void;
  onDelete: (id: number) => void;
};

type SortKey = "name" | "properties" | "comment";

export default function BlocksTable({
  blocks,
  onEditStart,
  onAddProperty,
  onDetails,
  onDelete,
}: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedBlocks = useMemo(() => {
    if (sortKey === "name") {
      return sortByString(blocks, (block) => block.name, sortDirection);
    }

    if (sortKey === "properties") {
      return sortByNumber(
        blocks,
        (block) => block.properties?.length ?? 0,
        sortDirection
      );
    }

    return sortByString(blocks, (block) => block.comment, sortDirection);
  }, [blocks, sortDirection, sortKey]);

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

  const stopRowClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

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
        {sortedBlocks.map((block) => (
          <article
            key={block.id}
            className="cursor-pointer rounded-lg border border-dashboard-border bg-dashboard-surface p-3 transition-colors hover:bg-dashboard-hover"
            onClick={() => onDetails(block.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onDetails(block.id);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Open details for ${block.name}`}
          >
            <div className="space-y-2">
              <p className="text-sm font-semibold leading-tight text-dashboard-text">{block.name}</p>

              <p className="text-xs text-dashboard-muted">
                Properties: {block.properties?.length ?? 0}
              </p>

              <p className="text-xs text-dashboard-muted">
                Comment: {block.comment?.trim() ? block.comment : "-"}
              </p>

              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={(event) => {
                    stopRowClick(event);
                    onAddProperty(block);
                  }}
                  title="Add property"
                  aria-label="Add property"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-brand-primary bg-brand-primary/10 text-brand-primary transition-colors hover:bg-brand-primary/20"
                >
                  <Plus size={12} />
                </button>

                <button
                  onClick={(event) => {
                    stopRowClick(event);
                    onDetails(block.id);
                  }}
                  title="View details"
                  aria-label="View details"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-success bg-success/10 text-success transition-colors hover:bg-success/20"
                >
                  <Eye size={12} />
                </button>

                <button
                  onClick={(event) => {
                    stopRowClick(event);
                    onEditStart(block);
                  }}
                  title="Edit block"
                  aria-label="Edit block"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-brand-accent bg-brand-accent/10 text-brand-accent transition-colors hover:bg-brand-accent/20"
                >
                  <Pencil size={12} />
                </button>

                <button
                  onClick={(event) => {
                    stopRowClick(event);
                    onDelete(block.id);
                  }}
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
        <table className="w-full table-fixed text-xs">
          <colgroup>
            <col className="w-[32%]" />
            <col className="w-[18%]" />
            <col className="w-[30%]" />
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
                  <span>Name</span>
                  <span className="inline-flex w-4 justify-center text-dashboard-text">
                    {getSortIndicator("name")}
                  </span>
                </button>
              </th>
              <th className="px-3 py-2 font-medium">
                <button
                  type="button"
                  onClick={() => handleSort("properties")}
                  className="inline-flex items-center gap-1 hover:text-dashboard-text"
                >
                  <span>Properties</span>
                  <span className="inline-flex w-4 justify-center text-dashboard-text">
                    {getSortIndicator("properties")}
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
            {sortedBlocks.map((block) => (
              <tr
                key={block.id}
                className="cursor-pointer border-t border-dashboard-border transition-colors hover:bg-dashboard-hover"
                onClick={() => onDetails(block.id)}
              >
                <td className="px-3 py-2">
                  <span className="font-medium text-dashboard-text">{block.name}</span>
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
                      onClick={(event) => {
                        stopRowClick(event);
                        onAddProperty(block);
                      }}
                      title="Add property"
                      aria-label="Add property"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-brand-primary bg-brand-primary/10 text-brand-primary transition-colors hover:bg-brand-primary/20"
                    >
                      <Plus size={12} />
                    </button>

                    <button
                      onClick={(event) => {
                        stopRowClick(event);
                        onDetails(block.id);
                      }}
                      title="View details"
                      aria-label="View details"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-success bg-success/10 text-success transition-colors hover:bg-success/20"
                    >
                      <Eye size={12} />
                    </button>

                    <button
                      onClick={(event) => {
                        stopRowClick(event);
                        onEditStart(block);
                      }}
                      title="Edit block"
                      aria-label="Edit block"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-brand-accent bg-brand-accent/10 text-brand-accent transition-colors hover:bg-brand-accent/20"
                    >
                      <Pencil size={12} />
                    </button>

                    <button
                      onClick={(event) => {
                        stopRowClick(event);
                        onDelete(block.id);
                      }}
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