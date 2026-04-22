import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import OwnersManager from "@/components/dashboard/companyAdmin/owners/OwnersManager";
import apiClient from "@/utils/api/apiClient";

vi.mock("@/utils/api/apiClient", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

/**
 * OwnersManager tests
 *
 * Mirrors CompaniesManager.test.tsx conventions:
 * - mock apiClient, render component, assert directly (no collapsible to expand).
 *
 * Note: jsdom does not apply CSS so both the cards section (md:hidden) and the table
 * section (hidden md:block) render — text appears in both. We use findAllByText /
 * getAllByLabelText and check length > 0.
 */
describe("OwnersManager", () => {
  const mockGet = vi.mocked(apiClient.get);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders properties list", async () => {
    mockGet.mockResolvedValueOnce({
      data: [
        { id: 1, name: "Apartment 101", owners: [{ id: 1, display_name: "John Doe" }] },
        { id: 2, name: "Apartment 102", owners: [] },
      ],
    });

    render(<OwnersManager />);

    expect((await screen.findAllByText("Apartment 101")).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Apartment 102").length).toBeGreaterThan(0);
  });

  it("shows — when property has no owner", async () => {
    mockGet.mockResolvedValueOnce({
      data: [{ id: 1, name: "Unit C", owners: [] }],
    });

    render(<OwnersManager />);

    await screen.findAllByText("Unit C");
    // "—" appears in both cards and table in jsdom (CSS breakpoints are not applied).
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });

  it("shows owner display_name when owner exists", async () => {
    mockGet.mockResolvedValueOnce({
      data: [{ id: 1, name: "Unit A", owners: [{ id: 10, display_name: "Jane Smith" }] }],
    });

    render(<OwnersManager />);

    expect((await screen.findAllByText("Jane Smith")).length).toBeGreaterThan(0);
  });

  it("falls back to user_email when display_name is absent", async () => {
    mockGet.mockResolvedValueOnce({
      data: [{ id: 1, name: "Unit B", owners: [{ id: 11, user_email: "owner@example.com" }] }],
    });

    render(<OwnersManager />);

    expect((await screen.findAllByText("owner@example.com")).length).toBeGreaterThan(0);
  });

  it("shows Assign Owner button when property has no owner", async () => {
    mockGet.mockResolvedValueOnce({
      data: [{ id: 1, name: "Unit D", owners: [] }],
    });

    render(<OwnersManager />);

    await screen.findAllByText("Unit D");
    expect(screen.getAllByLabelText("Assign owner").length).toBeGreaterThan(0);
  });

  it("shows View, Edit, Delete buttons for all rows", async () => {
    mockGet.mockResolvedValueOnce({
      data: [
        { id: 1, name: "Unit E", owners: [{ id: 20, display_name: "Alice" }] },
        { id: 2, name: "Unit F", owners: [] },
      ],
    });

    render(<OwnersManager />);

    await screen.findAllByText("Unit E");
    expect(screen.getAllByLabelText("View property").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("Edit property").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("Delete property").length).toBeGreaterThan(0);
  });

  it("does NOT show Assign Owner button when owner exists", async () => {
    mockGet.mockResolvedValueOnce({
      data: [{ id: 1, name: "Unit G", owners: [{ id: 30, display_name: "Bob" }] }],
    });

    render(<OwnersManager />);

    await screen.findAllByText("Unit G");
    expect(screen.queryAllByLabelText("Assign owner")).toHaveLength(0);
  });
});
