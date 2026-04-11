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

    mockGet.mockResolvedValue({
      data: [
        {
          id: 1,
          name: "Block A",
          comment: "",
          properties: [],
        },
      ],
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
      });
    });

    expect(await screen.findAllByText("New Block")).not.toHaveLength(0);
  });

  it("updates a block name", async () => {
    const user = userEvent.setup();

    mockPut.mockResolvedValueOnce({ data: {} });

    render(<BlocksManager />);

    await screen.findAllByText("Block A");

    await user.click(screen.getAllByLabelText("Edit block")[0]);

    const editInput = screen.getAllByDisplayValue("Block A")[0];
    fireEvent.change(editInput, {
      target: { value: "Block A Updated" },
    });
    await user.click(screen.getAllByRole("button", { name: /save/i })[0]);

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
});
