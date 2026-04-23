"use client";

import { useCallback, useEffect, useState } from "react";
import apiClient from "@/utils/api/apiClient";
import type { PropertyWithMeta } from "@/types/property";

/**
 * useOwnersPage
 *
 * What it does: Fetches all properties with ownership + block/company metadata from the API.
 * Why it exists: Keeps data-fetching out of page/component (logic in hooks, not components).
 * What would break if removed: OwnersManager would have no data source.
 */
export function useOwnersPage() {
  const [properties, setProperties] = useState<PropertyWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    try {
      const response = await apiClient.get<PropertyWithMeta[] | { results: PropertyWithMeta[] }>(
        "/properties/properties/all/"
      );
      const data = response.data;
      if (Array.isArray(data)) {
        setProperties(data);
      } else {
        setProperties(data.results ?? []);
      }
      setError(null);
    } catch {
      setError("Failed to load properties.");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      await fetchProperties();
      if (!cancelled) setLoading(false);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [fetchProperties]);

  return { properties, loading, error, refetch: fetchProperties };
}
