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

vi.mock("@/utils/api/apiPublic");

describe("LoginForm", () => {

  it("calls login API when form submitted", async () => {

    const mockPost = vi.mocked(apiPublic.post);

    mockPost.mockResolvedValue({
      data: {
        access: "fake-access",
        refresh: "fake-refresh",
        user: { id: 1 }
      }
    });

    render(<LoginForm />);

    const email = screen.getByPlaceholderText("Email");
    const password = screen.getByPlaceholderText("Password");
    const button = screen.getByRole("button", { name: /sign in/i });

    await userEvent.type(email, "test@test.com");
    await userEvent.type(password, "123456");

    await userEvent.click(button);

    expect(mockPost).toHaveBeenCalled();

  });

});