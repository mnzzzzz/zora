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
      <body className="bg-[#070B14] text-white antialiased">
        <MonoblocBackground />
        {children}
      </body>
    </html>
  );
}