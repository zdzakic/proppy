"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getPrimaryRole } from "@/config/navigation";
import { ROUTES } from "@/config/routes";
import AccountContextCard from "@/components/dashboard/shared/settings/AccountContextCard";
import NotificationsCard, {
  type NotificationSettings,
} from "@/components/dashboard/shared/settings/NotificationsCard";
import SecurityCard from "@/components/dashboard/shared/settings/SecurityCard";
import ActionButton from "@/components/ui/ActionButton";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";

const SETTINGS_STORAGE_KEY = "dashboard-settings";

const defaultSettings: NotificationSettings = {
  emailNotifications: true,
  productUpdates: false,
  securityAlerts: true,
};

export default function SettingsPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [isHydrated, setIsHydrated] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string>("");

  useEffect(() => {
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings) as NotificationSettings);
      } catch {
        localStorage.removeItem(SETTINGS_STORAGE_KEY);
      }
    }

    setIsHydrated(true);
  }, []);

  if (isLoading || !isHydrated) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashboard-border bg-dashboard-surface">
        <Spinner className="border-dashboard-border border-t-dashboard-text" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const primaryRole = getPrimaryRole(user.roles);
  const email = user.email ?? "No email available";

  const toggleSetting = (key: keyof NotificationSettings) => {
    setSavedMessage("");
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const handleSave = () => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    setSavedMessage("Preferences saved on this device.");
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-dashboard-border bg-dashboard-surface p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-dashboard-muted">
              Settings
            </p>
            <div>
              <h1 className="text-3xl font-semibold text-dashboard-text">
                Dashboard Preferences
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-dashboard-muted">
                Personal dashboard preferences grouped into small, reusable card
                blocks. Current version stores settings locally until API persistence
                is added.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <ActionButton variant="primary" onClick={handleSave}>
              Save Preferences
            </ActionButton>
            <ActionButton
              variant="neutral"
              onClick={() => router.push(ROUTES.DASHBOARD_PAGES.PROFILE)}
            >
              Open Profile
            </ActionButton>
          </div>
        </div>

        {savedMessage ? (
          <p className="mt-4 rounded-xl border border-dashboard-border bg-dashboard-bg/60 px-4 py-3 text-sm text-dashboard-text">
            {savedMessage}
          </p>
        ) : null}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <NotificationsCard settings={settings} onToggle={toggleSetting} />
        </div>

        <div className="space-y-6">
          <AccountContextCard email={email} primaryRole={primaryRole} />
          <SecurityCard
            onProfileClick={() => router.push(ROUTES.DASHBOARD_PAGES.PROFILE)}
            onLogout={logout}
          />
        </div>
      </div>
    </div>
  );
}