import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import RegisterCompanyForm from "@/components/ui/auth/RegisterCompanyForm";

/**
 * Mock Button (ako koristiš custom Button komponentu)
 * ZAŠTO:
 * - izbjegavamo zavisnost od styling/loading logike
 */
vi.mock("@/components/ui/Button", () => ({
  default: ({ children, loading, ...props }: any) => (
    <button {...props} loading={loading ? "true" : undefined}>{children}</button>
  ),
}));

describe("RegisterCompanyForm", () => {

  it("renders all fields", () => {
    render(<RegisterCompanyForm />);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Company name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm password")).toBeInTheDocument();
  });

  it("submits valid form and logs data", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation();

    render(<RegisterCompanyForm />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@test.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Company name"), {
      target: { value: "TestCo" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Password123!" },
    });

    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register company/i }));

    expect(consoleSpy).toHaveBeenCalledWith({
      email: "test@test.com",
      company_name: "TestCo",
      password: "Password123!",
    });

    consoleSpy.mockRestore();
  });

});