"use client";

import { useCallback, useState } from "react";
import apiClient from "@/utils/api/apiClient";
import type { OwnerFormValues } from "@/components/forms/OwnerForm";

type SaveArgs = {
  mode: "assign" | "edit";
  blockId: number;
  propertyId: number;
  ownerId?: number;
  values: OwnerFormValues;
};

/**
 * usePropertyOwnerSave
 *
 * What it does: Creates a property owner; in edit mode deletes the existing owner first then creates.
 * Why it exists: Encapsulates API + loading/error state so OwnerForm stays UI-only.
 * What would break if removed: Assign/Update owner modal would have no submit implementation.
 */

function parseOwnerApiError(unknownError: unknown): {
  general: string | null;
  emailField: string | null;
} {
  const maybeError = unknownError as {
    response?: {
      status?: number;
      data?: {
        detail?: unknown;
        message?: string;
        email?: string[] | string;
      };
    };
  };

  const emailRaw = maybeError.response?.data?.email;
  const emailField =
    typeof emailRaw === "string"
      ? emailRaw
      : Array.isArray(emailRaw)
        ? emailRaw[0]
        : null;

  const detailRaw = maybeError.response?.data?.detail;
  const detailString =
    typeof detailRaw === "string"
      ? detailRaw
      : Array.isArray(detailRaw)
        ? typeof detailRaw[0] === "string"
          ? detailRaw[0]
          : null
        : null;

  const message = maybeError.response?.data?.message;

  const general =
    detailString ||
    (typeof message === "string" ? message : null) ||
    (maybeError.response?.status === 400
      ? "Please check the form fields and try again."
      : "Something went wrong. Please try again.");

  return {
    general: emailField ? null : general,
    emailField: emailField?.trim() ? emailField : null,
  };
}

export function usePropertyOwnerSave() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailApiError, setEmailApiError] = useState<string | null>(null);

  const clearErrors = useCallback(() => {
    setError(null);
    setEmailApiError(null);
  }, []);

  const save = useCallback(async (args: SaveArgs): Promise<boolean> => {
    const { mode, blockId, propertyId, ownerId, values } = args;

    setIsLoading(true);
    clearErrors();

    const body = {
      email: values.email.trim().toLowerCase(),
      first_name: values.first_name.trim(),
      last_name: values.last_name.trim(),
      display_label: values.display_label ?? "",
      phone: values.phone.trim(),
      address_1: values.address_1.trim(),
      postcode: values.postcode.trim(),
      country: values.country.trim(),
    };

    try {
      if (mode === "edit" && ownerId != null) {
        await apiClient.delete(
          `/properties/blocks/${blockId}/properties/${propertyId}/owners/${ownerId}/delete/`
        );
      }

      await apiClient.post(
        `/properties/blocks/${blockId}/properties/${propertyId}/owners/create/`,
        body
      );

      return true;
    } catch (unknownError: unknown) {
      const { general, emailField } = parseOwnerApiError(unknownError);

      if (emailField) {
        setEmailApiError(emailField);
      }
      if (general) {
        setError(general);
      }
      if (!emailField && !general) {
        setError("Something went wrong. Please try again.");
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  }, [clearErrors]);

  return {
    save,
    isLoading,
    error,
    emailApiError,
    clearErrors,
  };
}
