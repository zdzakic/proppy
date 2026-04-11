export type SortDirection = "asc" | "desc";

/**
 * Reusable numeric sorting helper for table rows.
 */
export function sortByNumber<T>(
  rows: T[],
  selector: (row: T) => number,
  direction: SortDirection
): T[] {
  return [...rows].sort((left, right) => {
    const a = selector(left);
    const b = selector(right);
    return direction === "asc" ? a - b : b - a;
  });
}

/**
 * Reusable string sorting helper for table rows.
 */
export function sortByString<T>(
  rows: T[],
  selector: (row: T) => string | null | undefined,
  direction: SortDirection
): T[] {
  return [...rows].sort((left, right) => {
    const a = String(selector(left) ?? "").trim().toLowerCase();
    const b = String(selector(right) ?? "").trim().toLowerCase();

    if (a === b) return 0;
    if (direction === "asc") return a > b ? 1 : -1;
    return a < b ? 1 : -1;
  });
}
