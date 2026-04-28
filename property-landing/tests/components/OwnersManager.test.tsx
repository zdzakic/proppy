import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

/**
 * OwnersManager tests
 *
 * Mirrors CompaniesManager.test.tsx conventions:
 * - mock apiClient, render component, expand collapsed company section, then assert.
 *
 * Note: jsdom does not apply CSS so both the cards section (md:hidden) and the table
 * section (hidden md:block) render — text appears in both. We use findAllByText /
 * getAllByLabelText and check length > 0.
 */
describe("OwnersManager", () => {
  const mockGet = vi.mocked(apiClient.get);

  const expandFirstCompanySection = async (user: ReturnType<typeof userEvent.setup>) => {
    // Company groups are rendered in CollapsibleTable and start collapsed by default.
    const [toggle] = await screen.findAllByRole("button", { expanded: false });
    await user.click(toggle);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders properties list", async () => {
    const user = userEvent.setup();
    mockGet.mockResolvedValueOnce({
      data: [
        { id: 1, name: "Apartment 101", owners: [{ id: 1, display_name: "John Doe" }] },
        { id: 2, name: "Apartment 102", owners: [] },
      ],
    });

    render(<OwnersManager />);
    await expandFirstCompanySection(user);

    expect((await screen.findAllByText("Apartment 101")).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Apartment 102").length).toBeGreaterThan(0);
  });

  it("shows — when property has no owner", async () => {
    const user = userEvent.setup();
    mockGet.mockResolvedValueOnce({
      data: [{ id: 1, name: "Unit C", owners: [] }],
    });

    render(<OwnersManager />);
    await expandFirstCompanySection(user);

    await screen.findAllByText("Unit C");
    // "—" appears in both cards and table in jsdom (CSS breakpoints are not applied).
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });

  it("shows owner display_name when owner exists", async () => {
    const user = userEvent.setup();
    mockGet.mockResolvedValueOnce({
      data: [{ id: 1, name: "Unit A", owners: [{ id: 10, display_name: "Jane Smith" }] }],
    });

    render(<OwnersManager />);
    await expandFirstCompanySection(user);

    expect((await screen.findAllByText("Jane Smith")).length).toBeGreaterThan(0);
  });

  it("falls back to user_email when display_name is absent", async () => {
    const user = userEvent.setup();
    mockGet.mockResolvedValueOnce({
      data: [{ id: 1, name: "Unit B", owners: [{ id: 11, user_email: "owner@example.com" }] }],
    });

    render(<OwnersManager />);
    await expandFirstCompanySection(user);

    expect((await screen.findAllByText("owner@example.com")).length).toBeGreaterThan(0);
  });

  it("shows Assign Owner button when property has no owner", async () => {
    const user = userEvent.setup();
    mockGet.mockResolvedValueOnce({
      data: [{ id: 1, name: "Unit D", owners: [] }],
    });

    render(<OwnersManager />);
    await expandFirstCompanySection(user);

    await screen.findAllByText("Unit D");
    expect(screen.getAllByLabelText("Assign owner").length).toBeGreaterThan(0);
  });

  it("shows Edit button for every row (View/Delete are not yet implemented)", async () => {
    const user = userEvent.setup();
    mockGet.mockResolvedValueOnce({
      data: [
        { id: 1, name: "Unit E", owners: [{ id: 20, display_name: "Alice" }] },
        { id: 2, name: "Unit F", owners: [] },
      ],
    });

    render(<OwnersManager />);
    await expandFirstCompanySection(user);

    await screen.findAllByText("Unit E");
    // Cards render "Edit property"; table renders "Edit owner" — both are present in jsdom.
    expect(screen.getAllByLabelText("Edit property").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("Edit owner").length).toBeGreaterThan(0);
  });

  it("does NOT show Assign Owner button when owner exists", async () => {
    const user = userEvent.setup();
    mockGet.mockResolvedValueOnce({
      data: [{ id: 1, name: "Unit G", owners: [{ id: 30, display_name: "Bob" }] }],
    });

    render(<OwnersManager />);
    await expandFirstCompanySection(user);

    await screen.findAllByText("Unit G");
    expect(screen.queryAllByLabelText("Assign owner")).toHaveLength(0);
  });
});

/**
 * Owner modal flow tests
 *
 * Covers: assign owner, edit owner (pre-fill check, API calls), validation, toast.
 * jsdom renders both the cards section and the table section — we target aria-labels
 * from the table ("Edit owner") or cards ("Assign owner") depending on availability.
 */
describe("OwnersManager – owner modal flows", () => {
  const mockGet = vi.mocked(apiClient.get);
  const mockPost = vi.mocked(apiClient.post);
  const mockDelete = vi.mocked(apiClient.delete);

  const expandFirstCompanySection = async (user: ReturnType<typeof userEvent.setup>) => {
    const [toggle] = await screen.findAllByRole("button", { expanded: false });
    await user.click(toggle);
  };

  // Minimal property fixture with a known block_id so resolveBlockId works.
  const propertyNoOwner = { id: 1, name: "Unit A", block_id: 5, owners: [] };

  const existingOwner = {
    id: 10,
    display_name: "Jane Smith",
    user_email: "jane@test.com",
    user_first_name: "Jane",
    user_last_name: "Smith",
    user_phone: "0123",
    user_address_1: "High St",
    user_postcode: "AB1",
    user_country: "UK",
    block_id: 5,
  };

  const propertyWithOwner = { id: 2, name: "Unit B", block_id: 5, owners: [existingOwner] };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("opens Assign Owner modal when button clicked", async () => {
    const user = userEvent.setup();

    mockGet.mockResolvedValueOnce({ data: [propertyNoOwner] });

    render(<OwnersManager />);
    await expandFirstCompanySection(user);

    await screen.findAllByText("Unit A");
    await user.click(screen.getAllByLabelText("Assign owner")[0]);

    expect(await screen.findByRole("dialog", { name: /assign owner/i })).toBeInTheDocument();
  });

  it("assign owner: submits form and calls POST with correct payload", async () => {
    const user = userEvent.setup();

    mockGet.mockResolvedValueOnce({ data: [propertyNoOwner] });
    mockPost.mockResolvedValueOnce({ data: { id: 99, user_email: "new@test.com" } });
    // refetch after successful save
    mockGet.mockResolvedValueOnce({ data: [propertyNoOwner] });

    render(<OwnersManager />);
    await expandFirstCompanySection(user);

    await screen.findAllByText("Unit A");
    await user.click(screen.getAllByLabelText("Assign owner")[0]);

    const dialog = await screen.findByRole("dialog", { name: /assign owner/i });

    await user.type(within(dialog).getByPlaceholderText("Ana"), "John");
    await user.type(within(dialog).getByPlaceholderText("Owner"), "Doe");
    await user.type(within(dialog).getByPlaceholderText("owner@example.com"), "john@test.com");

    await user.click(within(dialog).getByRole("button", { name: /^save$/i }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(
        "/properties/blocks/5/properties/1/owners/create/",
        expect.objectContaining({
          email: "john@test.com",
          first_name: "John",
          last_name: "Doe",
        }),
      );
    });
  });

  it("assign owner: shows success toast and closes modal", async () => {
    const user = userEvent.setup();
    const { toast } = await import("sonner");

    mockGet.mockResolvedValueOnce({ data: [propertyNoOwner] });
    mockPost.mockResolvedValueOnce({ data: { id: 99 } });
    mockGet.mockResolvedValueOnce({ data: [propertyNoOwner] });

    render(<OwnersManager />);
    await expandFirstCompanySection(user);

    await screen.findAllByText("Unit A");
    await user.click(screen.getAllByLabelText("Assign owner")[0]);

    const dialog = await screen.findByRole("dialog", { name: /assign owner/i });

    await user.type(within(dialog).getByPlaceholderText("Ana"), "John");
    await user.type(within(dialog).getByPlaceholderText("Owner"), "Doe");
    await user.type(within(dialog).getByPlaceholderText("owner@example.com"), "john@test.com");

    await user.click(within(dialog).getByRole("button", { name: /^save$/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Owner assigned successfully.");
    });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("edit owner: modal opens pre-filled with current owner data", async () => {
    const user = userEvent.setup();

    mockGet.mockResolvedValueOnce({ data: [propertyWithOwner] });

    render(<OwnersManager />);
    await expandFirstCompanySection(user);

    // jsdom renders the table row button ("Edit owner") and the card button ("Edit property").
    // Both call onEdit — we use the table button.
    await screen.findAllByText("Unit B");
    await user.click(screen.getAllByLabelText("Edit owner")[0]);

    const dialog = await screen.findByRole("dialog", { name: /update owner/i });

    // The form must be pre-filled with the existing owner's profile data.
    await waitFor(() => {
      expect(within(dialog).getByPlaceholderText("Ana")).toHaveValue("Jane");
      expect(within(dialog).getByPlaceholderText("Owner")).toHaveValue("Smith");
      expect(within(dialog).getByPlaceholderText("owner@example.com")).toHaveValue("jane@test.com");
    });
  });

  it("edit owner: submits calling DELETE then POST", async () => {
    const user = userEvent.setup();

    mockGet.mockResolvedValueOnce({ data: [propertyWithOwner] });
    mockDelete.mockResolvedValueOnce({ data: {} });
    mockPost.mockResolvedValueOnce({ data: { id: 11, user_email: "jane@test.com" } });
    mockGet.mockResolvedValueOnce({ data: [propertyWithOwner] });

    render(<OwnersManager />);
    await expandFirstCompanySection(user);

    await screen.findAllByText("Unit B");
    await user.click(screen.getAllByLabelText("Edit owner")[0]);

    const dialog = await screen.findByRole("dialog", { name: /update owner/i });

    // Clear first name and type a new one to verify the updated value is sent.
    const firstNameInput = within(dialog).getByPlaceholderText("Ana");
    await user.clear(firstNameInput);
    await user.type(firstNameInput, "Updated");

    await user.click(within(dialog).getByRole("button", { name: /^save$/i }));

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith(
        "/properties/blocks/5/properties/2/owners/10/delete/",
      );
      expect(mockPost).toHaveBeenCalledWith(
        "/properties/blocks/5/properties/2/owners/create/",
        expect.objectContaining({ first_name: "Updated" }),
      );
    });
  });

  it("edit owner: shows success toast and closes modal", async () => {
    const user = userEvent.setup();
    const { toast } = await import("sonner");

    mockGet.mockResolvedValueOnce({ data: [propertyWithOwner] });
    mockDelete.mockResolvedValueOnce({ data: {} });
    mockPost.mockResolvedValueOnce({ data: { id: 11 } });
    mockGet.mockResolvedValueOnce({ data: [propertyWithOwner] });

    render(<OwnersManager />);
    await expandFirstCompanySection(user);

    await screen.findAllByText("Unit B");
    await user.click(screen.getAllByLabelText("Edit owner")[0]);

    const dialog = await screen.findByRole("dialog", { name: /update owner/i });

    await user.click(within(dialog).getByRole("button", { name: /^save$/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Owner updated successfully.");
    });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("form validation: Save button disabled when required fields are empty", async () => {
    const user = userEvent.setup();

    mockGet.mockResolvedValueOnce({ data: [propertyNoOwner] });

    render(<OwnersManager />);
    await expandFirstCompanySection(user);

    await screen.findAllByText("Unit A");
    await user.click(screen.getAllByLabelText("Assign owner")[0]);

    const dialog = await screen.findByRole("dialog", { name: /assign owner/i });

    // No fields filled — submit must be disabled.
    expect(within(dialog).getByRole("button", { name: /^save$/i })).toBeDisabled();
  });

  it("form validation: Save button disabled when only some required fields filled", async () => {
    const user = userEvent.setup();

    mockGet.mockResolvedValueOnce({ data: [propertyNoOwner] });

    render(<OwnersManager />);
    await expandFirstCompanySection(user);

    await screen.findAllByText("Unit A");
    await user.click(screen.getAllByLabelText("Assign owner")[0]);

    const dialog = await screen.findByRole("dialog", { name: /assign owner/i });

    // Fill only first name and email — last name still empty.
    await user.type(within(dialog).getByPlaceholderText("Ana"), "John");
    await user.type(within(dialog).getByPlaceholderText("owner@example.com"), "john@test.com");

    expect(within(dialog).getByRole("button", { name: /^save$/i })).toBeDisabled();
  });

  it("shows email API error in the form", async () => {
    const user = userEvent.setup();

    mockGet.mockResolvedValueOnce({ data: [propertyNoOwner] });
    mockPost.mockRejectedValueOnce({
      response: { status: 400, data: { email: ["A user with this email already exists."] } },
    });

    render(<OwnersManager />);
    await expandFirstCompanySection(user);

    await screen.findAllByText("Unit A");
    await user.click(screen.getAllByLabelText("Assign owner")[0]);

    const dialog = await screen.findByRole("dialog", { name: /assign owner/i });

    await user.type(within(dialog).getByPlaceholderText("Ana"), "John");
    await user.type(within(dialog).getByPlaceholderText("Owner"), "Doe");
    await user.type(within(dialog).getByPlaceholderText("owner@example.com"), "taken@test.com");

    await user.click(within(dialog).getByRole("button", { name: /^save$/i }));

    await waitFor(() => {
      expect(within(dialog).getByText("A user with this email already exists.")).toBeInTheDocument();
    });
  });
});
