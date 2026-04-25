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
 * Supports natural sorting (e.g. "Flat 2" < "Flat 11").
 */
export function sortByString<T>(
  rows: T[],
  selector: (row: T) => string | null | undefined,
  direction: SortDirection
): T[] {
  return [...rows].sort((left, right) => {
    const a = String(selector(left) ?? "").trim();
    const b = String(selector(right) ?? "").trim();

    const result = a.localeCompare(b, undefined, {
      numeric: true,       // 🔥 ključna stvar
      sensitivity: "base", // case-insensitive
    });

    return direction === "asc" ? result : -result;
  });
}
