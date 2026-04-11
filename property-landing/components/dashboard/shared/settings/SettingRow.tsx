import ActionButton from "@/components/ui/ActionButton";

type SettingRowProps = {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
};

export default function SettingRow({
  title,
  description,
  enabled,
  onToggle,
}: SettingRowProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-dashboard-border bg-dashboard-bg/60 px-4 py-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="text-sm font-semibold text-dashboard-text">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-dashboard-muted">
          {description}
        </p>
      </div>

      <ActionButton
        variant={enabled ? "primary" : "neutral"}
        size="sm"
        onClick={onToggle}
      >
        {enabled ? "Enabled" : "Disabled"}
      </ActionButton>
    </div>
  );
}