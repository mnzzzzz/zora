"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Bell,
  User,
  Shield,
  Palette,
  Check,
  Save,
  Moon,
  Sun,
  Monitor,
  Mail,
  Lock,
  Sparkles,
} from "lucide-react";

type SettingsData = {
  name: string;
  email: string;
  notifications: boolean;
  emailNotifications: boolean;
  taskReminders: boolean;
  theme: "dark" | "light" | "system";
  showActivity: boolean;
};

const defaultSettings: SettingsData = {
  name: "",
  email: "",
  notifications: true,
  emailNotifications: true,
  taskReminders: true,
  theme: "dark",
  showActivity: true,
};

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<SettingsData>(defaultSettings);

  const [saved, setSaved] = useState(false);

  // Load saved settings
  useEffect(() => {
    const savedData = localStorage.getItem("zora-settings");

    if (savedData) {
      try {
        setSettings({
          ...defaultSettings,
          ...JSON.parse(savedData),
        });
      } catch {
        console.log("Could not load saved settings.");
      }
    }
  }, []);

  function updateSetting<K extends keyof SettingsData>(
    key: K,
    value: SettingsData[K]
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
  }

  function saveSettings() {
    localStorage.setItem(
      "zora-settings",
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  return (
    <main className="min-h-screen bg-[#07111F] px-6 py-8 text-white">
      <div className="mx-auto max-w-5xl">

        {/* ============================== */}
        {/* HEADER */}
        {/* ============================== */}

        <div className="mb-8 flex items-end justify-between">

          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
                <Settings className="h-5 w-5 text-cyan-400" />
              </div>

              <span className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">
                Zora
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight">
              Settings
            </h1>

            <p className="mt-2 text-gray-400">
              Customize your Zora experience.
            </p>
          </div>

          {/* SAVE BUTTON */}

          <button
            onClick={saveSettings}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-blue-500/40"
          >
            {saved ? (
              <>
                <Check size={18} />
                Saved
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>

        <div className="grid gap-5">

          {/* ============================== */}
          {/* PROFILE */}
          {/* ============================== */}

          <section className="rounded-[28px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">

            <div className="mb-6 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15">
                <User className="text-blue-400" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Profile
                </h2>

                <p className="text-sm text-gray-400">
                  Manage your personal information.
                </p>
              </div>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Name
                </label>

                <input
                  value={settings.name}
                  onChange={(e) =>
                    updateSetting("name", e.target.value)
                  }
                  placeholder="Enter your name"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Email
                </label>

                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    updateSetting("email", e.target.value)
                  }
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                />
              </div>

            </div>
          </section>

          {/* ============================== */}
          {/* NOTIFICATIONS */}
          {/* ============================== */}

          <section className="rounded-[28px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">

            <div className="mb-6 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15">
                <Bell className="text-purple-400" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Notifications
                </h2>

                <p className="text-sm text-gray-400">
                  Control how Zora keeps you updated.
                </p>
              </div>

            </div>

            <div className="space-y-3">

              <ToggleRow
                icon={<Bell size={18} />}
                title="Notifications"
                description="Allow Zora to send notifications."
                enabled={settings.notifications}
                onChange={(value) =>
                  updateSetting("notifications", value)
                }
              />

              <ToggleRow
                icon={<Mail size={18} />}
                title="Email notifications"
                description="Receive important updates by email."
                enabled={settings.emailNotifications}
                onChange={(value) =>
                  updateSetting(
                    "emailNotifications",
                    value
                  )
                }
              />

              <ToggleRow
                icon={<Sparkles size={18} />}
                title="Task reminders"
                description="Get reminders about upcoming tasks."
                enabled={settings.taskReminders}
                onChange={(value) =>
                  updateSetting("taskReminders", value)
                }
              />

            </div>
          </section>

          {/* ============================== */}
          {/* APPEARANCE */}
          {/* ============================== */}

          <section className="rounded-[28px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">

            <div className="mb-6 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15">
                <Palette className="text-cyan-400" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Appearance
                </h2>

                <p className="text-sm text-gray-400">
                  Choose how Zora looks.
                </p>
              </div>

            </div>

            <div className="grid grid-cols-3 gap-3">

              <ThemeButton
                icon={<Moon size={20} />}
                title="Dark"
                active={settings.theme === "dark"}
                onClick={() =>
                  updateSetting("theme", "dark")
                }
              />

              <ThemeButton
                icon={<Sun size={20} />}
                title="Light"
                active={settings.theme === "light"}
                onClick={() =>
                  updateSetting("theme", "light")
                }
              />

              <ThemeButton
                icon={<Monitor size={20} />}
                title="System"
                active={settings.theme === "system"}
                onClick={() =>
                  updateSetting("theme", "system")
                }
              />

            </div>
          </section>

          {/* ============================== */}
          {/* PRIVACY */}
          {/* ============================== */}

          <section className="rounded-[28px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">

            <div className="mb-6 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/15">
                <Shield className="text-green-400" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Privacy & Security
                </h2>

                <p className="text-sm text-gray-400">
                  Manage your privacy preferences.
                </p>
              </div>

            </div>

            <ToggleRow
              icon={<Lock size={18} />}
              title="Show activity"
              description="Allow your activity to appear on your Zora dashboard."
              enabled={settings.showActivity}
              onChange={(value) =>
                updateSetting("showActivity", value)
              }
            />

          </section>

        </div>

        {/* FOOTER */}

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-600">
          <Sparkles size={12} />
          Your preferences are saved locally on this device.
        </div>

      </div>
    </main>
  );
}

/* ================================================= */
/* TOGGLE */
/* ================================================= */

function ToggleRow({
  icon,
  title,
  description,
  enabled,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-black/10 p-4">

      <div className="flex items-center gap-4">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-gray-400">
          {icon}
        </div>

        <div>
          <p className="text-sm font-medium">
            {title}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {description}
          </p>
        </div>

      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative h-7 w-12 rounded-full transition-colors duration-300 ${
          enabled
            ? "bg-cyan-500"
            : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
            enabled
              ? "translate-x-6"
              : "translate-x-1"
          }`}
        />
      </button>

    </div>
  );
}

/* ================================================= */
/* THEME BUTTON */
/* ================================================= */

function ThemeButton({
  icon,
  title,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-3 rounded-2xl border p-5 transition-all duration-300 ${
        active
          ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-300"
          : "border-white/10 bg-black/10 text-gray-400 hover:border-white/20 hover:bg-white/[0.05]"
      }`}
    >
      {icon}

      <span className="text-sm font-medium">
        {title}
      </span>

      {active && (
        <Check size={15} />
      )}
    </button>
  );
}