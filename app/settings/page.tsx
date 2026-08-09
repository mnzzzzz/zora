"use client";

import { Settings, Bell, User, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[#07111F] px-6 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="mt-2 text-gray-400">
            Customize your Zora experience.
          </p>
        </div>

        <div className="grid gap-5">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15">
                <User className="text-blue-400" />
              </div>

              <div>
                <h2 className="font-semibold">Profile</h2>
                <p className="text-sm text-gray-400">
                  Manage your personal information.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15">
                <Bell className="text-purple-400" />
              </div>

              <div>
                <h2 className="font-semibold">Notifications</h2>
                <p className="text-sm text-gray-400">
                  Control your Zora notifications.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15">
                <Palette className="text-cyan-400" />
              </div>

              <div>
                <h2 className="font-semibold">Appearance</h2>
                <p className="text-sm text-gray-400">
                  Customize how Zora looks.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/15">
                <Shield className="text-green-400" />
              </div>

              <div>
                <h2 className="font-semibold">Privacy & Security</h2>
                <p className="text-sm text-gray-400">
                  Manage your security preferences.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}