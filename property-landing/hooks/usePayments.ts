"use client";

import { useState } from "react";
import { toast } from "sonner";

import type { PaymentRow } from "@/components/dashboard/companyAdmin/billing/PaymentsTable";
import apiClient from "@/utils/api/apiClient";
import type { PaymentTransactionType } from "@/constants/paymentTypes";

type CreatePaymentPayload = {
  service_charge: number;
  amount: number;
  date_paid: string;
  comment?: string;
  transaction_type: PaymentTransactionType;
};

type CreatePaymentOptions = {
  successMessage?: string;
};

type UpdatePaymentPayload = {
  amount: number;
  comment?: string;
  transaction_type: PaymentTransactionType;
};

function paymentApiErrorMessage(error: unknown, fallback: string): string {
  const maybeError = error as {
    response?: {
      data?: {
        detail?: string;
        message?: string;
        amount?: string[] | string;
        comment?: string[] | string;
        non_field_errors?: string[] | string;
      };
    };
  };

  const apiData = maybeError.response?.data;
  const amountMsg = Array.isArray(apiData?.amount) ? apiData?.amount?.[0] : apiData?.amount;
  const commentMsg = Array.isArray(apiData?.comment) ? apiData?.comment?.[0] : apiData?.comment;

  return (
    apiData?.detail ||
    apiData?.message ||
    amountMsg ||
    commentMsg ||
    (Array.isArray(apiData?.non_field_errors)
      ? apiData?.non_field_errors?.[0]
      : apiData?.non_field_errors) ||
    fallback
  );
}

/**
 * usePayments
 *
 * What it does: Payment API wrapper for create / patch / delete on `/properties/payments/`.
 * Why it exists: Mirrors Blocks pattern — modals stay thin; hook owns API + toasts.
 * What would break if removed: Billing UI could not record or adjust payments.
 */
export function usePayments() {
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const createPayment = async (
    payload: CreatePaymentPayload,
    options?: CreatePaymentOptions,
  ): Promise<boolean> => {
    setIsCreating(true);
    setCreateError(null);

    try {
      await apiClient.post("/properties/payments/", payload);
      toast.success(options?.successMessage ?? "Payment created successfully.");
      return true;
    } catch (error: unknown) {
      const message = paymentApiErrorMessage(error, "Failed to create payment.");
      setCreateError(message);
      toast.error(message);
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * PATCH /payments/:id/ — returns normalized row for local table state.
   */
  const updatePayment = async (
    id: number,
    payload: UpdatePaymentPayload,
  ): Promise<PaymentRow | null> => {
    setIsUpdating(true);
    setUpdateError(null);

    try {
      const res = await apiClient.patch<PaymentRow>(`/properties/payments/${id}/`, {
        amount: payload.amount,
        comment: payload.comment ?? "",
        transaction_type: payload.transaction_type,
      });
      toast.success("Payment updated successfully.");
      return res.data;
    } catch (error: unknown) {
      const message = paymentApiErrorMessage(error, "Failed to update payment.");
      setUpdateError(message);
      toast.error(message);
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * DELETE /payments/:id/ — caller removes the row from UI when this returns true.
   */
  const deletePayment = async (id: number): Promise<boolean> => {
    setIsDeleting(true);

    try {
      await apiClient.delete(`/properties/payments/${id}/`);
      toast.success("Payment deleted successfully.");
      return true;
    } catch (error: unknown) {
      const message = paymentApiErrorMessage(error, "Failed to delete payment.");
      toast.error(message);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const clearUpdateError = () => setUpdateError(null);

  return {
    isCreating,
    createError,
    createPayment,
    isUpdating,
    updateError,
    updatePayment,
    clearUpdateError,
    isDeleting,
    deletePayment,
  };
}

