"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

import {
  Home,
  CheckSquare,
  CalendarDays,
  FileText,
  Target,
  Wallet,
  Brain,
  Settings,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Users,
} from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: CalendarDays,
  },
  {
    name: "Notes",
    href: "/notes",
    icon: FileText,
  },
  {
    name: "Goals",
    href: "/goals",
    icon: Target,
  },
  {
    name: "Connect",
    href: "/connect",
    icon: Users,
  },
  {
    name: "Finance",
    href: "/finance",
    icon: Wallet,
  },
  {
    name: "Zora Tutor",
    href: "/tutor",
    icon: Brain,
  },
];

export default function FloatingSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <aside
      className={`
        fixed
        left-0
        top-0
        z-[100]
        h-screen
        transition-all
        duration-300
        ease-out
        ${open ? "w-[260px]" : "w-[90px]"}
      `}
    >
      <div
        className="
          flex
          h-full
          w-full
          flex-col
          border-r
          border-white/10
          bg-[#07111f]/95
          shadow-[10px_0_40px_rgba(0,0,0,0.25)]
          backdrop-blur-2xl
        "
      >
        {/* HEADER */}

        <div
          className={`
            flex
            h-[90px]
            shrink-0
            items-center
            border-b
            border-white/10
            px-4
            ${open ? "justify-between" : "justify-center"}
          `}
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-blue-500
                to-cyan-400
                shadow-[0_0_25px_rgba(34,211,238,0.3)]
              "
            >
              <Sparkles
                size={22}
                className="text-white"
              />
            </div>

            {open && (
              <div className="whitespace-nowrap">
                <p className="text-lg font-bold text-white">
                  Zora
                </p>

                <p className="text-[11px] text-slate-500">
                  AI Operating System
                </p>
              </div>
            )}
          </div>

          {open && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                text-slate-500
                transition
                hover:bg-white/10
                hover:text-white
              "
              aria-label="Collapse navigation"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* EXPAND BUTTON */}

        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="
              mx-auto
              mt-5
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-white/5
              text-slate-400
              transition
              hover:border-cyan-400/30
              hover:bg-cyan-400/10
              hover:text-cyan-300
            "
            aria-label="Open navigation"
          >
            <ChevronRight size={18} />
          </button>
        )}

        {/* NAVIGATION */}

        <nav className="mt-5 flex-1 space-y-1 overflow-y-auto px-3">
          {navItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              (item.href !== "/" &&
                pathname.startsWith(item.href + "/"));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  relative
                  flex
                  h-12
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? "bg-cyan-400/10 text-cyan-300"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                {isActive && (
                  <span
                    className="
                      absolute
                      left-0
                      h-6
                      w-[3px]
                      rounded-r-full
                      bg-cyan-400
                      shadow-[0_0_12px_rgba(34,211,238,0.9)]
                    "
                  />
                )}

                <Icon
                  size={20}
                  className={`shrink-0 ${
                    isActive
                      ? "text-cyan-300"
                      : ""
                  }`}
                />

                {open && (
                  <span className="whitespace-nowrap text-sm font-medium">
                    {item.name}
                  </span>
                )}

                {open && (
                  <ChevronRight
                    size={14}
                    className="ml-auto opacity-20"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* SETTINGS */}

        <div className="border-t border-white/10 p-3">
          <Link
            href="/settings"
            className={`
              relative
              flex
              h-12
              items-center
              gap-3
              rounded-xl
              px-3
              transition
              ${
                pathname.startsWith("/settings")
                  ? "bg-cyan-400/10 text-cyan-300"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }
            `}
          >
            {pathname.startsWith("/settings") && (
              <span
                className="
                  absolute
                  left-0
                  h-6
                  w-[3px]
                  rounded-r-full
                  bg-cyan-400
                  shadow-[0_0_12px_rgba(34,211,238,0.9)]
                "
              />
            )}

            <Settings
              size={20}
              className="shrink-0"
            />

            {open && (
              <span className="whitespace-nowrap text-sm font-medium">
                Settings
              </span>
            )}

            {open && (
              <ChevronRight
                size={14}
                className="ml-auto opacity-20"
              />
            )}
          </Link>
        </div>
      </div>
    </aside>
  );
}