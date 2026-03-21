import { render, screen, fireEvent } from "@testing-library/react";
import RegisterForm from "../RegisterForm";

/**
 * Mock Button (ako koristiš custom Button komponentu)
 * ZAŠTO:
 * - izbjegavamo zavisnost od styling/loading logike
 */
jest.mock("../Button", () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

describe("RegisterForm", () => {

  it("renders all fields", () => {
    render(<RegisterForm />);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Company name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm password")).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", () => {
    render(<RegisterForm />);

    fireEvent.click(screen.getByText("Create account"));

    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Company name is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(screen.getByText("Confirm your password")).toBeInTheDocument();
  });

  it("shows error for invalid email", () => {
    render(<RegisterForm />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "invalid" },
    });

    fireEvent.change(screen.getByPlaceholderText("Company name"), {
      target: { value: "TestCo" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });

    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByText("Create account"));

    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });

  it("shows error if passwords do not match", () => {
    render(<RegisterForm />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@test.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Company name"), {
      target: { value: "TestCo" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });

    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "654321" },
    });

    fireEvent.click(screen.getByText("Create account"));

    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
  });

  it("submits valid form (console.log called)", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    render(<RegisterForm />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@test.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Company name"), {
      target: { value: "TestCo" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });

    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByText("Create account"));

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

});