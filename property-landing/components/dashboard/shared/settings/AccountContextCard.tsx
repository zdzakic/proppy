import { UserCog } from "lucide-react";

import DashboardInfoRow from "@/components/dashboard/shared/common/DashboardInfoRow";
import DashboardSectionCard from "@/components/dashboard/shared/common/DashboardSectionCard";

type AccountContextCardProps = {
  email: string;
  primaryRole: string;
  storageMode?: string;
};

export default function AccountContextCard({
  email,
  primaryRole,
  storageMode = "Local device preferences",
}: AccountContextCardProps) {
  return (
    <DashboardSectionCard
      icon={UserCog}
      title="Account Context"
      description="Current account and role context for this device session."
      contentClassName="space-y-3"
    >
      <DashboardInfoRow label="Signed in as" value={email} />
      <DashboardInfoRow label="Primary role" value={primaryRole} />
      <DashboardInfoRow label="Storage mode" value={storageMode} />
    </DashboardSectionCard>
  );
}