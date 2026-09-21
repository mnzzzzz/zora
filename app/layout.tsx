import type { Metadata } from "next";
import MonoblocBackground from "@/components/MonoblocBackground";
import "./globals.css";

export const metadata: Metadata = {
  title: "Monobloc",
  description: "Your AI Operating System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#070707] text-white antialiased">
        {/* Background MUST NOT take up document space */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <MonoblocBackground />
        </div>

        {/* Actual application */}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}