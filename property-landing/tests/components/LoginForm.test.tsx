import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";

import LoginForm from "@/components/ui/auth/LoginForm";
import apiPublic from "@/utils/api/apiPublic";

/**
 * MOCK NEXT ROUTER
 *
 * Problem koji rješava:
 * Next.js App Router ne postoji u test environmentu
 */
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}));

/**
 * MOCK AUTH CONTEXT
 */
const mockLogin = vi.fn().mockResolvedValue(undefined);
vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

vi.mock("@/utils/api/apiPublic");

describe("LoginForm", () => {

  it("calls login when form submitted with valid data", async () => {

    render(<LoginForm />);

    const email = screen.getByPlaceholderText("Email");
    const password = screen.getByPlaceholderText("Password");
    const button = screen.getByRole("button", { name: /sign in/i });

    await userEvent.type(email, "test@test.com");
    await userEvent.type(password, "123456");

    await userEvent.click(button);

    expect(mockLogin).toHaveBeenCalledWith("test@test.com", "123456");

  });

});