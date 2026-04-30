/**
 * formatNumber
 *
 * What it does: Central place for number formatting helpers used across the app.
 * Why it exists: Keeps formatting consistent (e.g. billing tables) and avoids duplicated helpers.
 * What would break if removed: Components would drift in formatting rules and tests become flaky.
 */

/**
 * Format a numeric value as a whole number (no decimals).
 *
 * Intended for billing UI where we want integer-only display.
 * Uses the runtime locale for separators.
 */
export function fmtInt(value: number | string | null | undefined): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0";

  const rounded = Math.round(n);
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(
    rounded,
  );
}

