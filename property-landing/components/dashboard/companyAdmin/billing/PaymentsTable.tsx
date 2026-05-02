"use client";

import { Pencil, Trash2 } from "lucide-react";

import { useSort } from "@/hooks/useSort";
import { fmtInt } from "@/utils/common/formatNumber";

export type PaymentRow = {
  id: number;
  amount: string | number;
  date_paid: string;
  comment: string;
};

type SortKey = "date_paid" | "amount" | "comment";

function fmtDateDDMMYYYY(value: string) {
  // Expected: "YYYY-MM-DD" from DRF DateField; fall back to original if unexpected.
  const parts = String(value).split("-");
  if (parts.length !== 3) return value;
  const [yyyy, mm, dd] = parts;
  if (!yyyy || !mm || !dd) return value;
  return `${dd}-${mm}-${yyyy}`;
}

/**
 * PaymentsTable
 *
 * What it does: Renders a sortable payments table (date/amount/comment).
 * Why it exists: Keeps modal components small and matches Blocks/Companies table structure.
 * What would break if removed: ViewPaymentsModal would need to re-implement table + sorting logic.
 *
 * Action buttons match BlocksTable icon sizing/tokens (brand-accent pencil, error trash).
 */
export default function PaymentsTable({
  payments,
  onEdit,
  onDelete,
}: {
  payments: PaymentRow[];
  onEdit?: (payment: PaymentRow) => void;
  onDelete?: (payment: PaymentRow) => void;
}) {
  const showActions = Boolean(onEdit && onDelete);

  const stopRowClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const editButtonClassName =
    "inline-flex h-7 w-7 items-center justify-center rounded-md border border-brand-accent bg-brand-accent/10 text-brand-accent transition-colors hover:bg-brand-accent/20";

  const deleteButtonClassName =
    "inline-flex h-7 w-7 items-center justify-center rounded-md border border-error bg-error/10 text-error transition-colors hover:bg-error/20";
  const { sortedItems, handleSort, getSortIndicator } = useSort<
    PaymentRow,
    SortKey
  >(payments, {
    defaultKey: "date_paid",
    getSortValueType: (key) => {
      if (key === "date_paid" || key === "amount") return "number";
      return "string";
    },
    getSortValue: (key, p) => {
      if (key === "date_paid") return new Date(p.date_paid).getTime();
      if (key === "amount") return Number(p.amount);
      if (key === "comment") return p.comment ?? "";
      return "";
    },
  });

  return (
    <div className="overflow-x-auto rounded-lg border border-dashboard-border">
      <table className="w-full text-xs">
        <thead className="bg-dashboard-hover text-left text-dashboard-muted">
          <tr>
            <th className="px-3 py-2 font-medium">
              <button
                type="button"
                onClick={() => handleSort("date_paid")}
                className="inline-flex items-center gap-1 hover:text-dashboard-text"
              >
                <span>Date</span>
                <span className="inline-flex w-4 justify-center text-dashboard-text">
                  {getSortIndicator("date_paid")}
                </span>
              </button>
            </th>
            <th className="px-3 py-2 font-medium">
              <button
                type="button"
                onClick={() => handleSort("amount")}
                className="inline-flex items-center gap-1 hover:text-dashboard-text"
              >
                <span>Amount</span>
                <span className="inline-flex w-4 justify-center text-dashboard-text">
                  {getSortIndicator("amount")}
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
            {showActions ? (
              <th className="px-3 py-2 text-right font-medium">Actions</th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((p) => (
            <tr
              key={p.id}
              className="border-t border-dashboard-border transition-colors hover:bg-dashboard-hover"
            >
              <td className="px-3 py-2 text-dashboard-text">
                {fmtDateDDMMYYYY(p.date_paid)}
              </td>
              <td className="px-3 py-2 text-dashboard-text">
                {fmtInt(p.amount)}
              </td>
              <td className="px-3 py-2 text-dashboard-muted">
                {p.comment?.trim() ? p.comment : "—"}
              </td>
              {showActions ? (
                <td className="px-3 py-2">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={(event) => {
                        stopRowClick(event);
                        onEdit?.(p);
                      }}
                      title="Edit payment"
                      aria-label="Edit payment"
                      className={editButtonClassName}
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        stopRowClick(event);
                        onDelete?.(p);
                      }}
                      title="Delete payment"
                      aria-label="Delete payment"
                      className={deleteButtonClassName}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

