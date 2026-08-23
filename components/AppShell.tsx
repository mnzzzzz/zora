"use client";

import { usePathname } from "next/navigation";
import FloatingSidebar from "@/components/floatingsidebar";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <FloatingSidebar />

      <main className="relative z-10 min-h-screen pl-[90px]">
        {children}
      </main>
    </>
  );
}