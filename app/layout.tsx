import type { Metadata } from "next";
import ZoraCursor from "@/components/ZoraCursor";
import ZoraBackground from "@/components/ZoraBackground";
import FloatingSidebar from "@/components/floatingsidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zora",
  description: "Your AI Operating System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#070B14] text-white antialiased">
        {/* Background */}
        <ZoraBackground />

        {/* Fixed Zora navigation */}
        <FloatingSidebar />

        {/* EVERYTHING starts after the sidebar */}
        <main className="relative z-10 min-h-screen pl-[90px]">
          {children}
        </main>

        {/* Cursor glow */}
        <ZoraCursor />
      </body>
    </html>
  );
}