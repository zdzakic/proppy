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
// Accepts an array of period IDs so the FE can filter across multiple companies'
// ServicePeriod rows that share the same display name. Passed as a single
// comma-separated ?period param that the backend splits on its side.
export function useServiceCharges(periodIds: number[] | null) {
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
          periodIds?.length ? { params: { period: periodIds.join(",") } } : undefined,
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
    // Stringify so useCallback detects array reference changes correctly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [periodIds?.join(",") ?? null],
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

