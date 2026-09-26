"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Brain,
  Building2,
  CalendarDays,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  MessageSquare,
  Settings,
  Sparkles,
  Target,
  Wallet,
  GraduationCap,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

const mainItems: NavItem[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/tasks",
    label: "Tasks",
    icon: CheckSquare,
  },
  {
    href: "/calendar",
    label: "Calendar",
    icon: CalendarDays,
  },
  {
    href: "/notes",
    label: "Notes",
    icon: FileText,
  },
  {
    href: "/goals",
    label: "Goals",
    icon: Target,
  },
  {
    href: "/finance",
    label: "Finance",
    icon: Wallet,
  },
];

const Monoblocs: NavItem[] = [
  {
    href: "/ai",
    label: "Monobloc AI",
    icon: Brain,
  },
  {
    href: "/tutor",
    label: "Monobloc Tutor",
    icon: GraduationCap,
  },
  {
    href: "/business-helper",
    label: "Business",
    icon: Building2,
  },
  {
    href: "/inbox",
    label: "Inbox",
    icon: MessageSquare,
  },
];

export default function FloatingSidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  /*
   * ========================================================
   * OPEN SIDEBAR FROM OTHER PAGES
   *
   * The AI page can now trigger:
   *
   * window.dispatchEvent(
   *   new Event("monobloc:open-sidebar")
   * );
   * ========================================================
   */

  useEffect(() => {
    const handleOpenSidebar = () => {
      setExpanded(true);
    };

    window.addEventListener(
      "monobloc:open-sidebar",
      handleOpenSidebar
    );

    return () => {
      window.removeEventListener(
        "monobloc:open-sidebar",
        handleOpenSidebar
      );
    };
  }, []);

  /*
   * ========================================================
   * ACTIVE ROUTE
   * ========================================================
   */

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  return (
    <aside
      className={`fixed left-4 top-4 bottom-4 z-[100] flex flex-col overflow-visible rounded-[28px] border border-white/[0.08] bg-[#090909]/95 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-[width] duration-300 ease-out ${
        expanded ? "w-[230px]" : "w-[68px]"
      }`}
    >
      {/* ===================================================
          LOGO
      =================================================== */}

      <div className="flex h-[72px] shrink-0 items-center border-b border-white/[0.07] px-3">
        <Link
          href="/"
          className="group flex min-w-0 flex-1 items-center gap-3"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.05] transition group-hover:bg-white/[0.1]">
            <Sparkles
              size={18}
              className="text-white transition group-hover:scale-110"
            />
          </div>

          <div
            className={`min-w-0 overflow-hidden transition-all duration-300 ${
              expanded
                ? "max-w-[130px] opacity-100"
                : "max-w-0 opacity-0"
            }`}
          >
            <p className="whitespace-nowrap text-sm font-semibold tracking-[0.18em] text-white">
              Monobloc
            </p>

            <p className="mt-0.5 whitespace-nowrap text-[8px] uppercase tracking-[0.22em] text-slate-600">
              Personal OS
            </p>
          </div>
        </Link>
      </div>

      {/* ===================================================
          NAVIGATION
      =================================================== */}

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <SidebarSection
          title="Workspace"
          expanded={expanded}
          items={mainItems}
          isActive={isActive}
        />

        <div className="my-4 border-t border-white/[0.06]" />

        <SidebarSection
          title="Intelligence"
          expanded={expanded}
          items={Monoblocs}
          isActive={isActive}
        />
      </nav>

      {/* ===================================================
          SETTINGS + EXPAND
      =================================================== */}

      <div className="shrink-0 border-t border-white/[0.07] p-2">
        <Link
          href="/settings"
          className={`group relative flex h-11 items-center rounded-xl transition-all duration-200 ${
            isActive("/settings")
              ? "bg-white/[0.1] text-white"
              : "text-slate-500 hover:bg-white/[0.06] hover:text-white"
          } ${
            expanded
              ? "gap-3 px-3"
              : "justify-center"
          }`}
        >
          <Settings
            size={18}
            className="shrink-0 transition-transform duration-300 group-hover:rotate-45"
          />

          <span
            className={`whitespace-nowrap text-xs font-medium transition-all duration-300 ${
              expanded
                ? "max-w-[120px] opacity-100"
                : "max-w-0 overflow-hidden opacity-0"
            }`}
          >
            Settings
          </span>

          {!expanded && (
            <SidebarTooltip text="Settings" />
          )}
        </Link>

        <button
          type="button"
          onClick={() =>
            setExpanded((current) => !current)
          }
          className="group relative mt-2 flex h-11 w-full items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-slate-500 transition hover:border-white/[0.13] hover:bg-white/[0.06] hover:text-white"
          aria-label={
            expanded
              ? "Collapse sidebar"
              : "Expand sidebar"
          }
        >
          {expanded ? (
            <ChevronLeft
              size={18}
              className="transition-transform group-hover:-translate-x-0.5"
            />
          ) : (
            <ChevronRight
              size={18}
              className="transition-transform group-hover:translate-x-0.5"
            />
          )}

          {!expanded && (
            <SidebarTooltip text="Expand sidebar" />
          )}
        </button>
      </div>
    </aside>
  );
}

/* =========================================================
   SIDEBAR SECTION
========================================================= */

function SidebarSection({
  title,
  expanded,
  items,
  isActive,
}: {
  title: string;
  expanded: boolean;
  items: NavItem[];
  isActive: (href: string) => boolean;
}) {
  return (
    <div>
      <div
        className={`mb-2 px-3 transition-all duration-300 ${
          expanded
            ? "h-4 opacity-100"
            : "h-0 overflow-hidden opacity-0"
        }`}
      >
        <p className="whitespace-nowrap text-[8px] font-semibold uppercase tracking-[0.22em] text-slate-700">
          {title}
        </p>
      </div>

      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex h-11 items-center rounded-xl transition-all duration-200 ${
                active
                  ? "bg-white/[0.1] text-white"
                  : "text-slate-500 hover:bg-white/[0.06] hover:text-white"
              } ${
                expanded
                  ? "gap-3 px-3"
                  : "justify-center"
              }`}
            >
              {active && (
                <span className="absolute left-0 h-5 w-[2px] rounded-r-full bg-white" />
              )}

              <Icon
                size={18}
                className={`shrink-0 transition-transform duration-200 ${
                  active
                    ? "scale-105"
                    : "group-hover:scale-105"
                }`}
              />

              <span
                className={`whitespace-nowrap text-xs font-medium transition-all duration-300 ${
                  expanded
                    ? "max-w-[140px] opacity-100"
                    : "max-w-0 overflow-hidden opacity-0"
                }`}
              >
                {item.label}
              </span>

              {!expanded && (
                <SidebarTooltip text={item.label} />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   TOOLTIP
========================================================= */

function SidebarTooltip({
  text,
}: {
  text: string;
}) {
  return (
    <span className="pointer-events-none absolute left-[58px] z-[200] whitespace-nowrap rounded-lg border border-white/[0.08] bg-[#111111] px-3 py-1.5 text-[10px] font-medium text-white opacity-0 shadow-xl transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
      {text}
    </span>
  );
}