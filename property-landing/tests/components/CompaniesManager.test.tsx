import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CompaniesManager from "@/components/dashboard/companyAdmin/companies/CompaniesManager";
import apiClient from "@/utils/api/apiClient";

vi.mock("@/utils/api/apiClient", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: {
      id: 1,
      email: "admin@proppy.test",
      roles: ["COMPANYADMIN"],
    },
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe("CompaniesManager", () => {
  const mockGet = vi.mocked(apiClient.get);
  const mockPost = vi.mocked(apiClient.post);
  const mockPut = vi.mocked(apiClient.put);
  const mockDelete = vi.mocked(apiClient.delete);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders companies list from API", async () => {
    mockGet.mockResolvedValueOnce({
      data: [
        { id: 1, name: "Alpha" },
        { id: 2, name: "Beta" },
      ],
    });

    render(<CompaniesManager />);

    expect((await screen.findAllByText("Alpha")).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Beta").length).toBeGreaterThan(0);
  });

  it("supports paginated companies response", async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        count: 1,
        results: [{ id: 10, name: "Paginated Co" }],
      },
    });

    render(<CompaniesManager />);

    expect((await screen.findAllByText("Paginated Co")).length).toBeGreaterThan(0);
  });

  it("creates a company from modal form", async () => {
    const user = userEvent.setup();

    mockGet.mockResolvedValueOnce({ data: [{ id: 1, name: "Alpha" }] });
    mockPost.mockResolvedValueOnce({
      data: {
        company_id: 5,
        company_name: "Gamma",
        message: "Company added successfully",
      },
    });

    render(<CompaniesManager />);

    expect((await screen.findAllByText("Alpha")).length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /add company/i }));
    await user.type(screen.getByPlaceholderText("Company name"), "Gamma");
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith("/properties/companies/create/", {
        email: "admin@proppy.test",
        name: "Gamma",
        address: "",
      });
    });

    expect((await screen.findAllByText("Gamma")).length).toBeGreaterThan(0);
  });

  it("shows edit, delete, and details actions in table", async () => {
    mockGet.mockResolvedValueOnce({
      data: [
        { id: 11, name: "Delta" },
        { id: 12, name: "Echo" },
      ],
    });

    render(<CompaniesManager />);

    await screen.findAllByText("Delta");

    expect(screen.getAllByLabelText("Edit company").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("Delete company").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("View details").length).toBeGreaterThan(0);
  });

  it("updates company name from edit modal", async () => {
    const user = userEvent.setup();

    mockGet.mockResolvedValueOnce({
      data: [{ id: 4, name: "Old Name" }],
    });
    mockPut.mockResolvedValueOnce({
      data: { id: 4, name: "New Name" },
    });

    render(<CompaniesManager />);

    await screen.findAllByText("Old Name");

    await user.click(screen.getAllByLabelText("Edit company")[0]);
    await user.clear(screen.getByLabelText("Company Name"));
    await user.type(screen.getByLabelText("Company Name"), "New Name");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(mockPut).toHaveBeenCalledWith("/users/companies/4/update/", {
        name: "New Name",
        address: "",
      });
    });

    expect((await screen.findAllByText("New Name")).length).toBeGreaterThan(0);
  });

  it("deletes company after confirmation", async () => {
    const user = userEvent.setup();

    mockGet.mockResolvedValueOnce({
      data: [
        { id: 7, name: "Remove Me" },
        { id: 8, name: "Keep Me" },
      ],
    });
    mockDelete.mockResolvedValueOnce({ data: {} });

    render(<CompaniesManager />);

    await screen.findAllByText("Remove Me");

    await user.click(screen.getAllByLabelText("Delete company")[0]);
    await user.click(screen.getByRole("button", { name: /yes, delete company/i }));

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith("/users/companies/7/delete/");
    });

    await waitFor(() => {
      expect(screen.queryByText("Remove Me")).not.toBeInTheDocument();
    });
  });

  it("hides delete action when user has only one company", async () => {
    mockGet.mockResolvedValueOnce({
      data: [{ id: 21, name: "Only Co" }],
    });

    render(<CompaniesManager />);

    await screen.findAllByText("Only Co");

    expect(screen.queryAllByLabelText("Delete company")).toHaveLength(0);
  });

  it("shows empty state when there are no companies", async () => {
    mockGet.mockResolvedValueOnce({ data: [] });

    render(<CompaniesManager />);

    expect(
      await screen.findByText("No companies yet. Add your first company."),
    ).toBeInTheDocument();
  });

  it("shows error state if companies fetch fails", async () => {
    mockGet.mockRejectedValueOnce(new Error("fail"));

    render(<CompaniesManager />);

    expect((await screen.findAllByText("Failed to load companies.")).length).toBe(2);
  });

  it("opens details modal via details button and closes it", async () => {
    const user = userEvent.setup();

    mockGet.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          name: "Details Co",
          address: "123 Main St",
          block_count: 4,
          property_count: 9,
        },
      ],
    });

    render(<CompaniesManager />);

    await screen.findByRole("cell", { name: /details co/i });

    const [detailsButton] = screen.getAllByLabelText("View details");
    await user.click(detailsButton);

    const dialog = screen.getByRole("dialog", { name: /details co/i });
    expect(within(dialog).getByText("Company information")).toBeInTheDocument();
    expect(within(dialog).getByText("123 Main St")).toBeInTheDocument();

    const closeButton = within(dialog).getByText("Close").closest("button");
    await user.click(closeButton!);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("opens details modal when table row is clicked", async () => {
    const user = userEvent.setup();

    mockGet.mockResolvedValueOnce({
      data: [
        {
          id: 2,
          name: "Row Co",
          address: "456 Side Ave",
          block_count: 2,
          property_count: 3,
        },
      ],
    });

    render(<CompaniesManager />);

    const cell = await screen.findByRole("cell", { name: /row co/i });
    const row = cell.closest("tr");
    expect(row).not.toBeNull();

    await user.click(row!);

    const dialog = await screen.findByRole("dialog", { name: /row co/i });
    expect(within(dialog).getByText("456 Side Ave")).toBeInTheDocument();
    expect(within(dialog).getByText("Blocks")).toBeInTheDocument();
  });
});
