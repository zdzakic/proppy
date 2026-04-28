"use client";

import { useCallback, useEffect, useState } from "react";

import apiClient from "@/utils/api/apiClient";
import type { ServiceCharge } from "@/types/serviceCharge";

/**
 * useServiceCharges
 *
 * What it does: Fetches service charges (optionally filtered by ?period) and exposes
 *   loading/error state plus a manual refetch function.
 * Why it exists: Keeps ServiceChargesManager focused on rendering + grouping only.
 * What would break if removed: The Service Charges page would lose its data source.
 */
export function useServiceCharges(periodId: number | null) {
  const [data, setData] = useState<ServiceCharge[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCharges = useCallback(
    async (options?: { showLoader?: boolean }) => {
      const showLoader = options?.showLoader ?? false;

      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError(null);

      try {
        // LEARN: pass query params via axios `params` so URL building stays clean.
        const response = await apiClient.get<ServiceCharge[]>(
          "/properties/service-charges/",
          periodId ? { params: { period: periodId } } : undefined,
        );
        setData(response.data);
      } catch {
        // Keep existing data on background refresh so UI (and collapsible state) stays stable.
        if (showLoader) {
          setData([]);
        }
        setError("Failed to load service charges.");
      } finally {
        if (showLoader) {
          setLoading(false);
        } else {
          setRefreshing(false);
        }
      }
    },
    [periodId],
  );

  useEffect(() => {
    void fetchCharges({ showLoader: true });
  }, [fetchCharges]);

  return {
    data,
    loading,
    refreshing,
    error,
    refetch: () => fetchCharges({ showLoader: false }),
  };
}

