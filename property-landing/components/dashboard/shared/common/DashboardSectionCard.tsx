import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type DashboardSectionCardProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  titleClassName?: string;
};

export default function DashboardSectionCard({
  title,
  description,
  icon: Icon,
  actions,
  children,
  className = "",
  contentClassName = "",
  titleClassName = "text-lg font-semibold",
}: DashboardSectionCardProps) {
  return (
    <section
      className={[
        "rounded-2xl border border-dashboard-border bg-dashboard-surface p-6 shadow-sm",
        className,
      ].join(" ")}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {Icon ? <Icon className="h-5 w-5 text-dashboard-muted" /> : null}
          <div>
            <h2 className={`${titleClassName} text-dashboard-text`}>{title}</h2>
            {description ? (
              <p className="text-sm text-dashboard-muted">{description}</p>
            ) : null}
          </div>
        </div>

        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>

      <div className={contentClassName}>{children}</div>
    </section>
  );
}