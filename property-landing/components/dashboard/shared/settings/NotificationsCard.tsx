import { Bell } from "lucide-react";

import DashboardSectionCard from "@/components/dashboard/shared/common/DashboardSectionCard";
import SettingRow from "@/components/dashboard/shared/settings/SettingRow";

export type NotificationSettings = {
  emailNotifications: boolean;
  productUpdates: boolean;
  securityAlerts: boolean;
};

type NotificationsCardProps = {
  settings: NotificationSettings;
  onToggle: (key: keyof NotificationSettings) => void;
};

export default function NotificationsCard({
  settings,
  onToggle,
}: NotificationsCardProps) {
  return (
    <DashboardSectionCard
      icon={Bell}
      title="Notifications"
      description="Choose which updates should stay visible in your workflow."
      contentClassName="space-y-4"
    >
      <SettingRow
        title="Email notifications"
        description="Receive important activity updates by email."
        enabled={settings.emailNotifications}
        onToggle={() => onToggle("emailNotifications")}
      />
      <SettingRow
        title="Product updates"
        description="Show release and feature announcements inside the dashboard."
        enabled={settings.productUpdates}
        onToggle={() => onToggle("productUpdates")}
      />
      <SettingRow
        title="Security alerts"
        description="Keep high-priority login and account alerts enabled."
        enabled={settings.securityAlerts}
        onToggle={() => onToggle("securityAlerts")}
      />
    </DashboardSectionCard>
  );
}