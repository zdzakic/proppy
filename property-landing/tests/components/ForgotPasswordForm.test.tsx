import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";

import ForgotPasswordForm from "@/components/ui/auth/ForgotPasswordForm";

/**
 * MOCK NEXT ROUTER
 */
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}));

/**
 * Mock Button
 */
vi.mock("@/components/ui/Button", () => ({
  default: ({ children, loading, ...props }: any) => (
    <button {...props} disabled={loading}>
      {loading ? "Sending..." : children}
    </button>
  ),
}));

describe("ForgotPasswordForm", () => {
  it("renders email input and submit button", () => {
    render(<ForgotPasswordForm />);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
  });

  it("shows validation error for empty email on submit", async () => {
    render(<ForgotPasswordForm />);

    const button = screen.getByRole("button", { name: /send reset link/i });

    await userEvent.click(button);

    expect(screen.getByText("This field is required!")).toBeInTheDocument();
  });

  it("shows validation error for invalid email on submit", async () => {
    render(<ForgotPasswordForm />);

    const email = screen.getByPlaceholderText("Email");
    const button = screen.getByRole("button", { name: /send reset link/i });

    await userEvent.type(email, "invalid-email");
    await userEvent.click(button);

    expect(screen.getByText("Invalid email format!")).toBeInTheDocument();
  });

  it("clears error on email change", async () => {
    render(<ForgotPasswordForm />);

    const email = screen.getByPlaceholderText("Email");
    const button = screen.getByRole("button", { name: /send reset link/i });

    await userEvent.click(button);
    expect(screen.getByText("This field is required!")).toBeInTheDocument();

    await userEvent.type(email, "test@test.com");
    expect(screen.queryByText("This field is required!")).not.toBeInTheDocument();
  });

  it("clears error on email change", async () => {
    render(<ForgotPasswordForm />);

    const email = screen.getByPlaceholderText("Email");
    const button = screen.getByRole("button", { name: /send reset link/i });

    await userEvent.click(button);
    expect(screen.getByText("This field is required!")).toBeInTheDocument();

    await userEvent.type(email, "test@test.com");
    expect(screen.queryByText("This field is required!")).not.toBeInTheDocument();
  });;
});