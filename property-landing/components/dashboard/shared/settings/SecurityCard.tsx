import { Shield } from "lucide-react";

import DashboardSectionCard from "@/components/dashboard/shared/common/DashboardSectionCard";
import ActionButton from "@/components/ui/ActionButton";

type SecurityCardProps = {
  onProfileClick: () => void;
  onLogout: () => void;
};

export default function SecurityCard({
  onProfileClick,
  onLogout,
}: SecurityCardProps) {
  return (
    <DashboardSectionCard
      icon={Shield}
      title="Security"
      description="Account protection actions available right now."
      contentClassName="space-y-3"
    >
      <ActionButton variant="neutral" fullWidth onClick={onProfileClick}>
        Review Profile
      </ActionButton>
      <ActionButton variant="danger" fullWidth onClick={onLogout}>
        Logout
      </ActionButton>
    </DashboardSectionCard>
  );
}