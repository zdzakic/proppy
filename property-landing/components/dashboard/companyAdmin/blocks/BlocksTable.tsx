"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import type { TableViewMode } from "@/utils/table/viewMode";
import { useSort } from "@/hooks/useSort";

import type { Block } from "@/types/Block";


type Props = {
  blocks: Block[];
  onEditStart: (block: Block) => void;
  onAddProperty: (block: Block) => void;
  onDetails: (id: number) => void;
  onDelete: (id: number) => void;
  viewMode?: BlocksViewMode;
};

type SortKey = "name" | "company_name" | "properties" | "comment";
export type BlocksViewMode = TableViewMode;

export default function BlocksTable({
  blocks,
  onEditStart,
  onAddProperty,
  onDetails,
  onDelete,
  viewMode = "auto",
}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { sortedItems: sortedBlocks, handleSort, getSortIndicator } = useSort<
    Block,
    SortKey
  >(blocks, {
    defaultKey: "name",
    getSortValueType: (key) => {
      if (key === "properties") return "number";
      return "string";
    },
    getSortValue: (key, block) => {
      if (key === "name") return block.name;
      if (key === "company_name") return block.company_name;
      if (key === "properties") return block.properties?.length ?? 0;
      if (key === "comment") return block.comment ?? "";
      return "";
    },
  });

  const stopRowClick = (event: React.MouseEvent<HTMLElement>) => {
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
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setIsCollapsed((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-lg border border-dashboard-border bg-dashboard-surface px-3 py-2 text-left transition-colors hover:bg-dashboard-hover"
        aria-expanded={!isCollapsed}
      >
        <span className="text-sm font-semibold text-dashboard-text">Blocks</span>
        <span className="inline-flex items-center justify-center rounded-md border border-dashboard-border bg-dashboard-surface p-1.5 text-dashboard-text">
          {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </span>
      </button>

      {!isCollapsed ? (
        <>
          {blocks.length === 0 ? (
            <div className="rounded-lg border border-dashboard-border bg-dashboard-surface p-4 text-center">
              <p className="text-xs text-dashboard-muted">
                No blocks yet. Add your first block.
              </p>
            </div>
          ) : (
            <>
              {showCards ? (
                <div className={cardsWrapperClassName}>
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
                        <p className="text-sm font-semibold leading-tight text-dashboard-text">
                          {block.name}
                        </p>
                        <p className="text-xs text-dashboard-muted">{block.company_name}</p>

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
              ) : null}

              {showTable ? (
                <div className={tableWrapperClassName}>
                  <table className="w-full table-fixed text-xs">
                    <colgroup>
                      <col className="w-[24%]" />
                      <col className="w-[24%]" />
                      <col className="w-[12%]" />
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
                            <span>Name</span>
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
                            {block.company_name}
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
              ) : null}
            </>
          )}
        </>
      ) : null}
    </div>
  );
}