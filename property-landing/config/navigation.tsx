import {
  Building2,
  CircleHelp,
  LayoutDashboard,
  LogOut,
  type LucideIcon,
  Settings,
  User,
  Users,
} from "lucide-react";

import { ROUTES } from "@/config/routes";

export type AppRole = "COMPANYADMIN" | "OWNER" | "TENANT";

export type NavigationLink = {
  label: string;
  href: string;
};

export type DashboardMenuItemConfig = {
  label: string;
  icon: LucideIcon;
  href?: string;
  action?: "logout";
  separatorBefore?: boolean;
};

const ROLE_PRIORITY: AppRole[] = ["COMPANYADMIN", "OWNER", "TENANT"];

export const landingNavigationLinks: NavigationLink[] = [
  { label: "Overview", href: ROUTES.LANDING.OVERVIEW },
  { label: "Challenges", href: ROUTES.LANDING.CHALLENGES },
  { label: "Better Approach", href: ROUTES.LANDING.BETTER_APPROACH },
  { label: "Who We Are", href: ROUTES.LANDING.WHO_WE_ARE },
];

export const landingAccountLinks: NavigationLink[] = [
  { label: "Create Account - Flat Owner", href: ROUTES.AUTH.REGISTER },
  { label: "Create Account - Property Manager", href: ROUTES.AUTH.REGISTER },
  { label: "Login", href: ROUTES.AUTH.LOGIN },
];

export const footerPlatformLinks: NavigationLink[] = [
  { label: "Owner Login", href: ROUTES.AUTH.LOGIN },
  { label: "Register", href: ROUTES.AUTH.REGISTER },
];

export const legalNavigationLinks: NavigationLink[] = [
  { label: "Privacy", href: ROUTES.LEGAL.PRIVACY },
  { label: "Terms", href: ROUTES.LEGAL.TERMS },
];

const dashboardSidebarByRole: Record<AppRole, DashboardMenuItemConfig[]> = {
  COMPANYADMIN: [
    { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
    {
      label: "Companies",
      href: ROUTES.DASHBOARD_PAGES.COMPANY_ADMIN.COMPANIES,
      icon: Building2,
    },
    {
      label: "How To Use",
      href: ROUTES.DASHBOARD_PAGES.COMPANY_ADMIN.HOW_TO_USE,
      icon: CircleHelp,
    },
    {
      label: "Settings",
      href: ROUTES.DASHBOARD_PAGES.SETTINGS,
      icon: Settings,
    },
  ],
  OWNER: [
    { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
    {
      label: "Properties",
      href: ROUTES.DASHBOARD_PAGES.OWNER.PROPERTIES,
      icon: Building2,
    },
    {
      label: "Tenants",
      href: ROUTES.DASHBOARD_PAGES.OWNER.TENANTS,
      icon: Users,
    },
    {
      label: "Settings",
      href: ROUTES.DASHBOARD_PAGES.SETTINGS,
      icon: Settings,
    },
  ],
  TENANT: [
    { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
    {
      label: "Settings",
      href: ROUTES.DASHBOARD_PAGES.SETTINGS,
      icon: Settings,
    },
  ],
};

const commonUserMenuItems: DashboardMenuItemConfig[] = [
  { label: "Profile", href: ROUTES.DASHBOARD_PAGES.PROFILE, icon: User },
  { label: "Settings", href: ROUTES.DASHBOARD_PAGES.SETTINGS, icon: Settings },
  {
    label: "Logout",
    action: "logout",
    icon: LogOut,
    separatorBefore: true,
  },
];

const dashboardUserMenuByRole: Record<AppRole, DashboardMenuItemConfig[]> = {
  COMPANYADMIN: commonUserMenuItems,
  OWNER: commonUserMenuItems,
  TENANT: commonUserMenuItems,
};

export function getPrimaryRole(roles?: string[]): AppRole {
  const matchedRole = ROLE_PRIORITY.find((role) => roles?.includes(role));

  return matchedRole ?? "TENANT";
}

export function getDashboardSidebarItems(
  roles?: string[],
): DashboardMenuItemConfig[] {
  return dashboardSidebarByRole[getPrimaryRole(roles)];
}

export function getDashboardUserMenuItems(
  roles?: string[],
): DashboardMenuItemConfig[] {
  return dashboardUserMenuByRole[getPrimaryRole(roles)];
}