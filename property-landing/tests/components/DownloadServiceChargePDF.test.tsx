import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";

import DownloadServiceChargePDF from "../../components/dashboard/companyAdmin/billing/DownloadServiceChargePDF";
import apiClient from "@/utils/api/apiClient";

vi.mock("@/utils/api/apiClient", () => ({
  __esModule: true,
  default: { get: vi.fn() },
}));

vi.mock("@react-pdf/renderer", () => ({
  __esModule: true,
  // Minimal component exports so ServiceChargePDFDocument can be evaluated if imported.
  Document: ({ children }: { children?: React.ReactNode }) => React.createElement("div", null, children),
  Page: ({ children }: { children?: React.ReactNode }) => React.createElement("div", null, children),
  Text: ({ children }: { children?: React.ReactNode }) => React.createElement("span", null, children),
  View: ({ children }: { children?: React.ReactNode }) => React.createElement("div", null, children),
  StyleSheet: { create: (s: unknown) => s },
  pdf: vi.fn(() => ({ toBlob: vi.fn().mockResolvedValue(new Blob()) })),
}));

vi.mock("../../components/dashboard/companyAdmin/billing/ServiceChargePDFDocument", () => ({
  __esModule: true,
  default: () => React.createElement("div"),
}));

const charge = {
  id: 1,
  property_name: "App 1",
  period_name: "June 2026",
  company_name: "DEMO",
  owner_name: "Z DZ",
  amount: 3000,
  paid: 3000,
  remaining: 0,
  status: "paid" as const,
};

beforeEach(() => {
  (apiClient.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [] });
  vi.spyOn(global.URL, "createObjectURL").mockReturnValue("blob:mock");
  vi.spyOn(window, "open").mockImplementation(() => null);
});

test("renders a button with aria-label", () => {
  render(<DownloadServiceChargePDF charge={charge} />);
  expect(screen.getByLabelText("Download PDF report")).toBeInTheDocument();
});

test("disables button and shows spinner while loading", async () => {
  render(<DownloadServiceChargePDF charge={charge} />);
  fireEvent.click(screen.getByRole("button", { name: "Download PDF report" }));
  expect(screen.getByRole("button", { name: "Download PDF report" })).toBeDisabled();
  expect(document.querySelector(".animate-spin")).toBeTruthy();
});

test("calls apiClient.get with correct params", async () => {
  render(<DownloadServiceChargePDF charge={charge} />);
  fireEvent.click(screen.getByRole("button", { name: "Download PDF report" }));
  await waitFor(() =>
    expect(apiClient.get).toHaveBeenCalledWith("/properties/payments/", { params: { service_charge: 1 } }),
  );
});

test("opens new tab on successful download", async () => {
  render(<DownloadServiceChargePDF charge={charge} />);
  fireEvent.click(screen.getByRole("button", { name: "Download PDF report" }));
  await waitFor(() => expect(window.open).toHaveBeenCalledWith("blob:mock", "_blank"));
});

