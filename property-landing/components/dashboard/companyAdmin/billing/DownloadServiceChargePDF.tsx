"use client";

/**
 * Client-only control that loads payments and opens a generated PDF in a new tab via `pdf().toBlob()`.
 */

import type { MouseEvent } from "react";
import { useCallback, useState } from "react";
import { FileDown, Loader2 } from "lucide-react";

import type { PaymentRow } from "@/components/dashboard/companyAdmin/billing/PaymentsTable";
import type { PDFPaymentRow } from "@/components/dashboard/companyAdmin/billing/ServiceChargePDFDocument";
import apiClient from "@/utils/api/apiClient";

type ServiceChargePdfCharge = {
  id: number;
  property_name: string;
  period_name: string;
  company_name: string;
  owner_name: string;
  amount: number;
  paid: number;
  remaining: number;
  status: "paid" | "partial" | "unpaid";
};

type Props = {
  charge: ServiceChargePdfCharge;
};

const BTN_CLASS =
  "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-dashboard-border bg-dashboard-surface text-dashboard-muted shadow-sm transition-colors hover:border-dashboard-accent hover:text-dashboard-accent disabled:opacity-50";

/**
 * mapPaymentsForPdf
 *
 * What it does: Normalizes API rows to `PDFPaymentRow` (e.g. missing `comment`).
 * Why it exists: Keeps the PDF document props stable regardless of serializer quirks.
 * Why this approach was chosen: Small pure helper; avoids casting inside `pdf()`.
 */
function mapPaymentsForPdf(rows: PaymentRow[]): PDFPaymentRow[] {
  return rows.map((p) => ({
    id: p.id,
    amount: p.amount,
    date_paid: p.date_paid,
    comment: p.comment ?? "",
  }));
}

/**
 * DownloadServiceChargePDF
 *
 * What it does: Fetches payments, renders `ServiceChargePDFDocument` to a Blob, opens it in a new tab.
 * Why it exists: `PDFDownloadLink` from react-pdf crashes under Next.js App Router + Turbopack (“su is not a function”).
 * Why this approach was chosen: `pdf().toBlob()` runs fully client-side after dynamic imports; `window.open` avoids navigating the app away from the dashboard.
 */
export default function DownloadServiceChargePDF({ charge }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = useCallback(async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await apiClient.get<PaymentRow[]>("/properties/payments/", {
        params: { service_charge: charge.id },
      });

      const { pdf } = await import("@react-pdf/renderer");
      const { default: ServiceChargePDFDocument } = await import(
        "./ServiceChargePDFDocument"
      );

      const rows = Array.isArray(res.data) ? res.data : [];
      const payments = mapPaymentsForPdf(rows);

      const blob = await pdf(
        <ServiceChargePDFDocument
          propertyName={charge.property_name}
          periodName={charge.period_name}
          companyName={charge.company_name}
          ownerName={charge.owner_name}
          amount={Number(charge.amount)}
          paid={Number(charge.paid)}
          remaining={Number(charge.remaining)}
          status={charge.status}
          payments={payments}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [charge]);

  return (
    <button
      type="button"
      title="Download PDF report"
      aria-label="Download PDF report"
      disabled={loading}
      onClick={handleDownload}
      className={BTN_CLASS}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={12} aria-hidden />
      ) : (
        <FileDown size={12} aria-hidden />
      )}
    </button>
  );
}
