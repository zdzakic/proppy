import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";

import DownloadCompanyReportPDF from "../../components/dashboard/companyAdmin/billing/DownloadCompanyReportPDF";

vi.mock("sonner", () => ({
  toast: {
    warning: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@react-pdf/renderer", () => ({
  __esModule: true,
  Document: ({ children }: { children?: React.ReactNode }) => React.createElement("div", null, children),
  Page: ({ children }: { children?: React.ReactNode }) => React.createElement("div", null, children),
  Text: ({ children }: { children?: React.ReactNode }) => React.createElement("span", null, children),
  View: ({ children }: { children?: React.ReactNode }) => React.createElement("div", null, children),
  StyleSheet: { create: (s: unknown) => s },
  pdf: vi.fn(() => ({ toBlob: vi.fn().mockResolvedValue(new Blob()) })),
}));

vi.mock("../../components/dashboard/companyAdmin/billing/CompanyReportPDFDocument", () => ({
  __esModule: true,
  default: () => React.createElement("div"),
}));

const charge = {
  id: 1,
  company_id: 10,
  company_name: "DEMO Ltd",
  block_name: "Block A",
  property_name: "Flat 1",
  owner_name: "Z DZ",
  period_name: "June 2026",
  amount: 3000,
  paid: 3000,
  remaining: 0,
  status: "paid" as const,
  last_payment_date: null,
  notice_sent_at: null,
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(global.URL, "createObjectURL").mockReturnValue("blob:mock");
  vi.spyOn(window, "open").mockImplementation(() => null);
});

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

test("renders the Download Report button", () => {
  render(<DownloadCompanyReportPDF charges={[charge]} selectedPeriodName="June 2026" />);
  expect(screen.getByRole("button", { name: /download report/i })).toBeInTheDocument();
});

// ---------------------------------------------------------------------------
// Empty charges → toast warning, no PDF
// ---------------------------------------------------------------------------

test("shows toast warning and does not open a tab when charges are empty", async () => {
  const { toast } = await import("sonner");
  render(<DownloadCompanyReportPDF charges={[]} selectedPeriodName="Dec 2026" />);

  fireEvent.click(screen.getByRole("button", { name: /download report/i }));

  await waitFor(() =>
    expect(toast.warning).toHaveBeenCalledWith(
      expect.stringContaining('"Dec 2026"'),
    ),
  );
  expect(window.open).not.toHaveBeenCalled();
});

test("includes 'No service charges found' in the warning message", async () => {
  const { toast } = await import("sonner");
  render(<DownloadCompanyReportPDF charges={[]} selectedPeriodName="Dec 2026" />);

  fireEvent.click(screen.getByRole("button", { name: /download report/i }));

  await waitFor(() =>
    expect(toast.warning).toHaveBeenCalledWith(
      expect.stringMatching(/no service charges found/i),
    ),
  );
});

// ---------------------------------------------------------------------------
// Non-empty charges → PDF generated, new tab opened
// ---------------------------------------------------------------------------

test("opens a new tab when charges are present", async () => {
  render(<DownloadCompanyReportPDF charges={[charge]} selectedPeriodName="June 2026" />);

  fireEvent.click(screen.getByRole("button", { name: /download report/i }));

  await waitFor(() => expect(window.open).toHaveBeenCalledWith("blob:mock", "_blank"));
});

test("does not show a toast warning when charges are present", async () => {
  const { toast } = await import("sonner");
  render(<DownloadCompanyReportPDF charges={[charge]} selectedPeriodName="June 2026" />);

  fireEvent.click(screen.getByRole("button", { name: /download report/i }));

  await waitFor(() => expect(window.open).toHaveBeenCalled());
  expect(toast.warning).not.toHaveBeenCalled();
});
