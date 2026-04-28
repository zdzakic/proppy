"use client";

import { useState } from "react";
import { toast } from "sonner";

import apiClient from "@/utils/api/apiClient";

type CreatePaymentPayload = {
  service_charge: number;
  amount: number;
  date_paid: string;
};

type CreatePaymentOptions = {
  successMessage?: string;
};

/**
 * usePayments
 *
 * What it does: Minimal Payment API wrapper for create flow (POST /payments/).
 * Why it exists: Mirrors Blocks pattern — component opens modal; hook owns API + state + toasts.
 * What would break if removed: UI could not create payments.
 */
export function usePayments() {
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

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
      const maybeError = error as {
        response?: {
          data?: {
            detail?: string;
            message?: string;
            amount?: string[] | string;
            non_field_errors?: string[] | string;
          };
        };
      };

      const apiData = maybeError.response?.data;
      const message =
        apiData?.detail ||
        apiData?.message ||
        (Array.isArray(apiData?.amount) ? apiData?.amount?.[0] : apiData?.amount) ||
        (Array.isArray(apiData?.non_field_errors)
          ? apiData?.non_field_errors?.[0]
          : apiData?.non_field_errors) ||
        "Failed to create payment.";

      setCreateError(message);
      toast.error(message);
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    isCreating,
    createError,
    createPayment,
  };
}

