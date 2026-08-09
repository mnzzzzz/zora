"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  CalendarDays,
  SquareCheckBig,
  NotebookPen,
  Brain,
} from "lucide-react";

const items = [
  {
    href: "/",
    icon: House,
    label: "Home",
  },
  {
    href: "/calendar",
    icon: CalendarDays,
    label: "Calendar",
  },
  {
    href: "/tasks",
    icon: SquareCheckBig,
    label: "Tasks",
  },
  {
    href: "/notes",
    icon: NotebookPen,
    label: "Notes",
  },
  {
    href: "/ai",
    icon: Brain,
    label: "AI",
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-5 left-1/2 z-50 flex w-[92%] max-w-md -translate-x-1/2 items-center justify-between rounded-3xl border border-white/10 bg-white/10 px-6 py-4 backdrop-blur-3xl shadow-2xl">
      {items.map((item) => {
        const Icon = item.icon;

        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center transition ${
              active
                ? "text-cyan-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Icon size={24} />

            <span className="mt-1 text-[11px]">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}