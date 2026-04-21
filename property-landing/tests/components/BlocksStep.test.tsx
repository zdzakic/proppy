import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRouter } from "next/navigation";

import BlocksStep from "@/components/dashboard/onboarding/BlocksStep";
import apiClient from "@/utils/api/apiClient";

const mockPush = vi.fn();
const mockReplace = vi.fn();

// useRouter must return a STABLE object reference so the component's
// useEffect([router]) dependency does not re-fire on every render.
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/utils/api/apiClient", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("BlocksStep — onboarding logic", () => {
  const mockGet = vi.mocked(apiClient.get);
  const mockPost = vi.mocked(apiClient.post);

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useRouter).mockReturnValue(
      ({
        push: mockPush,
        replace: mockReplace,
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
      } as unknown) as ReturnType<typeof useRouter>
    );

    // Default: no blocks yet → onboarding starts; one company → auto-selected
    mockGet.mockImplementation(async (url: string) => {
      if (url === "/properties/blocks/") return { data: [] };
      if (url === "/users/companies/") return { data: [{ id: 1, name: "Test Co" }] };
      return { data: [] };
    });
  });

  it("creates block and advances to Step 2 when Next is clicked", async () => {
    const user = userEvent.setup();

    mockPost.mockResolvedValueOnce({
      data: { id: 42, name: "Tower A", comment: "" },
    });

    render(<BlocksStep />);

    await screen.findByText("Step 1 of 3");

    await user.type(screen.getByPlaceholderText("Block name"), "Tower A");
    await user.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith("/properties/blocks/", {
        name: "Tower A",
        company: 1,
      });
    });

    expect(await screen.findByText("Step 2 of 3")).toBeInTheDocument();
  });

  it("does not call block API again when going Back then Next", async () => {
    const user = userEvent.setup();

    mockPost.mockResolvedValueOnce({
      data: { id: 42, name: "Tower A", comment: "" },
    });

    render(<BlocksStep />);

    await screen.findByText("Step 1 of 3");
    await user.type(screen.getByPlaceholderText("Block name"), "Tower A");
    await user.click(screen.getByRole("button", { name: /next/i }));
    await screen.findByText("Step 2 of 3");

    await user.click(screen.getByRole("button", { name: /back/i }));
    await screen.findByText("Step 1 of 3");

    await user.click(screen.getByRole("button", { name: /next/i }));
    await screen.findByText("Step 2 of 3");

    // Block POST fired exactly once — not duplicated on second Next
    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  it("creates property with the blockId returned from Step 1", async () => {
    const user = userEvent.setup();

    mockPost
      .mockResolvedValueOnce({ data: { id: 42, name: "Tower A", comment: "" } })
      .mockResolvedValueOnce({ data: { id: 7, name: "Apartment 101", comment: "" } });

    render(<BlocksStep />);

    await screen.findByText("Step 1 of 3");
    await user.type(screen.getByPlaceholderText("Block name"), "Tower A");
    await user.click(screen.getByRole("button", { name: /next/i }));
    await screen.findByText("Step 2 of 3");

    await user.type(screen.getByPlaceholderText("Sunset Residency"), "Apartment 101");
    await user.click(screen.getByRole("button", { name: /^next$/i }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(
        "/properties/blocks/42/properties/create/",
        { name: "Apartment 101", comment: "" }
      );
    });

    expect(await screen.findByText("Step 3 of 3")).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("shows inline error and does not advance when block name is empty", async () => {
    const user = userEvent.setup();

    render(<BlocksStep />);

    await screen.findByText("Step 1 of 3");
    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(await screen.findByText("Block name is required")).toBeInTheDocument();
    expect(mockPost).not.toHaveBeenCalled();
    expect(screen.queryByText("Step 2 of 3")).not.toBeInTheDocument();
  });

  it("shows inline error and does not save when property name is empty", async () => {
    const user = userEvent.setup();

    mockPost.mockResolvedValueOnce({
      data: { id: 42, name: "Tower A", comment: "" },
    });

    render(<BlocksStep />);

    await screen.findByText("Step 1 of 3");
    await user.type(screen.getByPlaceholderText("Block name"), "Tower A");
    await user.click(screen.getByRole("button", { name: /next/i }));
    await screen.findByText("Step 2 of 3");

    await user.click(screen.getByRole("button", { name: /^next$/i }));

    expect(await screen.findByText("Property name is required")).toBeInTheDocument();
    // Only the block POST fired — property POST never called
    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("shows inline error and does not save when owner email is empty", async () => {
    const user = userEvent.setup();

    mockPost
      .mockResolvedValueOnce({ data: { id: 42, name: "Tower A", comment: "" } })
      .mockResolvedValueOnce({ data: { id: 7, name: "Apartment 101", comment: "" } });

    render(<BlocksStep />);

    await screen.findByText("Step 1 of 3");
    await user.type(screen.getByPlaceholderText("Block name"), "Tower A");
    await user.click(screen.getByRole("button", { name: /next/i }));
    await screen.findByText("Step 2 of 3");

    await user.type(screen.getByPlaceholderText("Sunset Residency"), "Apartment 101");
    await user.click(screen.getByRole("button", { name: /^next$/i }));
    await screen.findByText("Step 3 of 3");

    await user.type(screen.getByPlaceholderText("Ana"), "Ana");
    await user.type(screen.getByPlaceholderText("Owner"), "Owner");
    await user.click(screen.getByRole("button", { name: /finish setup/i }));

    expect(await screen.findByText("Email is required.")).toBeInTheDocument();
    // Only block + property POST fired — owner POST never called
    expect(mockPost).toHaveBeenCalledTimes(2);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("shows inline error and does not save when owner name is empty", async () => {
    const user = userEvent.setup();

    mockPost
      .mockResolvedValueOnce({ data: { id: 42, name: "Tower A", comment: "" } })
      .mockResolvedValueOnce({ data: { id: 7, name: "Apartment 101", comment: "" } });

    render(<BlocksStep />);

    await screen.findByText("Step 1 of 3");
    await user.type(screen.getByPlaceholderText("Block name"), "Tower A");
    await user.click(screen.getByRole("button", { name: /next/i }));
    await screen.findByText("Step 2 of 3");

    await user.type(screen.getByPlaceholderText("Sunset Residency"), "Apartment 101");
    await user.click(screen.getByRole("button", { name: /^next$/i }));
    await screen.findByText("Step 3 of 3");

    await user.type(screen.getByPlaceholderText("owner@example.com"), "owner@example.com");
    await user.click(screen.getByRole("button", { name: /finish setup/i }));

    expect(await screen.findByText("First name is required.")).toBeInTheDocument();
    expect(await screen.findByText("Last name is required.")).toBeInTheDocument();
    // Only block + property POST fired — owner POST never called
    expect(mockPost).toHaveBeenCalledTimes(2);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("keeps Step 3 form values when going back to Step 2", async () => {
    const user = userEvent.setup();

    mockPost
      .mockResolvedValueOnce({ data: { id: 42, name: "Tower A", comment: "" } })
      .mockResolvedValueOnce({ data: { id: 7, name: "Apartment 101", comment: "" } });

    render(<BlocksStep />);

    await screen.findByText("Step 1 of 3");
    await user.type(screen.getByPlaceholderText("Block name"), "Tower A");
    await user.click(screen.getByRole("button", { name: /next/i }));
    await screen.findByText("Step 2 of 3");

    await user.type(screen.getByPlaceholderText("Sunset Residency"), "Apartment 101");
    await user.click(screen.getByRole("button", { name: /^next$/i }));
    await screen.findByText("Step 3 of 3");

    await user.type(screen.getByPlaceholderText("Ana"), "Ana");
    await user.type(screen.getByPlaceholderText("Owner"), "Owner");
    await user.type(
      screen.getByPlaceholderText("owner@example.com"),
      "owner@example.com"
    );
    await user.type(screen.getByPlaceholderText("+44 64 123 456"), "123");

    await user.click(screen.getByRole("button", { name: /back/i }));
    await screen.findByText("Step 2 of 3");

    // Go forward again (property should not be re-created)
    await user.click(screen.getByRole("button", { name: /^next$/i }));
    await screen.findByText("Step 3 of 3");

    expect(screen.getByPlaceholderText("Ana")).toHaveValue("Ana");
    expect(screen.getByPlaceholderText("Owner")).toHaveValue("Owner");
    expect(screen.getByPlaceholderText("owner@example.com")).toHaveValue(
      "owner@example.com"
    );
    expect(screen.getByPlaceholderText("+44 64 123 456")).toHaveValue("123");
  });
});
