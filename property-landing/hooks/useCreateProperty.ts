"use client";

import { useCallback, useState } from "react";
import apiClient from "@/utils/api/apiClient";
import type {
  CreatePropertyPayload,
  CreatePropertyResponse,
} from "@/types/property";

interface UseCreatePropertyReturn {
  createProperty: (
    blockId: number,
    payload: CreatePropertyPayload
  ) => Promise<CreatePropertyResponse | null>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * useCreateProperty
 *
 * Creates a property for a specific block and exposes loading/error state
 * for form UX (pending, success, failure).
 */
export function useCreateProperty(): UseCreatePropertyReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createProperty = useCallback(
    async (
      blockId: number,
      payload: CreatePropertyPayload
    ): Promise<CreatePropertyResponse | null> => {
      if (!blockId) {
        setError("Block ID is required.");
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.post<CreatePropertyResponse>(
          `/properties/blocks/${blockId}/properties/create/`,
          payload
        );

        return response.data;
      } catch (err: unknown) {
        const maybeError = err as {
          response?: {
            data?: {
              detail?: string;
              message?: string;
            };
          };
        };

        const message =
          maybeError.response?.data?.detail ||
          maybeError.response?.data?.message ||
          "Failed to create property.";

        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    createProperty,
    isLoading,
    error,
    clearError,
  };
}
