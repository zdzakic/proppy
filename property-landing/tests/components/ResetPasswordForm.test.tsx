import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";

import ResetPasswordForm from "@/components/ui/auth/ResetPasswordForm";
import apiPublic from "@/utils/api/apiPublic";

/**
 * MOCK NEXT ROUTER
 */
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  useParams: () => ({
    uid: "test-uid-123",
    token: "test-token-456",
  }),
}));

/**
 * Mock Button
 */
vi.mock("@/components/ui/Button", () => ({
  default: ({ children, loading, ...props }: any) => (
    <button {...props} loading={loading ? "true" : undefined}>
      {loading ? "Saving..." : children}
    </button>
  ),
}));

vi.mock("@/utils/api/apiPublic");

describe("ResetPasswordForm", () => {

  it("renders both password fields", () => {
    render(<ResetPasswordForm />);

    expect(screen.getByPlaceholderText("New password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm password")).toBeInTheDocument();
  });

  it("shows error when passwords do not match", async () => {
    render(<ResetPasswordForm />);

    const passwordInput = screen.getByPlaceholderText("New password");
    const confirmInput = screen.getByPlaceholderText("Confirm password");
    const button = screen.getByRole("button", { name: /update new password/i });

    await userEvent.type(passwordInput, "Password123!");
    await userEvent.type(confirmInput, "Password456!");

    await userEvent.click(button);

    expect(screen.getByText("Password confirmation does not match!")).toBeInTheDocument();
  });

  it("calls API when form is submitted with valid data", async () => {
    const mockPost = vi.mocked(apiPublic.post);

    mockPost.mockResolvedValue({
      data: { success: true }
    });

    render(<ResetPasswordForm />);

    const passwordInput = screen.getByPlaceholderText("New password");
    const confirmInput = screen.getByPlaceholderText("Confirm password");
    const button = screen.getByRole("button", { name: /update new password/i });

    await userEvent.type(passwordInput, "Password123!");
    await userEvent.type(confirmInput, "Password123!");

    await userEvent.click(button);

    expect(mockPost).toHaveBeenCalledWith(
      "/users/password-reset-confirm/",
      {
        uid: "test-uid-123",
        token: "test-token-456",
        new_password: "Password123!",
      }
    );
  });

  it("shows success message after valid submission", async () => {
    const mockPost = vi.mocked(apiPublic.post);

    mockPost.mockResolvedValue({
      data: { success: true }
    });

    render(<ResetPasswordForm />);

    const passwordInput = screen.getByPlaceholderText("New password");
    const confirmInput = screen.getByPlaceholderText("Confirm password");
    const button = screen.getByRole("button", { name: /update new password/i });

    await userEvent.type(passwordInput, "Password123!");
    await userEvent.type(confirmInput, "Password123!");

    await userEvent.click(button);

    // Wait for async operation
    await vi.waitFor(() => {
      expect(screen.getByText("Your password has been successfully updated.")).toBeInTheDocument();
    });
  });

  it("shows error message when API call fails", async () => {
    const mockPost = vi.mocked(apiPublic.post);

    mockPost.mockRejectedValue({
      response: {
        data: { detail: "Invalid or expired reset link" }
      }
    });

    render(<ResetPasswordForm />);

    const passwordInput = screen.getByPlaceholderText("New password");
    const confirmInput = screen.getByPlaceholderText("Confirm password");
    const button = screen.getByRole("button", { name: /update new password/i });

    await userEvent.type(passwordInput, "Password123!");
    await userEvent.type(confirmInput, "Password123!");

    await userEvent.click(button);

    // Wait for async operation
    await vi.waitFor(() => {
      expect(screen.getByText("Invalid or expired reset link")).toBeInTheDocument();
    });
  });

});