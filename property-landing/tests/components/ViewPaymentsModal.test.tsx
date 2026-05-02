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
    patch: vi.fn(),
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

    // Totals: 20 + 5 = 25, remaining 75. (integer formatting)
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("75")).toBeInTheDocument();

    const table = screen.getByRole("table");
    const getAmounts = () => {
      const rows = within(table).getAllByRole("row").slice(1); // skip header row
      return rows.map((row) => within(row).getAllByRole("cell")[1].textContent);
    };

    // Default sort: date_paid asc => 10-04 first, then 11-04.
    expect(getAmounts()).toEqual(["5", "20"]);

    // Sort by amount asc (first click switches key => asc)
    await user.click(within(table).getByRole("button", { name: /amount/i }));
    expect(getAmounts()).toEqual(["5", "20"]);

    // Toggle amount desc
    await user.click(within(table).getByRole("button", { name: /amount/i }));
    expect(getAmounts()).toEqual(["20", "5"]);
  });

  it("edit flow: PATCH handoff — opens nested modal, calls onUpdatePayment, refreshes totals", async () => {
    const user = userEvent.setup();
    const onPaymentsMutated = vi.fn();
    const onUpdatePayment = vi.fn().mockResolvedValue({
      id: 1,
      amount: "15.00",
      date_paid: "2026-04-11",
      comment: "note",
    });
    const onDeletePayment = vi.fn().mockResolvedValue(true);

    mockGet.mockResolvedValueOnce({
      data: [{ id: 1, amount: "20.00", date_paid: "2026-04-11", comment: "note" }],
    });

    render(
      <ViewPaymentsModal
        isOpen
        onClose={vi.fn()}
        serviceChargeId={99}
        propertyName="Flat 1"
        periodName="April 2026"
        totalAmount={100}
        onUpdatePayment={onUpdatePayment}
        onDeletePayment={onDeletePayment}
        onPaymentsMutated={onPaymentsMutated}
      />,
    );

    await screen.findByText("Flat 1 • April 2026");

    await user.click(screen.getByRole("button", { name: "Edit payment" }));

    expect(screen.getByRole("heading", { name: "Update Payment" })).toBeInTheDocument();

    const amountInput = screen.getByRole("spinbutton", { name: /amount/i });
    await user.clear(amountInput);
    await user.type(amountInput, "15");

    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    await vi.waitFor(() => {
      expect(onUpdatePayment).toHaveBeenCalledWith(1, { amount: 15, comment: "note" });
    });

    expect(onPaymentsMutated).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("heading", { name: "Update Payment" })).not.toBeInTheDocument();

    // Amount column + “Total paid” both show 15; remaining 85 is unique.
    expect(screen.getAllByText("15").length).toBe(2);
    expect(screen.getByText("85")).toBeInTheDocument();
  });

  it("delete flow: confirm — calls onDeletePayment, clears row, notifies parent", async () => {
    const user = userEvent.setup();
    const onPaymentsMutated = vi.fn();
    const onUpdatePayment = vi.fn().mockResolvedValue(null);
    const onDeletePayment = vi.fn().mockResolvedValue(true);

    mockGet.mockResolvedValueOnce({
      data: [{ id: 1, amount: "10.00", date_paid: "2026-04-01", comment: "" }],
    });

    render(
      <ViewPaymentsModal
        isOpen
        onClose={vi.fn()}
        serviceChargeId={99}
        propertyName="Flat 1"
        periodName="April 2026"
        totalAmount={100}
        onUpdatePayment={onUpdatePayment}
        onDeletePayment={onDeletePayment}
        onPaymentsMutated={onPaymentsMutated}
      />,
    );

    await screen.findByText("Flat 1 • April 2026");

    await user.click(screen.getByRole("button", { name: "Delete payment" }));

    expect(screen.getByText(/Remove this payment of 10/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Yes, delete" }));

    await vi.waitFor(() => {
      expect(onDeletePayment).toHaveBeenCalledWith(1);
    });

    expect(onPaymentsMutated).toHaveBeenCalledTimes(1);
    expect(screen.getByText("No payments yet")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Delete payment" })).not.toBeInTheDocument();
  });
});

