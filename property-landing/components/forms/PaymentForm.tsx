"use client";

import { useState } from "react";
import ActionButton from "@/components/ui/ActionButton";
import DatePickerInput from "@/components/ui/DatePickerInput";
import FormError from "@/components/ui/FormError";

export type PaymentFormValues = {
  amount: number;
  date_paid: string;
};

type PaymentFormProps = {
  onSubmit: (values: PaymentFormValues) => void;
  isSubmitting: boolean;
  error?: string | null;
  submitLabel?: string;
  onCancel: () => void;
};

/**
 * UI-only form for creating a Payment.
 * Mirrors BlockForm/CompanyForm structure: no API calls, just calls onSubmit.
 */
export default function PaymentForm({
  onSubmit,
  isSubmitting,
  error,
  submitLabel = "Save",
  onCancel,
}: PaymentFormProps) {
  const [amount, setAmount] = useState("");
  const [datePaid, setDatePaid] = useState("");

  const amountNumber = Number(amount);
  const isAmountValid = amount.trim() !== "" && !Number.isNaN(amountNumber) && amountNumber > 0;
  const isSubmitDisabled = !isAmountValid || !datePaid || isSubmitting;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitDisabled) return;
    onSubmit({ amount: amountNumber, date_paid: datePaid });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-1">
        <label htmlFor="payment-amount-input" className="text-sm text-dashboard-muted">
          Amount
        </label>
        <input
          id="payment-amount-input"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full rounded-md border border-dashboard-border bg-dashboard-surface px-3 py-2 text-sm text-dashboard-text placeholder:text-dashboard-muted focus:outline-none focus:ring-2 focus:ring-dashboard-ring"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="payment-date-input" className="text-sm text-dashboard-muted">
          Date paid
        </label>
        <DatePickerInput
          id="payment-date-input"
          value={datePaid}
          onChange={setDatePaid}
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

