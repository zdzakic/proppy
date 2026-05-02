/**
 * CompanyReportPDFDocument
 *
 * What it does: Renders a global A4 report for all companies under a companyAdmin:
 *   header → grand-total summary cards → one section per company (rows + sub-total) → fixed footer.
 * Why it exists: Admins managing multiple companies need a single exportable overview.
 * What would break if removed: DownloadCompanyReportPDF has nothing to pass to `pdf().toBlob()`.
 */

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

import { fmtInt } from "@/utils/common/formatNumber";

export type CompanyReportRow = {
  company_name: string;
  property_name: string;
  owner_name: string;
  period_name: string;
  amount: number;
  paid: number;
  remaining: number;
  status: "paid" | "partial" | "unpaid";
};

export type CompanyReportPDFProps = {
  generatedOn: string;
  rows: CompanyReportRow[];
};

/* Inlined from ServiceChargePDFDocument — same PDF palette (keep files independent). */
const PDF = {
  pageBg: "#ffffff",
  surface: "#f9fafb",
  text: "#0f172a",
  muted: "#6b7280",
  border: "#e5e7eb",
  success: "#16a34a",
  error: "#dc2626",
  warning: "#d97706",
} as const;

const STATUS_LABEL: Record<CompanyReportRow["status"], string> = {
  paid: "Paid",
  partial: "Partial",
  unpaid: "Unpaid",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 56,
    paddingHorizontal: 40,
    backgroundColor: PDF.pageBg,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: PDF.text,
  },
  /* ── header ─────────────────────────────────────── */
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  /*
   * flex: 1 lets the left side expand to fill available space; flexShrink: 0 on the right
   * prevents it from compressing — together they stop "PROPPY / Property Management" from wrapping.
   */
  headerLeft: {
    fontSize: 11,
    fontWeight: "bold",
    color: PDF.text,
    flex: 1,
    marginRight: 12,
  },
  headerRight: {
    fontSize: 9,
    color: PDF.muted,
    textAlign: "right",
    flexShrink: 0,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: PDF.border,
    marginTop: 8,
    marginBottom: 12,
  },
  /* ── grand-total summary cards ───────────────────── */
  cardsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: PDF.border,
    borderRadius: 4,
    padding: 8,
  },
  cardLabel: {
    fontSize: 7,
    color: PDF.muted,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: PDF.text,
  },
  /* ── per-company section ─────────────────────────── */
  companySectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: PDF.text,
    marginBottom: 6,
    marginTop: 12,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: PDF.border,
  },
  /* ── detail table ────────────────────────────────── */
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: PDF.border,
    paddingBottom: 4,
    marginBottom: 2,
  },
  th: {
    fontSize: 7,
    fontWeight: "bold",
    color: PDF.muted,
  },
  /*
   * 8 columns — total 100%. paddingRight: 6 on each cell gives breathing room.
   * colCompany added between Property and Owner (user request).
   * td uses fontSize 7 so all 8 columns fit on A4 without overflow.
   */
  colProperty: { width: "16%", paddingRight: 6 },
  colCompany:  { width: "14%", paddingRight: 6 },
  colOwner:    { width: "13%", paddingRight: 6 },
  colPeriod:   { width: "13%", paddingRight: 6 },
  colAmount:   { width: "11%", paddingRight: 6, textAlign: "right" },
  colPaid:     { width: "11%", paddingRight: 6, textAlign: "right" },
  colRem:      { width: "12%", paddingRight: 6, textAlign: "right" },
  colStatus:   { width: "10%", paddingRight: 0 },
  td: {
    fontSize: 7,
    color: PDF.text,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
  },
  tableRowAlt: {
    backgroundColor: PDF.surface,
  },
  /* ── sub-total per company ───────────────────────── */
  subTotalsRow: {
    flexDirection: "row",
    marginTop: 2,
    paddingTop: 6,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: PDF.border,
  },
  subTotalsLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: PDF.muted,
  },
  /* ── grand totals ────────────────────────────────── */
  grandTotalsRow: {
    flexDirection: "row",
    marginTop: 14,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: PDF.text,
  },
  grandTotalsLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: PDF.text,
  },
  /* ── empty state ─────────────────────────────────── */
  empty: {
    fontSize: 9,
    color: PDF.muted,
    fontStyle: "italic",
    paddingVertical: 8,
  },
  /* ── footer ──────────────────────────────────────── */
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: PDF.border,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: PDF.muted,
  },
});

function formatTodayDdMmYyyy(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function statusColor(status: CompanyReportRow["status"]): string {
  if (status === "paid") return PDF.success;
  if (status === "partial") return PDF.warning;
  return PDF.error;
}

function pound(value: number | string): string {
  return `£${fmtInt(value)}`;
}

export default function CompanyReportPDFDocument({
  generatedOn,
  rows,
}: CompanyReportPDFProps) {
  const displayDate = generatedOn || formatTodayDdMmYyyy(new Date());

  /* Group rows by company — preserves insertion order from the API. */
  const grouped = rows.reduce(
    (acc, row) => {
      if (!acc[row.company_name]) acc[row.company_name] = [];
      acc[row.company_name].push(row);
      return acc;
    },
    {} as Record<string, CompanyReportRow[]>,
  );

  const grandAmount    = rows.reduce((s, r) => s + r.amount, 0);
  const grandPaid      = rows.reduce((s, r) => s + r.paid, 0);
  const grandRemaining = rows.reduce((s, r) => s + r.remaining, 0);

  /* Collect unique period names — typically one, but handle multiple gracefully. */
  const periodLabel = [...new Set(rows.map((r) => r.period_name))].join(", ") || "—";

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>

        {/* ── Header ─────────────────────────────────────── */}
        <View style={styles.headerRow}>
          <Text style={styles.headerLeft}>PROPPY / Property Management</Text>
          <Text style={styles.headerRight}>
            Full company report · Generated: {displayDate}
          </Text>
        </View>
        <View style={styles.divider} />

        {/* ── Grand-total summary cards ───────────────────── */}
        <View style={styles.cardsRow}>
          <View style={[styles.card, { backgroundColor: PDF.surface }]}>
            <Text style={styles.cardLabel}>Period</Text>
            <Text style={[styles.cardValue, { fontSize: 9 }]}>{periodLabel}</Text>
          </View>
          <View style={[styles.card, { backgroundColor: PDF.surface }]}>
            <Text style={styles.cardLabel}>Total Charged</Text>
            <Text style={styles.cardValue}>{pound(grandAmount)}</Text>
          </View>
          <View style={[styles.card, { backgroundColor: "#f0fdf4" }]}>
            <Text style={styles.cardLabel}>Total Paid</Text>
            <Text style={[styles.cardValue, { color: PDF.success }]}>{pound(grandPaid)}</Text>
          </View>
          <View style={[styles.card, { backgroundColor: grandRemaining > 0 ? "#fef2f2" : "#f0fdf4" }]}>
            <Text style={styles.cardLabel}>Total Remaining</Text>
            <Text style={[styles.cardValue, { color: grandRemaining > 0 ? PDF.error : PDF.success }]}>
              {pound(grandRemaining)}
            </Text>
          </View>
          <View style={[styles.card, { backgroundColor: PDF.surface }]}>
            <Text style={styles.cardLabel}>Companies</Text>
            <Text style={styles.cardValue}>{Object.keys(grouped).length}</Text>
          </View>
        </View>

        {/* ── One section per company ─────────────────────── */}
        {rows.length === 0 ? (
          <Text style={styles.empty}>No service charges found.</Text>
        ) : (
          Object.entries(grouped).map(([companyName, companyRows]) => {
            const subAmount    = companyRows.reduce((s, r) => s + r.amount, 0);
            const subPaid      = companyRows.reduce((s, r) => s + r.paid, 0);
            const subRemaining = companyRows.reduce((s, r) => s + r.remaining, 0);

            return (
              <View key={companyName}>
                <Text style={styles.companySectionTitle}>{companyName}</Text>

                {/* table header */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.colProperty, styles.th]}>Property</Text>
                  <Text style={[styles.colCompany,  styles.th]}>Company</Text>
                  <Text style={[styles.colOwner,    styles.th]}>Owner</Text>
                  <Text style={[styles.colPeriod,   styles.th]}>Period</Text>
                  <Text style={[styles.colAmount,   styles.th]}>Amount</Text>
                  <Text style={[styles.colPaid,     styles.th]}>Paid</Text>
                  <Text style={[styles.colRem,      styles.th]}>Remaining</Text>
                  <Text style={[styles.colStatus,   styles.th]}>Status</Text>
                </View>

                {/* data rows */}
                {companyRows.map((r, index) => (
                  <View
                    key={`${r.property_name}-${r.period_name}-${index}`}
                    style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}
                  >
                    <Text style={[styles.colProperty, styles.td]}>{r.property_name}</Text>
                    <Text style={[styles.colCompany,  styles.td]}>{r.company_name}</Text>
                    <Text style={[styles.colOwner,    styles.td]}>{r.owner_name}</Text>
                    <Text style={[styles.colPeriod,   styles.td]}>{r.period_name}</Text>
                    <Text style={[styles.colAmount,   styles.td]}>{pound(r.amount)}</Text>
                    <Text style={[styles.colPaid,     styles.td]}>{pound(r.paid)}</Text>
                    <Text style={[styles.colRem,      styles.td]}>{pound(r.remaining)}</Text>
                    <Text style={[styles.colStatus, styles.td, { color: statusColor(r.status) }]}>
                      {STATUS_LABEL[r.status]}
                    </Text>
                  </View>
                ))}

                {/* per-company sub-total */}
                <View style={styles.subTotalsRow}>
                  <Text style={[styles.colProperty, styles.subTotalsLabel]}>Subtotal</Text>
                  <Text style={[styles.colCompany, styles.td]} />
                  <Text style={[styles.colOwner,   styles.td]} />
                  <Text style={[styles.colPeriod,  styles.td]} />
                  <Text style={[styles.colAmount,  styles.subTotalsLabel]}>{pound(subAmount)}</Text>
                  <Text style={[styles.colPaid,    styles.subTotalsLabel]}>{pound(subPaid)}</Text>
                  <Text style={[styles.colRem,     styles.subTotalsLabel]}>{pound(subRemaining)}</Text>
                  <Text style={[styles.colStatus,  styles.td]} />
                </View>
              </View>
            );
          })
        )}

        {/* ── Grand totals row ────────────────────────────── */}
        {rows.length > 0 && (
          <View style={styles.grandTotalsRow}>
            <Text style={[styles.colProperty, styles.grandTotalsLabel]}>Grand Total</Text>
            <Text style={[styles.colCompany, styles.td]} />
            <Text style={[styles.colOwner,   styles.td]} />
            <Text style={[styles.colPeriod,  styles.td]} />
            <Text style={[styles.colAmount,  styles.grandTotalsLabel]}>{pound(grandAmount)}</Text>
            <Text style={[styles.colPaid,    styles.grandTotalsLabel]}>{pound(grandPaid)}</Text>
            <Text style={[styles.colRem,     styles.grandTotalsLabel]}>{pound(grandRemaining)}</Text>
            <Text style={[styles.colStatus,  styles.td]} />
          </View>
        )}

        {/* ── Footer ─────────────────────────────────────── */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Proppy · proppy.app</Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>

      </Page>
    </Document>
  );
}
