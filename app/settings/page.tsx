"use client"

import { useState } from "react"
import {
  Bell,
  Check,
  ChevronRight,
  CreditCard,
  Eye,
  Globe,
  KeyRound,
  LogOut,
  Monitor,
  Moon,
  Palette,
  Save,
  Shield,
  Sparkles,
  User,
  Zap,
} from "lucide-react"

import FloatingSidebar from "@/components/floatingsidebar"

type SettingSection =
  | "profile"
  | "appearance"
  | "notifications"
  | "privacy"
  | "ai"
  | "billing"

export default function SettingsPage() {
  const [activeSection, setActiveSection] =
    useState<SettingSection>("profile")

  const [name, setName] = useState("Monicca")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("monicca")

  const [darkMode, setDarkMode] = useState(true)
  const [compactMode, setCompactMode] = useState(false)
  const [animations, setAnimations] = useState(true)

  const [emailNotifications, setEmailNotifications] =
    useState(true)
  const [taskNotifications, setTaskNotifications] =
    useState(true)
  const [aiNotifications, setAiNotifications] =
    useState(true)

  const [memoryEnabled, setMemoryEnabled] = useState(true)
  const [personalization, setPersonalization] =
    useState(true)

  const [saved, setSaved] = useState(false)

  const saveSettings = () => {
    setSaved(true)

    window.setTimeout(() => {
      setSaved(false)
    }, 2200)
  }

  const sections = [
    {
      id: "profile" as SettingSection,
      label: "Profile",
      description: "Your Monobloc identity",
      icon: User,
    },
    {
      id: "appearance" as SettingSection,
      label: "Appearance",
      description: "Customize your workspace",
      icon: Palette,
    },
    {
      id: "notifications" as SettingSection,
      label: "Notifications",
      description: "Control what reaches you",
      icon: Bell,
    },
    {
      id: "privacy" as SettingSection,
      label: "Privacy & Security",
      description: "Protect your workspace",
      icon: Shield,
    },
    {
      id: "ai" as SettingSection,
      label: "AI Preferences",
      description: "Configure your intelligence layer",
      icon: Sparkles,
    },
    {
      id: "billing" as SettingSection,
      label: "Plan & Billing",
      description: "Manage your subscription",
      icon: CreditCard,
    },
  ]

  const Toggle = ({
    enabled,
    onClick,
  }: {
    enabled: boolean
    onClick: () => void
  }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label="Toggle setting"
      className={`relative h-6 w-11 rounded-full border transition ${
        enabled
          ? "border-purple-400/40 bg-purple-500"
          : "border-white/10 bg-white/[0.08]"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
          enabled ? "left-6" : "left-1"
        }`}
      />
    </button>
  )

  const SettingRow = ({
    title,
    description,
    children,
  }: {
    title: string
    description: string
    children: React.ReactNode
  }) => (
    <div className="flex items-center justify-between gap-6 border-b border-white/[0.06] py-5 last:border-b-0">
      <div>
        <p className="text-sm font-medium text-white/85">
          {title}
        </p>
        <p className="mt-1 max-w-lg text-xs leading-5 text-white/35">
          {description}
        </p>
      </div>

      <div className="shrink-0">{children}</div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <>
            <SectionHeader
              icon={<User className="h-5 w-5" />}
              title="Profile"
              description="Manage how you appear across Monobloc."
            />

            <div className="mb-8 flex items-center gap-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-800 text-xl font-semibold shadow-lg shadow-purple-950/40">
                M
              </div>

              <div>
                <p className="text-base font-medium">
                  {name || "Your name"}
                </p>

                <p className="mt-1 text-xs text-white/35">
                  Monobloc workspace member
                </p>

                <button
                  type="button"
                  onClick={() =>
                    window.alert(
                      "Profile image upload will be available soon."
                    )
                  }
                  className="mt-3 text-xs text-purple-300 transition hover:text-purple-200"
                >
                  Change avatar
                </button>
              </div>
            </div>

            <div className="space-y-5">
              <InputField
                label="Display name"
                value={name}
                onChange={setName}
                placeholder="Your name"
              />

              <InputField
                label="Email address"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                type="email"
              />

              <InputField
                label="Username"
                value={username}
                onChange={setUsername}
                placeholder="username"
              />
            </div>
          </>
        )

      case "appearance":
        return (
          <>
            <SectionHeader
              icon={<Palette className="h-5 w-5" />}
              title="Appearance"
              description="Make Monobloc feel like your workspace."
            />

            <div className="mb-7">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-white/30">
                Theme
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <ThemeCard
                  title="Dark"
                  active={darkMode}
                  icon={<Moon className="h-4 w-4" />}
                  onClick={() => setDarkMode(true)}
                />

                <ThemeCard
                  title="System"
                  active={false}
                  icon={<Monitor className="h-4 w-4" />}
                  onClick={() =>
                    window.alert(
                      "System theme preference will be available soon."
                    )
                  }
                />

                <ThemeCard
                  title="Light"
                  active={!darkMode}
                  icon={<Eye className="h-4 w-4" />}
                  onClick={() =>
                    window.alert(
                      "Monobloc currently uses its dark interface."
                    )
                  }
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5">
              <SettingRow
                title="Compact mode"
                description="Reduce spacing across workspace interfaces."
              >
                <Toggle
                  enabled={compactMode}
                  onClick={() =>
                    setCompactMode((value) => !value)
                  }
                />
              </SettingRow>

              <SettingRow
                title="Interface animations"
                description="Use subtle transitions and motion throughout Monobloc."
              >
                <Toggle
                  enabled={animations}
                  onClick={() =>
                    setAnimations((value) => !value)
                  }
                />
              </SettingRow>
            </div>
          </>
        )

      case "notifications":
        return (
          <>
            <SectionHeader
              icon={<Bell className="h-5 w-5" />}
              title="Notifications"
              description="Choose when Monobloc should get your attention."
            />

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5">
              <SettingRow
                title="Email notifications"
                description="Receive important workspace updates by email."
              >
                <Toggle
                  enabled={emailNotifications}
                  onClick={() =>
                    setEmailNotifications(
                      (value) => !value
                    )
                  }
                />
              </SettingRow>

              <SettingRow
                title="Task reminders"
                description="Get notified about upcoming or overdue tasks."
              >
                <Toggle
                  enabled={taskNotifications}
                  onClick={() =>
                    setTaskNotifications(
                      (value) => !value
                    )
                  }
                />
              </SettingRow>

              <SettingRow
                title="AI activity"
                description="Receive updates when Monobloc completes an AI action."
              >
                <Toggle
                  enabled={aiNotifications}
                  onClick={() =>
                    setAiNotifications(
                      (value) => !value
                    )
                  }
                />
              </SettingRow>
            </div>
          </>
        )

      case "privacy":
        return (
          <>
            <SectionHeader
              icon={<Shield className="h-5 w-5" />}
              title="Privacy & Security"
              description="Control your workspace data and account security."
            />

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5">
              <SettingRow
                title="AI memory"
                description="Allow Monobloc to retain useful context between conversations."
              >
                <Toggle
                  enabled={memoryEnabled}
                  onClick={() =>
                    setMemoryEnabled(
                      (value) => !value
                    )
                  }
                />
              </SettingRow>

              <SettingRow
                title="Personalization"
                description="Use your workspace context to personalize AI responses."
              >
                <Toggle
                  enabled={personalization}
                  onClick={() =>
                    setPersonalization(
                      (value) => !value
                    )
                  }
                />
              </SettingRow>
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() =>
                  window.alert(
                    "Password management will be available here."
                  )
                }
                className="flex w-full items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-left transition hover:border-white/15 hover:bg-white/[0.045]"
              >
                <div className="flex items-center gap-3">
                  <KeyRound className="h-4 w-4 text-purple-300" />

                  <div>
                    <p className="text-sm font-medium">
                      Change password
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      Update your account password
                    </p>
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-white/25" />
              </button>

              <button
                type="button"
                onClick={() =>
                  window.alert(
                    "Active sessions management will be available here."
                  )
                }
                className="flex w-full items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-left transition hover:border-white/15 hover:bg-white/[0.045]"
              >
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-cyan-300" />

                  <div>
                    <p className="text-sm font-medium">
                      Active sessions
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      Review devices signed into your account
                    </p>
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-white/25" />
              </button>
            </div>
          </>
        )

      case "ai":
        return (
          <>
            <SectionHeader
              icon={<Sparkles className="h-5 w-5" />}
              title="AI Preferences"
              description="Configure how your Monobloc intelligence layer behaves."
            />

            <div className="mb-6 rounded-2xl border border-purple-400/15 bg-purple-500/[0.045] p-5">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
                  <Zap className="h-5 w-5 text-purple-300" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Monobloc Intelligence
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/35">
                    Your AI layer can use workspace context,
                    memory and connected information to help
                    you execute tasks.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5">
              <SettingRow
                title="Use workspace context"
                description="Let AI reference your tasks, notes, calendar and other workspace data."
              >
                <Toggle
                  enabled={true}
                  onClick={() =>
                    window.alert(
                      "Workspace context is currently required for Monobloc AI."
                    )
                  }
                />
              </SettingRow>

              <SettingRow
                title="Smart suggestions"
                description="Allow Monobloc to surface relevant actions and suggestions."
              >
                <Toggle
                  enabled={personalization}
                  onClick={() =>
                    setPersonalization(
                      (value) => !value
                    )
                  }
                />
              </SettingRow>

              <SettingRow
                title="AI activity history"
                description="Keep a record of your previous AI interactions."
              >
                <Toggle
                  enabled={memoryEnabled}
                  onClick={() =>
                    setMemoryEnabled(
                      (value) => !value
                    )
                  }
                />
              </SettingRow>
            </div>
          </>
        )

      case "billing":
        return (
          <>
            <SectionHeader
              icon={<CreditCard className="h-5 w-5" />}
              title="Plan & Billing"
              description="Manage your Monobloc subscription and usage."
            />

            <div className="relative overflow-hidden rounded-3xl border border-purple-400/20 bg-gradient-to-br from-purple-500/[0.10] via-white/[0.025] to-cyan-400/[0.04] p-6">
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />

              <div className="relative">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-purple-300">
                      CURRENT PLAN
                    </p>

                    <h3 className="mt-2 text-2xl font-semibold">
                      Monobloc Pro
                    </h3>

                    <p className="mt-2 text-xs text-white/35">
                      Your intelligence workspace is active.
                    </p>
                  </div>

                  <div className="rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 text-[10px] font-medium text-purple-300">
                    ACTIVE
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/[0.07] bg-black/20 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-white/25">
                      AI Usage
                    </p>

                    <p className="mt-2 text-lg font-semibold">
                      Active
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.07] bg-black/20 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-white/25">
                      Workspace
                    </p>

                    <p className="mt-2 text-lg font-semibold">
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                window.alert(
                  "Billing management will be available here."
                )
              }
              className="mt-5 flex w-full items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-left transition hover:border-white/15 hover:bg-white/[0.045]"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-purple-300" />

                <div>
                  <p className="text-sm font-medium">
                    Manage subscription
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    View plan details and payment settings
                  </p>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 text-white/25" />
            </button>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#05030d] text-white">
      <FloatingSidebar />

      <main className="min-h-screen pl-20 sm:pl-24">
        <div className="mx-auto max-w-[1400px] px-5 py-6 sm:px-8 lg:px-10">

          {/* Header */}
          <header className="mb-8">
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.25em] text-purple-400">
              MONOBLOC OS
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Settings
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Configure your workspace, account and intelligence layer.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">

            {/* Settings Navigation */}
            <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.025] p-2 backdrop-blur-xl">
              {sections.map((section) => {
                const Icon = section.icon
                const active =
                  activeSection === section.id

                return (
                  <button
                    type="button"
                    key={section.id}
                    onClick={() =>
                      setActiveSection(section.id)
                    }
                    className={`group mb-1 flex w-full items-center gap-3 rounded-2xl p-3.5 text-left transition last:mb-0 ${
                      active
                        ? "border border-purple-400/15 bg-purple-500/[0.10]"
                        : "border border-transparent hover:bg-white/[0.04]"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        active
                          ? "bg-purple-500/15 text-purple-300"
                          : "bg-white/[0.04] text-white/35 group-hover:text-white/60"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium ${
                          active
                            ? "text-white"
                            : "text-white/60"
                        }`}
                      >
                        {section.label}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-white/25">
                        {section.description}
                      </p>
                    </div>

                    {active && (
                      <ChevronRight className="h-4 w-4 text-purple-300/60" />
                    )}
                  </button>
                )
              })}

              <div className="my-2 border-t border-white/[0.06]" />

              <button
                type="button"
                onClick={() =>
                  window.alert(
                    "Sign out functionality will be connected to authentication."
                  )
                }
                className="group flex w-full items-center gap-3 rounded-2xl p-3.5 text-left transition hover:bg-red-400/[0.05]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-400/[0.06] text-red-300/60 transition group-hover:text-red-300">
                  <LogOut className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-medium text-white/55 group-hover:text-white/75">
                    Sign out
                  </p>

                  <p className="mt-0.5 text-[10px] text-white/20">
                    End this session
                  </p>
                </div>
              </button>
            </aside>

            {/* Main Settings Panel */}
            <section className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl sm:p-8">
              <div className="min-h-[560px]">
                {renderContent()}
              </div>

              <div className="mt-8 flex items-center justify-end border-t border-white/[0.06] pt-6">
                {saved && (
                  <div className="mr-4 flex items-center gap-2 text-xs text-green-300">
                    <Check className="h-4 w-4" />
                    Changes saved
                  </div>
                )}

                <button
                  type="button"
                  onClick={saveSettings}
                  className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-white/90"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </section>
          </div>

          <footer className="mt-8 flex items-center justify-between border-t border-white/[0.06] py-5 text-[10px] text-white/20">
            <span>MONOBLOC OS</span>

            <span className="tracking-[0.15em]">
              YOUR AI OPERATING SYSTEM
            </span>
          </footer>
        </div>
      </main>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="mb-8 flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
        {icon}
      </div>

      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-5 text-white/35">
          {description}
        </p>
      </div>
    </div>
  )
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-white/55">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-purple-400/40 focus:bg-black/30"
      />
    </div>
  )
}

function ThemeCard({
  title,
  icon,
  active,
  onClick,
}: {
  title: string
  icon: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        active
          ? "border-purple-400/30 bg-purple-500/[0.08]"
          : "border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
      }`}
    >
      <div
        className={`mb-4 flex h-9 w-9 items-center justify-center rounded-xl ${
          active
            ? "bg-purple-500/15 text-purple-300"
            : "bg-white/[0.04] text-white/35"
        }`}
      >
        {icon}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {title}
        </span>

        {active && (
          <Check className="h-4 w-4 text-purple-300" />
        )}
      </div>
    </button>
  )
}