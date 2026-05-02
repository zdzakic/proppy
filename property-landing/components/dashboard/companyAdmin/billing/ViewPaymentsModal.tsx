"use client";

import { useEffect, useMemo, useState } from "react";

import BaseModal from "@/components/ui/modal/BaseModal";
import DeleteConfirmModal from "@/components/dashboard/shared/common/DeleteConfirmModal";
import EditPaymentModal from "@/components/dashboard/companyAdmin/billing/EditPaymentModal";
import PaymentsTable, {
  type PaymentRow,
} from "@/components/dashboard/companyAdmin/billing/PaymentsTable";
import type { PaymentFormValues } from "@/components/forms/PaymentForm";
import apiClient from "@/utils/api/apiClient";
import { fmtInt } from "@/utils/common/formatNumber";

type PaymentMutations = {
  onUpdatePayment: (
    id: number,
    values: Pick<PaymentFormValues, "amount" | "comment">,
  ) => Promise<PaymentRow | null>;
  onDeletePayment: (id: number) => Promise<boolean>;
  isUpdatingPayment: boolean;
  isDeletingPayment: boolean;
  updatePaymentError: string | null;
  onClearUpdatePaymentError: () => void;
  onPaymentsMutated?: () => void;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  serviceChargeId: number;
  propertyName: string;
  periodName: string;
  totalAmount: number;
} & Partial<PaymentMutations>;

/**
 * ViewPaymentsModal
 *
 * What it does: Lists payments for one service charge, optional edit/delete (nested modals + toasts).
 * Why it exists: Company admins audit and correct line items from the same place as the eye action.
 * What would break if removed: The eye action on service charges would have nowhere to display history.
 */
export default function ViewPaymentsModal({
  isOpen,
  onClose,
  serviceChargeId,
  propertyName,
  periodName,
  totalAmount,
  onUpdatePayment,
  onDeletePayment,
  isUpdatingPayment = false,
  isDeletingPayment = false,
  updatePaymentError = null,
  onClearUpdatePaymentError = () => {},
  onPaymentsMutated,
}: Props) {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentRow | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PaymentRow | null>(null);

  const showActions = Boolean(onUpdatePayment && onDeletePayment);

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
    const sum = payments.reduce((acc, p) => acc + Number(p.amount), 0);
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
    setEditingPayment(null);
    setPendingDelete(null);
    onClearUpdatePaymentError();
    onClose();
  };

  const handleEditStart = (row: PaymentRow) => {
    onClearUpdatePaymentError();
    setEditingPayment(row);
  };

  const handleEditClose = () => {
    setEditingPayment(null);
    onClearUpdatePaymentError();
  };

  const handleEditSubmit = async (values: PaymentFormValues) => {
    if (!editingPayment || !onUpdatePayment) return;
    const updated = await onUpdatePayment(editingPayment.id, {
      amount: values.amount,
      comment: values.comment,
    });
    if (updated) {
      setPayments((prev) => prev.map((row) => (row.id === updated.id ? updated : row)));
      onPaymentsMutated?.();
      handleEditClose();
    }
  };

  const handleDeleteRequest = (row: PaymentRow) => {
    setPendingDelete(row);
  };

  const handleDeleteClose = () => {
    setPendingDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDelete || !onDeletePayment) return;
    const ok = await onDeletePayment(pendingDelete.id);
    if (ok) {
      setPayments((prev) => prev.filter((row) => row.id !== pendingDelete.id));
      onPaymentsMutated?.();
      handleDeleteClose();
    }
  };

  return (
    <>
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
            <PaymentsTable
              key={`${serviceChargeId}-open`}
              payments={payments}
              onEdit={showActions ? handleEditStart : undefined}
              onDelete={showActions ? handleDeleteRequest : undefined}
            />
          )}

          {!isLoading && !error ? (
            <div className="flex flex-col gap-2 border-t border-dashboard-border pt-4 text-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="text-dashboard-text">
                <span className="text-dashboard-muted">Total paid: </span>
                <span className="font-medium text-success">{fmtInt(totalPaid)}</span>
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

      {showActions ? (
        <>
          <EditPaymentModal
            isOpen={editingPayment !== null}
            onClose={handleEditClose}
            payment={editingPayment}
            onSubmit={handleEditSubmit}
            isSubmitting={isUpdatingPayment}
            error={updatePaymentError}
          />

          <DeleteConfirmModal
            isOpen={pendingDelete !== null}
            isSubmitting={isDeletingPayment}
            title="Delete payment"
            description={
              pendingDelete
                ? `Remove this payment of ${fmtInt(pendingDelete.amount)}?`
                : ""
            }
            confirmLabel="Yes, delete"
            onClose={handleDeleteClose}
            onConfirm={() => {
              void handleDeleteConfirm();
            }}
            stackClassName="z-[60]"
          />
        </>
      ) : null}
    </>
  );
}
