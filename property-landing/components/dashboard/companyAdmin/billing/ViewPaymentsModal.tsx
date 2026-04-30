"use client";

import { useEffect, useMemo, useState } from "react";

import BaseModal from "@/components/ui/modal/BaseModal";
import PaymentsTable, {
  type PaymentRow,
} from "@/components/dashboard/companyAdmin/billing/PaymentsTable";
import apiClient from "@/utils/api/apiClient";
import { fmtInt } from "@/utils/common/formatNumber";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  serviceChargeId: number;
  propertyName: string;
  periodName: string;
  totalAmount: number;
};

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
                {fmtInt(totalPaid)}
              </span>
            </p>
            <p className="text-dashboard-text">
              <span className="text-dashboard-muted">Remaining: </span>
              <span
                className={`font-medium ${
                  remaining > 0 ? "text-error" : "text-success"
                }`}
              >
                {fmtInt(remaining)}
              </span>
            </p>
          </div>
        ) : null}
      </div>
    </BaseModal>
  );
}
