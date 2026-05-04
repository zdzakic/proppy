/**
 * ServiceChargePDFDocument
 *
 * What it does: Renders an A4 service charge report as a @react-pdf/renderer Document (header, meta,
 *   summary cards, payment history table, fixed footer with page numbers).
 * Why it exists: Billing admins need a shareable, printable record that matches on-screen figures without
 *   relying on browser print CSS.
 * Why this approach was chosen: A dedicated PDF Document keeps layout deterministic (react-pdf does not use
 *   Tailwind/CSS variables); props-only input keeps it testable and easy to feed from `pdf().toBlob()`.
 */

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

import { fmtInt } from "@/utils/common/formatNumber";
import type { PDFPaymentRow } from "@/types/payment";
import type { ServiceChargeStatus } from "@/types/serviceCharge";

export type { PDFPaymentRow };

/** Props for one service charge PDF export (amounts are the same units as the billing screen). */
export type ServiceChargePDFProps = {
  propertyName: string;
  periodName: string;
  companyName: string;
  ownerName: string;
  amount: number;
  paid: number;
  remaining: number;
  status: ServiceChargeStatus;
  payments: PDFPaymentRow[];
};

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

const STATUS_LABEL: Record<ServiceChargeStatus, string> = {
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    fontSize: 11,
    fontWeight: "bold",
    color: PDF.text,
    maxWidth: "55%",
  },
  headerRight: {
    fontSize: 9,
    color: PDF.muted,
    textAlign: "right",
    maxWidth: "42%",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: PDF.border,
    marginTop: 8,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: PDF.surface,
    borderWidth: 1,
    borderColor: PDF.border,
    borderRadius: 4,
    padding: 10,
    marginBottom: 12,
    gap: 8,
  },
  metaCell: {
    width: "23%",
    minWidth: 100,
  },
  metaLabel: {
    fontSize: 7,
    color: PDF.muted,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 9,
    color: PDF.text,
  },
  cardsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: PDF.border,
    borderRadius: 4,
    padding: 8,
    minHeight: 52,
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
  cardStatusText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 8,
    color: PDF.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: PDF.border,
    paddingBottom: 4,
    marginBottom: 4,
    paddingHorizontal: 6,
  },
  th: {
    fontSize: 8,
    fontWeight: "bold",
    color: PDF.muted,
  },
  colDate: { width: "28%" },
  colAmount: { width: "22%" },
  colComment: { width: "50%", paddingLeft: 6 },
  textRight: { textAlign: "right" },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  tableRowAlt: {
    backgroundColor: PDF.surface,
  },
  td: {
    fontSize: 9,
    color: PDF.text,
  },
  emptyPayments: {
    fontSize: 9,
    color: PDF.muted,
    fontStyle: "italic",
    paddingVertical: 8,
  },
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

/**
 * formatIsoDateToDdMmYyyy
 *
 * What it does: Turns a `YYYY-MM-DD` API date string into `DD-MM-YYYY` for the PDF table.
 * Why it exists: Matches the human-readable date style used elsewhere in billing (PaymentsTable).
 * Why this approach was chosen: String split avoids timezone shifts that `Date` parsing can introduce.
 */
function formatIsoDateToDdMmYyyy(iso: string): string {
  const parts = String(iso).split("-");
  if (parts.length !== 3) return iso;
  const [yyyy, mm, dd] = parts;
  if (!yyyy || !mm || !dd) return iso;
  return `${dd}-${mm}-${yyyy}`;
}

/**
 * formatTodayDdMmYyyy
 *
 * What it does: Formats “today” in the PDF header as `DD.MM.YYYY`.
 * Why it exists: The header requires a generated-on stamp distinct from payment row formatting.
 * Why this approach was chosen: Local calendar fields are enough; no need for extra libraries in the PDF bundle.
 */
function formatTodayDdMmYyyy(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

/**
 * statusColor
 *
 * What it does: Maps charge status to the PDF palette success/warning/error colors.
 * Why it exists: Keeps status coloring consistent with the product’s semantic status colors.
 * Why this approach was chosen: A small lookup avoids branching sprinkled through the layout.
 */
function statusColor(status: ServiceChargeStatus): string {
  if (status === "paid") return PDF.success;
  if (status === "partial") return PDF.warning;
  return PDF.error;
}

/**
 * pound
 *
 * What it does: Prefixes a formatted integer amount with the £ symbol for the PDF.
 * Why it exists: The billing UI uses integer pounds; the PDF must show the same without calling `toLocaleString` directly.
 * Why this approach was chosen: Reuses `fmtInt` as required and centralizes the £ prefix in one place.
 */
function pound(value: number | string): string {
  return `£${fmtInt(value)}`;
}

/**
 * ServiceChargePDFDocument
 *
 * What it does: Builds the full multi-section PDF for one service charge and its payments.
 * Why it exists: Parent code passes this element to `pdf(...).toBlob()` after fetching payment rows.
 * Why this approach was chosen: A single `Page` with `wrap` plus a `fixed` footer keeps pagination and footers correct for long histories.
 */
export default function ServiceChargePDFDocument({
  propertyName,
  periodName,
  companyName,
  ownerName,
  amount,
  paid,
  remaining,
  status,
  payments,
}: ServiceChargePDFProps) {
  const generatedOn = formatTodayDdMmYyyy(new Date());
  const remainingNum = Number(remaining);
  const remainingBg =
    remainingNum > 0 ? "#fef2f2" : "#f0fdf4";
  const paidBg = "#f0fdf4";
  const statusClr = statusColor(status);

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.headerRow}>
          <Text style={styles.headerLeft}>PROPPY / Property Management</Text>
          <Text style={styles.headerRight}>
            Service Charge Report / Generated: {generatedOn}
          </Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.metaRow}>
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>Company</Text>
            <Text style={styles.metaValue}>{companyName}</Text>
          </View>
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>Property</Text>
            <Text style={styles.metaValue}>{propertyName}</Text>
          </View>
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>Owner</Text>
            <Text style={styles.metaValue}>{ownerName}</Text>
          </View>
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>Period</Text>
            <Text style={styles.metaValue}>{periodName}</Text>
          </View>
        </View>

        <View style={styles.cardsRow}>
          <View style={[styles.card, { backgroundColor: PDF.surface }]}>
            <Text style={styles.cardLabel}>Total Charge</Text>
            <Text style={styles.cardValue}>{pound(amount)}</Text>
          </View>
          <View style={[styles.card, { backgroundColor: paidBg }]}>
            <Text style={styles.cardLabel}>Paid</Text>
            <Text style={[styles.cardValue, { color: PDF.success }]}>{pound(paid)}</Text>
          </View>
          <View style={[styles.card, { backgroundColor: remainingBg }]}>
            <Text style={styles.cardLabel}>Remaining</Text>
            <Text
              style={[
                styles.cardValue,
                { color: remainingNum > 0 ? PDF.error : PDF.success },
              ]}
            >
              {pound(remaining)}
            </Text>
          </View>
          <View style={[styles.card, { backgroundColor: PDF.surface }]}>
            <Text style={styles.cardLabel}>Status</Text>
            <Text style={[styles.cardStatusText, { color: statusClr }]}>
              {STATUS_LABEL[status]}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Payment History</Text>

        <View style={styles.tableHeader}>
          <Text style={[styles.colDate, styles.th]}>Date</Text>
          <Text style={[styles.colAmount, styles.th, styles.textRight]}>Amount</Text>
          <Text style={[styles.colComment, styles.th]}>Comment</Text>
        </View>

        {payments.length === 0 ? (
          <Text style={styles.emptyPayments}>No payments recorded.</Text>
        ) : (
          payments.map((p, index) => (
            <View
              key={p.id}
              style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}
            >
              <Text style={[styles.colDate, styles.td]}>
                {formatIsoDateToDdMmYyyy(p.date_paid)}
              </Text>
              <Text style={[styles.colAmount, styles.td, styles.textRight]}>
                {pound(p.amount)}
              </Text>
              <Text style={[styles.colComment, styles.td]}>
                {p.comment ? p.comment : "—"}
              </Text>
            </View>
          ))
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Proppy · proppy.app</Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
