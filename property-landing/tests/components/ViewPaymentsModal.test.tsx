import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ViewPaymentsModal from "@/components/dashboard/companyAdmin/billing/ViewPaymentsModal";
import apiClient from "@/utils/api/apiClient";

vi.mock("@/utils/api/apiClient", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("ViewPaymentsModal", () => {
  const mockGet = vi.mocked(apiClient.get);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches payments on open, renders table with formatted date, totals, and supports sorting", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    mockGet.mockResolvedValueOnce({
      data: [
        { id: 1, amount: "20.00", date_paid: "2026-04-11", comment: "second" },
        { id: 2, amount: "5.00", date_paid: "2026-04-10", comment: "" },
      ],
    });

    render(
      <ViewPaymentsModal
        isOpen
        onClose={handleClose}
        serviceChargeId={99}
        propertyName="Flat 1"
        periodName="April 2026"
        totalAmount={100}
      />,
    );

    // Title comes from BaseModal header ("PropertyName • PeriodName").
    expect(await screen.findByText("Flat 1 • April 2026")).toBeInTheDocument();

    expect(mockGet).toHaveBeenCalledWith("/properties/payments/", {
      params: { service_charge: 99 },
    });

    // Date format should be DD-MM-YYYY.
    expect(await screen.findByText("11-04-2026")).toBeInTheDocument();
    expect(screen.getByText("10-04-2026")).toBeInTheDocument();

    // Totals: 20 + 5 = 25, remaining 75.
    expect(screen.getByText("25.00")).toBeInTheDocument();
    expect(screen.getByText("75.00")).toBeInTheDocument();

    const table = screen.getByRole("table");
    const getAmounts = () => {
      const rows = within(table).getAllByRole("row").slice(1); // skip header row
      return rows.map((row) => within(row).getAllByRole("cell")[1].textContent);
    };

    // Default sort: date_paid asc => 10-04 first, then 11-04.
    expect(getAmounts()).toEqual(["5.00", "20.00"]);

    // Sort by amount asc (first click switches key => asc)
    await user.click(within(table).getByRole("button", { name: /amount/i }));
    expect(getAmounts()).toEqual(["5.00", "20.00"]);

    // Toggle amount desc
    await user.click(within(table).getByRole("button", { name: /amount/i }));
    expect(getAmounts()).toEqual(["20.00", "5.00"]);
  });
});

