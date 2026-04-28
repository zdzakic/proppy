"use client";

import { useEffect, useState } from "react";

import BaseModal from "@/components/ui/modal/BaseModal";
import PaymentForm, { type PaymentFormValues } from "@/components/forms/PaymentForm";

type AddPaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  serviceChargeId: number | null;
  /** Called with form values when the user submits. API call lives in the hook. */
  onSubmit: (values: PaymentFormValues) => void;
  isSubmitting: boolean;
  error?: string | null;
};

/**
 * Thin wrapper: opens BaseModal with PaymentForm for the "Add Payment" flow.
 * No business logic here — onSubmit wires to the payments hook.
 */
export default function AddPaymentModal({
  isOpen,
  onClose,
  serviceChargeId,
  onSubmit,
  isSubmitting,
  error,
}: AddPaymentModalProps) {
  if (!serviceChargeId) return null;

  const [sessionKey, setSessionKey] = useState(0);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Reset form + error for every open/close session.
  useEffect(() => {
    if (!isOpen) {
      setSessionError(null);
      setSubmitAttempted(false);
      return;
    }

    setSessionKey((prev) => prev + 1);
    setSessionError(null);
    setSubmitAttempted(false);
  }, [isOpen]);

  // Only show API errors when the user attempted submit in this session.
  useEffect(() => {
    if (!isOpen) return;
    if (!submitAttempted) return;
    if (!error) return;
    setSessionError(error);
  }, [error, isOpen, submitAttempted]);

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
    <BaseModal isOpen={isOpen} onClose={handleClose} title="Add Payment" maxWidthClassName="max-w-md">
      <PaymentForm
        key={sessionKey}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={sessionError}
        submitLabel="Save"
        onCancel={handleClose}
      />
    </BaseModal>
  );
}

