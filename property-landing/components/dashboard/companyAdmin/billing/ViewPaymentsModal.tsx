"use client";

import { useEffect, useMemo, useState } from "react";

import BaseModal from "@/components/ui/modal/BaseModal";
import { useSort } from "@/hooks/useSort";
import apiClient from "@/utils/api/apiClient";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  serviceChargeId: number;
  propertyName: string;
  periodName: string;
  totalAmount: number;
};

/** One row from GET /properties/payments/?service_charge= */
type PaymentRow = {
  id: number;
  amount: string | number;
  date_paid: string;
  comment: string;
};

type SortKey = "date_paid" | "amount" | "comment";

function fmtMoney(n: number) {
  return n.toFixed(2);
}

function fmtDateDDMMYYYY(value: string) {
  // Expected: "YYYY-MM-DD" from DRF DateField; fall back to original if unexpected.
  const parts = String(value).split("-");
  if (parts.length !== 3) return value;
  const [yyyy, mm, dd] = parts;
  if (!yyyy || !mm || !dd) return value;
  return `${dd}-${mm}-${yyyy}`;
}

function PaymentsTable({ payments }: { payments: PaymentRow[] }) {
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
                {fmtMoney(Number(p.amount))}
              </td>
              <td className="px-3 py-2 text-dashboard-muted">
                {p.comment?.trim() ? p.comment : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * ViewPaymentsModal
 *
 * What it does: Shows a read-only table of payments for one service charge and a paid/remaining summary.
 * Why it exists: Company admins need to audit line-item payments without leaving the billing screen.
 * What would break if removed: The eye action on service charges would have nowhere to display history.
 */
export default function ViewPaymentsModal({
  isOpen,
  onClose,
  serviceChargeId,
  propertyName,
  periodName,
  totalAmount,
}: Props) {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (serviceChargeId < 1) {
      return;
    }

    let cancelled = false;

    apiClient
      .get<PaymentRow[]>("/properties/payments/", {
        params: { service_charge: serviceChargeId },
      })
      .then((res) => {
        if (!cancelled) {
          setPayments(Array.isArray(res.data) ? res.data : []);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load payments.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setHasFetched(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, serviceChargeId]);

  const { totalPaid, remaining } = useMemo(() => {
    const sum = payments.reduce(
      (acc, p) => acc + Number(p.amount),
      0,
    );
    return {
      totalPaid: sum,
      remaining: totalAmount - sum,
    };
  }, [payments, totalAmount]);

  if (!isOpen) {
    return null;
  }

  const headerTitle = `${propertyName} • ${periodName}`;
  const isLoading = !hasFetched && error === null;

  const handleClose = () => {
    setPayments([]);
    setError(null);
    setHasFetched(false);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={headerTitle}
      maxWidthClassName="max-w-2xl"
    >
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-dashboard-muted">Loading payments...</p>
        ) : error ? (
          <p className="text-sm text-error">{error}</p>
        ) : payments.length === 0 ? (
          <p className="text-sm text-dashboard-muted">No payments yet</p>
        ) : (
          <PaymentsTable key={`${serviceChargeId}-open`} payments={payments} />
        )}

        {!isLoading && !error ? (
          <div className="flex flex-col gap-2 border-t border-dashboard-border pt-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-dashboard-text">
              <span className="text-dashboard-muted">Total paid: </span>
              <span className="font-medium text-success">
                {fmtMoney(totalPaid)}
              </span>
            </p>
            <p className="text-dashboard-text">
              <span className="text-dashboard-muted">Remaining: </span>
              <span
                className={`font-medium ${
                  remaining > 0 ? "text-error" : "text-success"
                }`}
              >
                {fmtMoney(remaining)}
              </span>
            </p>
          </div>
        ) : null}
      </div>
    </BaseModal>
  );
}
