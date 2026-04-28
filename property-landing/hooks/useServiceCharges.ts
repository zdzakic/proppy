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
  const [error, setError] = useState<string | null>(null);

  const fetchCharges = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // LEARN: pass query params via axios `params` so URL building stays clean.
      const response = await apiClient.get<ServiceCharge[]>(
        "/properties/service-charges/",
        periodId ? { params: { period: periodId } } : undefined,
      );
      setData(response.data);
    } catch {
      setData([]);
      setError("Failed to load service charges.");
    } finally {
      setLoading(false);
    }
  }, [periodId]);

  useEffect(() => {
    fetchCharges();
  }, [fetchCharges]);

  return {
    data,
    loading,
    error,
    refetch: fetchCharges,
  };
}

