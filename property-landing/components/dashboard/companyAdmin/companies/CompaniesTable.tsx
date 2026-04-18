"use client";

import type { MouseEvent } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { TableViewMode } from "@/utils/table/viewMode";
import type { Company } from "@/types/company";
import { useSort } from "@/hooks/useSort";

type CompaniesTableProps = {
  companies: Company[];
  onEditStart: (company: Company) => void;
  onDetails: (company: Company) => void;
  onDelete: (id: number) => void;
  isLastCompany?: boolean;
  viewMode?: TableViewMode;
};

type SortKey = "id" | "name" | "address" | "block_count" | "property_count";


export default function CompaniesTable({
  companies,
  onEditStart,
  onDetails,
  onDelete,
  isLastCompany = false,
  viewMode = "auto",
}: CompaniesTableProps) {
  const { sortedItems: sortedCompanies, handleSort, getSortIndicator } = useSort<
    Company,
    SortKey
  >(companies, {
    defaultKey: "id",
    getSortValueType: (key) => {
      if (key === "id" || key === "block_count" || key === "property_count") {
        return "number";
      }
      return "string";
    },
    getSortValue: (key, company) => {
      if (key === "id") return company.id;
      if (key === "name") return company.name;
      if (key === "address") return company.address ?? "";
      if (key === "block_count") return company.block_count ?? 0;
      if (key === "property_count") return company.property_count ?? 0;
      return "";
    },
  });

  const stopRowClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  if (companies.length === 0) {
    return (
      <div className="rounded-lg border border-dashboard-border bg-dashboard-surface p-4 text-center">
        <p className="text-xs text-dashboard-muted">No companies yet. Add your first company.</p>
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
              {sortedCompanies.map((company) => (
                <article
                  key={company.id}
                  className="cursor-pointer rounded-lg border border-dashboard-border bg-dashboard-surface p-3 transition-colors hover:bg-dashboard-hover"
                  onClick={() => onDetails(company)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onDetails(company);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open details for ${company.name}`}
                >
              <div className="space-y-2">
                <p className="text-[11px] text-dashboard-muted">ID: {company.id}</p>

                <p className="text-sm font-semibold leading-tight text-dashboard-text">
                  {company.name}
                </p>

                <p className="text-xs text-dashboard-muted">
                  {company.address ? company.address : <span className="italic">No address</span>}
                </p>

                <p className="text-xs text-dashboard-muted">
                  Blocks: {company.block_count} | Properties: {company.property_count}
                </p>

                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={(event) => {
                        stopRowClick(event);
                        onDetails(company);
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
                        onEditStart(company);
                      }}
                      title="Edit company"
                      aria-label="Edit company"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-brand-accent bg-brand-accent/10 text-brand-accent transition-colors hover:bg-brand-accent/20"
                    >
                      <Pencil size={12} />
                    </button>

                    {!isLastCompany ? (
                      <button
                        onClick={(event) => {
                          stopRowClick(event);
                          onDelete(company.id);
                        }}
                        title="Delete company"
                        aria-label="Delete company"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-error bg-error/10 text-error transition-colors hover:bg-error/20"
                      >
                        <Trash2 size={12} />
                      </button>
                    ) : null}
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
              <col className="w-[8%]" />
              <col className="w-[24%]" />
              <col className="w-[28%]" />
              <col className="w-[10%]" />
              <col className="w-[10%]" />
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
                    onClick={() => handleSort("address")}
                    className="inline-flex items-center gap-1 hover:text-dashboard-text"
                  >
                    <span>Address</span>
                    <span className="inline-flex w-4 justify-center text-dashboard-text">
                      {getSortIndicator("address")}
                    </span>
                  </button>
                </th>
                <th className="px-3 py-2 text-center font-medium">
                  <button
                    type="button"
                    onClick={() => handleSort("block_count")}
                    className="inline-flex items-center gap-1 hover:text-dashboard-text"
                  >
                    <span>Blocks</span>
                    <span className="inline-flex w-4 justify-center text-dashboard-text">
                      {getSortIndicator("block_count")}
                    </span>
                  </button>
                </th>
                <th className="px-3 py-2 text-center font-medium">
                  <button
                    type="button"
                    onClick={() => handleSort("property_count")}
                    className="inline-flex items-center gap-1 hover:text-dashboard-text"
                  >
                    <span>Properties</span>
                    <span className="inline-flex w-4 justify-center text-dashboard-text">
                      {getSortIndicator("property_count")}
                    </span>
                  </button>
                </th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {sortedCompanies.map((company) => (
                <tr
                  key={company.id}
                  className="cursor-pointer border-t border-dashboard-border transition-colors hover:bg-dashboard-hover"
                  onClick={() => onDetails(company)}
                >
                  <td className="px-3 py-2 text-dashboard-muted">{company.id || "-"}</td>
                  <td className="px-3 py-2 font-medium text-dashboard-text">{company.name}</td>
                  <td className="px-3 py-2 text-dashboard-muted">{company.address || "-"}</td>
                  <td className="px-3 py-2 text-center text-dashboard-muted">{company.block_count || "-"}</td>
                  <td className="px-3 py-2 text-center text-dashboard-muted">{company.property_count || "-"}</td>
                          <td className="px-3 py-2">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={(event) => {
                                  stopRowClick(event);
                                  onDetails(company);
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
                                  onEditStart(company);
                                }}
                                title="Edit company"
                                aria-label="Edit company"
                                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-brand-accent bg-brand-accent/10 text-brand-accent transition-colors hover:bg-brand-accent/20"
                              >
                                <Pencil size={12} />
                              </button>

                              {!isLastCompany ? (
                                <button
                                  onClick={(event) => {
                                    stopRowClick(event);
                                    onDelete(company.id);
                                  }}
                                  title="Delete company"
                                  aria-label="Delete company"
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-error bg-error/10 text-error transition-colors hover:bg-error/20"
                                >
                                  <Trash2 size={12} />
                                </button>
                              ) : null}
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
