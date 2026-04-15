"use client";

import { useMemo, useState } from "react";

import {
  sortByNumber,
  sortByString,
  type SortDirection,
} from "@/utils/table/sorting";

type SortValueType = "string" | "number";

type SortConfig<TItem, TKey extends string> = {
  defaultKey: TKey;
  getSortValue: (key: TKey, item: TItem) => string | number;
  getSortValueType: (key: TKey) => SortValueType;
};

export function useSort<TItem, TKey extends string>(
  items: TItem[],
  config: SortConfig<TItem, TKey>
) {
  const [sortKey, setSortKey] = useState<TKey>(config.defaultKey);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedItems = useMemo(() => {
    const valueType = config.getSortValueType(sortKey);

    if (valueType === "number") {
      return sortByNumber(
        items,
        (item) => Number(config.getSortValue(sortKey, item)),
        sortDirection
      );
    }

    return sortByString(
      items,
      (item) => String(config.getSortValue(sortKey, item) ?? ""),
      sortDirection
    );
  }, [config, items, sortDirection, sortKey]);

  const handleSort = (key: TKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection("asc");
  };

  const getSortIndicator = (key: TKey) => {
    if (sortKey !== key) return "";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  return {
    sortKey,
    sortDirection,
    sortedItems,
    handleSort,
    getSortIndicator,
  };
}

