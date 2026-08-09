"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Brain,
  SquareCheckBig,
  CalendarDays,
  NotebookPen,
  Wallet,
  Target,
  PhoneCall,
  Settings,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "AI Assistant",
    href: "/ai",
    icon: Brain,
  },
  {
    name: "Zora Calls",
    href: "/calls",
    icon: PhoneCall,
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: SquareCheckBig,
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: CalendarDays,
  },
  {
    name: "Notes",
    href: "/notes",
    icon: NotebookPen,
  },
  {
    name: "Finance",
    href: "/finances",
    icon: Wallet,
  },
  {
    name: "Goals",
    href: "/goals",
    icon: Target,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col border-r border-white/10 bg-[#08111f]/80 backdrop-blur-3xl">

      {/* Logo */}
      <div className="border-b border-white/10 p-8">
        <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-3xl font-bold text-transparent">
          Zora
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          AI Operating System
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto p-5">

        {links.map((link) => {
          const Icon = link.icon;

          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`group flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 ${
                active
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon
                size={21}
                className={`transition ${
                  active
                    ? "text-white"
                    : "text-gray-500 group-hover:text-cyan-400"
                }`}
              />

              <span className="font-medium">
                {link.name}
              </span>

              {link.name === "Zora Calls" && (
                <span className="ml-auto rounded-full bg-cyan-400/10 px-2 py-1 text-[10px] font-semibold text-cyan-300">
                  AI
                </span>
              )}
            </Link>
          );
        })}

      </nav>

      {/* Zora Calls Promo */}
      <div className="border-t border-white/10 p-5">

        <div className="rounded-2xl border border-blue-400/10 bg-gradient-to-br from-blue-500/15 to-cyan-400/10 p-5">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15">
            <PhoneCall
              size={19}
              className="text-cyan-400"
            />
          </div>

          <h2 className="mt-4 font-semibold text-white">
            Zora Calls
          </h2>

          <p className="mt-1 text-xs leading-relaxed text-gray-400">
            Let AI handle your business calls and appointments.
          </p>

          <Link
            href="/calls"
            className="mt-4 block rounded-xl bg-white/5 py-2.5 text-center text-xs font-medium text-cyan-300 transition hover:bg-white/10"
          >
            Open Calls
          </Link>

        </div>

      </div>

    </aside>
  );
}