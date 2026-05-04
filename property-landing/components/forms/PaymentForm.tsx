"use client";

import { useState } from "react";
import ActionButton from "@/components/ui/ActionButton";
import DatePickerInput from "@/components/ui/DatePickerInput";
import FormError from "@/components/ui/FormError";
import FormSelect from "@/components/ui/FormSelect";
import {
  PAYMENT_TRANSACTION_TYPES,
  type PaymentTransactionType,
} from "@/constants/paymentTypes";

export type PaymentFormValues = {
  amount: number;
  date_paid: string;
  comment: string;
  transaction_type: PaymentTransactionType;
};

const TRANSACTION_TYPE_OPTIONS = PAYMENT_TRANSACTION_TYPES.map((t) => ({
  value: t,
  label: t,
}));

type PaymentFormProps = {
  /**
   * `create` — amount, date, comment (Add Payment).
   * `edit` — amount + comment only; date is kept in state for a full `PaymentFormValues` payload but not shown.
   */
  mode?: "create" | "edit";
  /** Pre-fill (edit mode or future reuse); omit for empty add form. */
  defaultValues?: Partial<
    Pick<PaymentFormValues, "amount" | "date_paid" | "comment" | "transaction_type">
  >;
  onSubmit: (values: PaymentFormValues) => void;
  isSubmitting: boolean;
  error?: string | null;
  submitLabel?: string;
  onCancel: () => void;
};

function initialAmountString(
  dv: Partial<Pick<PaymentFormValues, "amount">> | undefined,
): string {
  if (dv?.amount == null || Number.isNaN(Number(dv.amount))) return "";
  return String(Math.round(Number(dv.amount)));
}

/**
 * UI-only form for creating or editing a payment.
 * Shared by AddPaymentModal (create) and EditPaymentModal (edit) — same pattern as BlockForm.
 */
export default function PaymentForm({
  mode = "create",
  defaultValues,
  onSubmit,
  isSubmitting,
  error,
  submitLabel = "Save",
  onCancel,
}: PaymentFormProps) {
  const isEdit = mode === "edit";

  const [amount, setAmount] = useState(() => initialAmountString(defaultValues));
  const [datePaid, setDatePaid] = useState(defaultValues?.date_paid ?? "");
  const [comment, setComment] = useState(defaultValues?.comment ?? "");
  const [transactionType, setTransactionType] = useState<PaymentTransactionType>(
    defaultValues?.transaction_type ?? PAYMENT_TRANSACTION_TYPES[0],
  );

  const amountNumber = Number(amount);
  const isAmountValid =
    amount.trim() !== "" && !Number.isNaN(amountNumber) && amountNumber > 0;
  const isSubmitDisabled = isEdit
    ? !isAmountValid || isSubmitting
    : !isAmountValid || !datePaid || isSubmitting;

  const amountInputId = isEdit ? "payment-edit-amount-input" : "payment-amount-input";
  const dateInputId = "payment-date-input";
  const commentId = isEdit ? "payment-edit-comment" : "payment-comment";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitDisabled) return;
    onSubmit({
      amount: Math.round(amountNumber),
      date_paid: datePaid,
      comment: comment.trim(),
      transaction_type: transactionType,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-1">
        <label htmlFor={amountInputId} className="text-sm text-dashboard-muted">
          Amount
        </label>
        <input
          id={amountInputId}
          type="number"
          inputMode="numeric"
          step="1"
          min="0"
          value={amount}
          onChange={(e) => {
            // Integer-only billing rule: keep digits only.
            const digitsOnly = e.target.value.replace(/[^\d]/g, "");
            setAmount(digitsOnly);
          }}
          placeholder="0"
          className="w-full rounded-md border border-dashboard-border bg-dashboard-surface px-3 py-2 text-sm text-dashboard-text placeholder:text-dashboard-muted focus:outline-none focus:ring-2 focus:ring-dashboard-ring"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="payment-transaction-type" className="text-sm text-dashboard-muted">
          Payment Type
        </label>
        <FormSelect
          id="payment-transaction-type"
          value={transactionType}
          onChange={(v) => setTransactionType(v as PaymentTransactionType)}
          options={TRANSACTION_TYPE_OPTIONS}
          className="w-full"
        />
      </div>

      {!isEdit ? (
        <div className="space-y-1">
          <label htmlFor={dateInputId} className="text-sm text-dashboard-muted">
            Date paid
          </label>
          <DatePickerInput
            id={dateInputId}
            value={datePaid}
            onChange={setDatePaid}
          />
        </div>
      ) : null}

      <div className="space-y-1">
        <label htmlFor={commentId} className="text-sm text-dashboard-muted">
          Comment (Optional)
        </label>
        <textarea
          id={commentId}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Optional note about this payment"
          rows={4}
          className="w-full resize-y rounded-md border border-dashboard-border bg-dashboard-surface px-3 py-2 text-sm text-dashboard-text placeholder:text-dashboard-muted focus:outline-none focus:ring-2 focus:ring-dashboard-ring"
        />
      </div>

      <FormError message={error ?? undefined} />

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <ActionButton
          type="button"
          onClick={onCancel}
          variant="neutral"
          fullWidth
          className="sm:w-auto"
          disabled={isSubmitting}
        >
          Cancel
        </ActionButton>

        <ActionButton
          type="submit"
          variant="primary"
          fullWidth
          className="sm:w-auto disabled:cursor-not-allowed disabled:opacity-60 dark:border-brand-accent dark:bg-brand-accent dark:text-dashboard-sidebar dark:hover:opacity-95"
          disabled={isSubmitDisabled}
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </ActionButton>
      </div>
    </form>
  );
}

