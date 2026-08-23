import type { Metadata } from "next";
import ZoraBackground from "@/components/ZoraBackground";
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
        <ZoraBackground />
        {children}
      </body>
    </html>
  );
}