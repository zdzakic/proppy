"use client";

/**
 * DownloadCompanyReportPDF
 *
 * What it does: Builds `CompanyReportPDFDocument` from already-fetched, period-filtered charges
 *   and opens the PDF in a new tab. Shows a toast warning when the selected period has no data.
 * Why it exists: Same pdf().toBlob() + window.open pattern as DownloadServiceChargePDF.
 *   Receives data from the parent so no duplicate API call is made.
 * What would break if removed: The billing page loses its period-aware company report export.
 */

import type { MouseEvent } from "react";
import { useCallback, useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

import ActionButton from "@/components/ui/ActionButton";
import type { CompanyReportRow } from "@/components/dashboard/companyAdmin/billing/CompanyReportPDFDocument";
import type { ServiceCharge } from "@/types/serviceCharge";

type Props = {
  charges: ServiceCharge[];
  selectedPeriodName: string | null;
};

function formatTodayDdMmYyyy(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function mapChargesToRows(charges: ServiceCharge[]): CompanyReportRow[] {
  return charges.map((c) => ({
    company_name: c.company_name,
    property_name: c.property_name,
    owner_name: c.owner_name,
    period_name: c.period_name,
    amount: Number(c.amount),
    paid: Number(c.paid),
    remaining: Number(c.remaining),
    status: c.status,
  }));
}

export default function DownloadCompanyReportPDF({ charges, selectedPeriodName }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = useCallback(async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (charges.length === 0) {
      const label = selectedPeriodName ? `"${selectedPeriodName}"` : "the selected period";
      toast.warning(`No service charges found for ${label}. Report cannot be generated yet.`);
      return;
    }

    setLoading(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { default: CompanyReportPDFDocument } = await import(
        "./CompanyReportPDFDocument"
      );

      const blob = await pdf(
        <CompanyReportPDFDocument
          generatedOn={formatTodayDdMmYyyy(new Date())}
          rows={mapChargesToRows(charges)}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [charges, selectedPeriodName]);

  return (
    <ActionButton
      variant="neutral"
      fullWidth
      disabled={loading}
      onClick={handleDownload}
      className="sm:w-auto border-dashboard-ring bg-dashboard-active text-dashboard-text shadow-sm hover:bg-dashboard-hover"
    >
      {loading ? (
        <Loader2 className="animate-spin" size={16} aria-hidden />
      ) : (
        <FileDown size={16} aria-hidden />
      )}
      Download Report
    </ActionButton>
  );
}
