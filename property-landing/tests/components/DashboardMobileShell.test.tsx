import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Header from "@/components/dashboard/layout/Header";
import SideBar from "@/components/dashboard/layout/SideBar";

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: 1, roles: ["COMPANYADMIN"] },
    logout: vi.fn(),
  }),
}));

vi.mock("@/components/theme/ThemeToggle", () => ({
  default: () => <button type="button">Theme</button>,
}));

describe("Dashboard mobile shell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls onMenuClick when hamburger is pressed", async () => {
    const user = userEvent.setup();
    const handleMenuClick = vi.fn();

    render(<Header onMenuClick={handleMenuClick} />);

    await user.click(screen.getByRole("button", { name: /toggle sidebar/i }));

    expect(handleMenuClick).toHaveBeenCalledTimes(1);
  });

  it("closes mobile drawer when backdrop is clicked", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(<SideBar open onClose={handleClose} />);

    await user.click(screen.getByRole("button", { name: /close sidebar/i }));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("closes drawer after tapping a navigation link", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(<SideBar open onClose={handleClose} />);

    const companiesLinks = screen.getAllByRole("link", { name: /companies/i });
    await user.click(companiesLinks[companiesLinks.length - 1]);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});