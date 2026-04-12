import { describe, expect, it } from "vitest";

import { getDashboardSidebarItems } from "@/config/navigation";

describe("dashboard sidebar companies link", () => {
  it("shows Companies directly under Dashboard for COMPANYADMIN", () => {
    const items = getDashboardSidebarItems(["COMPANYADMIN"]);

    expect(items[0]?.label).toBe("Dashboard");
    expect(items[1]?.label).toBe("Companies");
  });

  it("does not show Companies for OWNER", () => {
    const items = getDashboardSidebarItems(["OWNER"]);

    expect(items.some((item) => item.label === "Companies")).toBe(false);
  });

  it("does not show Companies for TENANT", () => {
    const items = getDashboardSidebarItems(["TENANT"]);

    expect(items.some((item) => item.label === "Companies")).toBe(false);
  });
});
