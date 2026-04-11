import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type DashboardMenuItemProps = {
  href?: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  variant?: "sidebar" | "dropdown";
};

const variantClasses = {
  sidebar:
    "rounded-lg px-4 py-2 text-sm hover:bg-dashboard-hover",
  dropdown:
    "rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-dashboard-hover",
};

export default function DashboardMenuItem({
  href,
  icon: Icon,
  label,
  onClick,
  variant = "sidebar",
}: DashboardMenuItemProps) {
  const className = `flex w-full items-center gap-3 text-dashboard-text ${variantClasses[variant]}`;
  const iconClassName = variant === "sidebar" ? "h-5 w-5" : "h-4 w-4 opacity-70";

  if (href) {
    return (
      <Link href={href} className={className}>
        <Icon className={iconClassName} />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${className} cursor-pointer`}>
      <Icon className={iconClassName} />
      <span>{label}</span>
    </button>
  );
}