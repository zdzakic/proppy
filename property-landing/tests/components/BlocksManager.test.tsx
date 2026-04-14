import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import BlocksManager from "@/components/dashboard/companyAdmin/blocks/BlocksManager";
import apiClient from "@/utils/api/apiClient";

vi.mock("@/utils/api/apiClient", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe("BlocksManager", () => {
  const mockGet = vi.mocked(apiClient.get);
  const mockPost = vi.mocked(apiClient.post);
  const mockPut = vi.mocked(apiClient.put);
  const mockDelete = vi.mocked(apiClient.delete);

  beforeEach(() => {
    vi.clearAllMocks();

    mockGet.mockImplementation(async (url: string) => {
      if (url === "/properties/blocks/") {
        return {
          data: [
            {
              id: 1,
              name: "Block A",
              comment: "",
              properties: [],
            },
          ],
        };
      }

      if (url === "/users/companies/") {
        return {
          data: [{ id: 1, name: "Admin Co" }],
        };
      }

      return { data: [] };
    });
  });

  it("creates a block", async () => {
    const user = userEvent.setup();

    mockPost.mockResolvedValueOnce({
      data: { id: 2, name: "New Block", comment: "", properties: [] },
    });

    render(<BlocksManager />);

    await screen.findAllByText("Block A");

    await user.click(screen.getByRole("button", { name: /add block/i }));
    await user.type(screen.getByPlaceholderText("Block name"), "New Block");
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith("/properties/blocks/", {
        name: "New Block",
        company: 1,
      });
    });

    expect(await screen.findAllByText("New Block")).not.toHaveLength(0);
  });

  it("creates a block with selected company when admin manages multiple companies", async () => {
    const user = userEvent.setup();

    mockGet.mockImplementation(async (url: string) => {
      if (url === "/properties/blocks/") {
        return {
          data: [
            {
              id: 1,
              name: "Block A",
              comment: "",
              properties: [],
            },
          ],
        };
      }

      if (url === "/users/companies/") {
        return {
          data: [
            { id: 11, name: "Alpha Co" },
            { id: 12, name: "Beta Co" },
          ],
        };
      }

      return { data: [] };
    });

    mockPost.mockResolvedValueOnce({
      data: { id: 3, name: "Tower B", comment: "", properties: [] },
    });

    render(<BlocksManager />);

    await screen.findAllByText("Block A");

    await user.click(screen.getByRole("button", { name: /add block/i }));
    await user.type(screen.getByPlaceholderText("Block name"), "Tower B");
    await user.selectOptions(screen.getByLabelText("Company"), "12");
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith("/properties/blocks/", {
        name: "Tower B",
        company: 12,
      });
    });

    expect(await screen.findAllByText("Tower B")).not.toHaveLength(0);
  });

  it("updates a block name", async () => {
    const user = userEvent.setup();

    mockPut.mockResolvedValueOnce({ data: {} });

    render(<BlocksManager />);

    await screen.findAllByText("Block A");

    await user.click(screen.getAllByLabelText("Edit block")[0]);

    const editInput = await screen.findByLabelText("Block Name");
    fireEvent.change(editInput, {
      target: { value: "Block A Updated" },
    });
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(mockPut).toHaveBeenCalledWith("/properties/blocks/1/", {
        name: "Block A Updated",
      });
    });

    expect(await screen.findAllByText("Block A Updated")).not.toHaveLength(0);
  });

  it("deletes a block", async () => {
    const user = userEvent.setup();

    mockDelete.mockResolvedValueOnce({ data: {} });

    render(<BlocksManager />);

    await screen.findAllByText("Block A");

    await user.click(screen.getAllByLabelText("Delete block")[0]);
    await user.click(screen.getByRole("button", { name: /yes, delete block/i }));

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith("/properties/blocks/1/");
    });

    await waitFor(() => {
      expect(screen.queryByText("Block A")).not.toBeInTheDocument();
    });
  });

  it("adds a property to a selected block", async () => {
    const user = userEvent.setup();

    mockPost.mockImplementation(async (url: string) => {
      if (url === "/properties/blocks/1/properties/create/") {
        return {
          data: {
            id: 10,
            name: "Apartment 101",
            comment: "Top floor",
            owners: [],
          },
        };
      }

      return { data: {} };
    });

    render(<BlocksManager />);

    await screen.findAllByText("Block A");

    await user.click(screen.getAllByLabelText("Add property")[0]);

    await user.type(screen.getByLabelText("Property Name"), "Apartment 101");
    await user.type(screen.getByLabelText("Comment (Optional)"), "Top floor");
    await user.click(screen.getByRole("button", { name: /save property/i }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(
        "/properties/blocks/1/properties/create/",
        {
          name: "Apartment 101",
          comment: "Top floor",
        }
      );
    });

    expect(await screen.findAllByText("Apartment 101")).not.toHaveLength(0);
  });

  it("switches block list layout between cards and table", async () => {
    const user = userEvent.setup();

    render(<BlocksManager />);

    await screen.findAllByText("Block A");

    await user.click(screen.getByRole("button", { name: /cards layout/i }));

    expect(screen.getByRole("button", { name: /open details for block a/i })).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /table layout/i }));

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /open details for block a/i })).not.toBeInTheDocument();
  });

  it("switches properties layout between cards and table in block details", async () => {
    const user = userEvent.setup();

    mockPost.mockImplementation(async (url: string) => {
      if (url === "/properties/blocks/1/properties/create/") {
        return {
          data: {
            id: 10,
            name: "Apartment 101",
            comment: "Top floor",
            owners: [],
          },
        };
      }

      return { data: {} };
    });

    render(<BlocksManager />);

    await screen.findAllByText("Block A");

    await user.click(screen.getAllByLabelText("Add property")[0]);
    await user.type(screen.getByLabelText("Property Name"), "Apartment 101");
    await user.type(screen.getByLabelText("Comment (Optional)"), "Top floor");
    await user.click(screen.getByRole("button", { name: /save property/i }));

    await screen.findAllByText("Apartment 101");

    await user.click(screen.getByRole("button", { name: /properties cards layout/i }));

    expect(screen.getByRole("button", { name: /view property details/i })).toBeInTheDocument();
    expect(screen.getAllByRole("table")).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: /properties table layout/i }));

    expect(screen.getAllByRole("table")).toHaveLength(2);
  });
});
