"use client";

import { useEffect, useState } from "react";

import BaseModal from "@/components/ui/modal/BaseModal";
import PaymentForm, { type PaymentFormValues } from "@/components/forms/PaymentForm";
import type { PaymentRow } from "@/components/dashboard/companyAdmin/billing/PaymentsTable";

type EditPaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentRow | null;
  onSubmit: (values: PaymentFormValues) => void;
  isSubmitting: boolean;
  error?: string | null;
};

/**
 * EditPaymentModal
 *
 * What it does: Nested BaseModal wrapping `PaymentForm` in `mode="edit"` (same split as EditBlockModal + BlockForm).
 * Why it exists: Thin modal shell — form payload typing lives on PaymentForm.
 * What would break if removed: ViewPaymentsModal could not offer inline edits.
 */
export default function EditPaymentModal({
  isOpen,
  onClose,
  payment,
  onSubmit,
  isSubmitting,
  error,
}: EditPaymentModalProps) {
  const [sessionKey, setSessionKey] = useState(0);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSessionError(null);
      setSubmitAttempted(false);
      return;
    }

    setSessionKey((k) => k + 1);
    setSessionError(null);
    setSubmitAttempted(false);
  }, [isOpen, payment?.id]);

  useEffect(() => {
    if (!isOpen) return;
    if (!submitAttempted) return;
    if (!error) return;
    setSessionError(error);
  }, [error, isOpen, submitAttempted]);

  if (!payment) {
    return null;
  }

  const handleSubmit = (values: PaymentFormValues) => {
    setSubmitAttempted(true);
    onSubmit(values);
  };

  const handleClose = () => {
    setSessionError(null);
    setSubmitAttempted(false);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Update Payment"
      maxWidthClassName="max-w-md"
      stackClassName="z-[60]"
    >
      <PaymentForm
        key={sessionKey}
        mode="edit"
        defaultValues={{
          amount: Number(payment.amount),
          date_paid: payment.date_paid,
          comment: payment.comment ?? "",
        }}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={sessionError}
        submitLabel="Save Changes"
        onCancel={handleClose}
      />
    </BaseModal>
  );
}
