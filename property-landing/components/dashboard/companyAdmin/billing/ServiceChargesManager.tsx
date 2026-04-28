"use client";

/**
 * ServiceChargesManager
 *
 * What it does: Fetches billing data and renders one collapsible charge table per company,
 *   following the same section layout, viewMode toggle, and CollapsibleTable + useSort pattern
 *   as BlocksManager / BlocksGroupedView / BlocksTable.
 * Why it exists: Gives CompanyAdmin a grouped billing overview for the current period.
 * What would break if removed: The billing section of CompanyAdminDashboard disappears.
 *
 * Pattern: mirrors BlocksManager (outer section) → BlocksGroupedView (toggle + grouping)
 *   → BlocksTable (viewMode-aware collapsible table), all collapsed into one file since
 *   there are no modals or hooks to separate out.
 */

import { useMemo, useState } from "react";
import type { MouseEvent } from "react";
import { Eye, Plus } from "lucide-react";

import CollapsibleTable from "@/components/ui/dashboard/CollapsibleTable";
import TableLayoutToggle from "@/components/dashboard/shared/common/TableLayoutToggle";
import { useSort } from "@/hooks/useSort";
import { useServiceCharges } from "@/hooks/useServiceCharges";
import type { TableViewMode } from "@/utils/table/viewMode";
import type { ServiceCharge } from "@/types/serviceCharge";


// ---------------------------------------------------------------------------
// Local helpers
// ---------------------------------------------------------------------------

type SortKey =
  | "property_name"
  | "owner_name"
  | "amount"
  | "paid"
  | "remaining"
  | "status";

/** Status badge classes use design tokens from globals.css (same token style as BlocksTable). */
const STATUS_BADGE: Record<ServiceCharge["status"], string> = {
  paid: "border border-success bg-success/10 text-success",
  partial: "border border-warning bg-warning/10 text-warning",
  unpaid: "border border-error bg-error/10 text-error",
};

const STATUS_LABEL: Record<ServiceCharge["status"], string> = {
  paid: "Paid",
  partial: "Partial",
  unpaid: "Unpaid",
};

/** DRF may return DecimalField amounts as strings — normalise to two-decimal display. */
function fmt(value: number | string): string {
  return Number(value).toFixed(2);
}

const stopPropagation = (e: MouseEvent<HTMLElement>) => e.stopPropagation();


// ---------------------------------------------------------------------------
// ChargesBlock — one collapsible, sortable section per company
// ---------------------------------------------------------------------------

/**
 * ChargesBlock
 *
 * What it does: Collapsible, sortable, viewMode-aware table of service charges for one company.
 * Why it exists: useSort is a hook — cannot be called inside a .map() — so each group needs
 *   its own component instance. Same reason BlocksTable is separate from BlocksGroupedView.
 * What would break if removed: ServiceChargesManager could not render sorted per-company sections.
 *
 * viewMode pattern (identical to BlocksTable):
 *   "auto"  → cards visible below md, table visible from md (responsive default)
 *   "table" → always show table only
 *   "cards" → always show cards only
 */
function ChargesBlock({
  charges,
  title,
  viewMode = "auto",
}: {
  charges: ServiceCharge[];
  title: string;
  viewMode?: TableViewMode;
}) {
  const { sortedItems, handleSort, getSortIndicator } = useSort<
    ServiceCharge,
    SortKey
  >(charges, {
    defaultKey: "property_name",
    getSortValueType: (key) => {
      if (key === "amount" || key === "paid" || key === "remaining") {
        return "number";
      }
      return "string";
    },
    getSortValue: (key, c) => {
      if (key === "property_name") return c.property_name;
      if (key === "owner_name") return c.owner_name;
      if (key === "amount") return Number(c.amount);
      if (key === "paid") return Number(c.paid);
      if (key === "remaining") return Number(c.remaining);
      if (key === "status") return c.status;
      return "";
    },
  });

  // LEARN: same showCards/showTable pattern as BlocksTable — controls which view renders.
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
    <CollapsibleTable title={title}>
      {charges.length === 0 ? (
        <div className="rounded-lg border border-dashboard-border bg-dashboard-surface p-4 text-center">
          <p className="text-xs text-dashboard-muted">No charges found.</p>
        </div>
      ) : (
        <>
          {/* ── CARDS ─────────────────────────────────────────────────── */}
          {showCards ? (
            <div className={cardsWrapperClassName}>
              {sortedItems.map((c) => (
                <article
                  key={c.id}
                  className="rounded-lg border border-dashboard-border bg-dashboard-surface p-3 transition-colors hover:bg-dashboard-hover"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold leading-tight text-dashboard-text">
                        {c.property_name}
                      </p>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[c.status]}`}
                      >
                        {STATUS_LABEL[c.status]}
                      </span>
                    </div>

                    <p className="text-xs text-dashboard-muted">
                      Owner: {c.owner_name}
                    </p>
                    <p className="text-xs text-dashboard-muted">
                      Period: {c.period_name}
                    </p>

                    <div className="grid grid-cols-3 gap-1 text-xs">
                      <div>
                        <p className="text-dashboard-muted">Charge</p>
                        <p className="font-medium text-dashboard-text">
                          {fmt(c.amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-dashboard-muted">Paid</p>
                        <p className="font-medium text-success">{fmt(c.paid)}</p>
                      </div>
                      <div>
                        <p className="text-dashboard-muted">Remaining</p>
                        <p
                          className={`font-medium ${
                            Number(c.remaining) > 0 ? "text-error" : "text-success"
                          }`}
                        >
                          {fmt(c.remaining)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <button
                        type="button"
                        title="Add payment"
                        aria-label="Add payment"
                        onClick={stopPropagation}
                        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-dashboard-accent bg-dashboard-surface text-dashboard-accent shadow-sm transition-colors hover:bg-dashboard-accent/25"
                      >
                        <Plus size={12} aria-hidden />
                      </button>

                      <button
                        type="button"
                        title="View charge"
                        aria-label="View charge"
                        onClick={stopPropagation}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-success bg-success/10 text-success transition-colors hover:bg-success/20"
                      >
                        <Eye size={12} aria-hidden />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : null}

          {/* ── TABLE ─────────────────────────────────────────────────── */}
          {showTable ? (
            <div className={tableWrapperClassName}>
              <table className="w-full table-fixed text-xs">
                <colgroup>
                  <col className="w-[22%]" />
                  <col className="w-[20%]" />
                  <col className="w-[10%]" />
                  <col className="w-[10%]" />
                  <col className="w-[11%]" />
                  <col className="w-[11%]" />
                  <col className="w-[16%]" />
                </colgroup>

                <thead className="bg-dashboard-hover text-left text-dashboard-muted">
                  <tr>
                    <th className="px-3 py-2 font-medium">
                      <button
                        type="button"
                        onClick={() => handleSort("property_name")}
                        className="inline-flex items-center gap-1 hover:text-dashboard-text"
                      >
                        <span>Property</span>
                        <span className="inline-flex w-4 justify-center text-dashboard-text">
                          {getSortIndicator("property_name")}
                        </span>
                      </button>
                    </th>

                    <th className="px-3 py-2 font-medium">
                      <button
                        type="button"
                        onClick={() => handleSort("owner_name")}
                        className="inline-flex items-center gap-1 hover:text-dashboard-text"
                      >
                        <span>Owner</span>
                        <span className="inline-flex w-4 justify-center text-dashboard-text">
                          {getSortIndicator("owner_name")}
                        </span>
                      </button>
                    </th>

                    <th className="px-3 py-2 font-medium">
                      <button
                        type="button"
                        onClick={() => handleSort("amount")}
                        className="inline-flex items-center gap-1 hover:text-dashboard-text"
                      >
                        <span>Charge</span>
                        <span className="inline-flex w-4 justify-center text-dashboard-text">
                          {getSortIndicator("amount")}
                        </span>
                      </button>
                    </th>

                    <th className="px-3 py-2 font-medium">
                      <button
                        type="button"
                        onClick={() => handleSort("paid")}
                        className="inline-flex items-center gap-1 hover:text-dashboard-text"
                      >
                        <span>Paid</span>
                        <span className="inline-flex w-4 justify-center text-dashboard-text">
                          {getSortIndicator("paid")}
                        </span>
                      </button>
                    </th>

                    <th className="px-3 py-2 font-medium">
                      <button
                        type="button"
                        onClick={() => handleSort("remaining")}
                        className="inline-flex items-center gap-1 hover:text-dashboard-text"
                      >
                        <span>Remaining</span>
                        <span className="inline-flex w-4 justify-center text-dashboard-text">
                          {getSortIndicator("remaining")}
                        </span>
                      </button>
                    </th>

                    <th className="px-3 py-2 font-medium">
                      <button
                        type="button"
                        onClick={() => handleSort("status")}
                        className="inline-flex items-center gap-1 hover:text-dashboard-text"
                      >
                        <span>Status</span>
                        <span className="inline-flex w-4 justify-center text-dashboard-text">
                          {getSortIndicator("status")}
                        </span>
                      </button>
                    </th>

                    <th className="px-3 py-2 text-right font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedItems.map((c) => (
                    <tr
                      key={c.id}
                      className="border-t border-dashboard-border transition-colors hover:bg-dashboard-hover"
                    >
                      <td className="px-3 py-2">
                        <span className="font-medium text-dashboard-text">
                          {c.property_name}
                        </span>
                      </td>

                      <td className="px-3 py-2 text-dashboard-muted">
                        {c.owner_name}
                      </td>

                      <td className="px-3 py-2 text-dashboard-muted">
                        {fmt(c.amount)}
                      </td>

                      <td className="px-3 py-2 text-success">{fmt(c.paid)}</td>

                      <td
                        className={`px-3 py-2 font-medium ${
                          Number(c.remaining) > 0 ? "text-error" : "text-success"
                        }`}
                      >
                        {fmt(c.remaining)}
                      </td>

                      <td className="px-3 py-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[c.status]}`}
                        >
                          {STATUS_LABEL[c.status]}
                        </span>
                      </td>

                      <td className="px-3 py-2">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title="Add payment"
                            aria-label="Add payment"
                            onClick={stopPropagation}
                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-dashboard-accent bg-dashboard-surface text-dashboard-accent shadow-sm transition-colors hover:bg-dashboard-accent/25"
                          >
                            <Plus size={12} aria-hidden />
                          </button>

                          <button
                            type="button"
                            title="View charge"
                            aria-label="View charge"
                            onClick={stopPropagation}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-success bg-success/10 text-success transition-colors hover:bg-success/20"
                          >
                            <Eye size={12} aria-hidden />
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
    </CollapsibleTable>
  );
}


// ---------------------------------------------------------------------------
// ServiceChargesManager — data fetching, grouping, outer section layout
// ---------------------------------------------------------------------------

export default function ServiceChargesManager() {
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);
  // LEARN: same viewMode pattern as BlocksManager — "auto" is the default responsive behaviour.
  const [viewMode, setViewMode] = useState<TableViewMode>("auto");

  const {
    data: charges,
    loading,
  } = useServiceCharges(selectedPeriod);

  // This manager currently doesn't render a period selector UI; we still keep the state here
  // so adding a selector later doesn't require moving fetch logic back into the component.
  void setSelectedPeriod;

  // Group strictly by company_name — each key produces one ChargesBlock section.
  // LEARN: useMemo reruns only when `charges` changes — avoids re-grouping on unrelated renders.
  const grouped = useMemo(() => {
    return charges.reduce(
      (acc, charge) => {
        const key = charge.company_name;
        if (!acc[key]) acc[key] = [];
        acc[key].push(charge);
        return acc;
      },
      {} as Record<string, ServiceCharge[]>,
    );
  }, [charges]);

  if (loading) {
    return (
      <p className="text-sm text-dashboard-muted">Loading billing data...</p>
    );
  }

  return (
    // Outer section — identical wrapper to BlocksManager.
    <section className="space-y-2 rounded-2xl border border-dashboard-border bg-dashboard-surface p-4 sm:p-6">
      <div className="space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dashboard-text">
              Service Charges
            </h2>
            <p className="text-xs text-dashboard-muted">
              Billing overview for the current period — grouped by company.
            </p>
          </div>
        </div>
      </div>

      {charges.length === 0 ? (
        <div className="rounded-lg border border-dashboard-border bg-dashboard-surface p-4 text-center">
          <p className="text-xs text-dashboard-muted">
            No service charges found for the current period.
          </p>
        </div>
      ) : (
        // Inner grouped view — identical structure to BlocksGroupedView.
        <div className="space-y-2">
          <div className="hidden items-center justify-end md:flex">
            <TableLayoutToggle
              value={viewMode}
              onChange={setViewMode}
              ariaLabelPrefix="Service Charges"
            />
          </div>

          {Object.entries(grouped).map(([companyName, companyCharges]) => (
            <ChargesBlock
              key={companyName}
              title={companyName}
              charges={companyCharges}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </section>
  );
}
