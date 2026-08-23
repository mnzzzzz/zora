import FloatingSidebar from "@/components/floatingsidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <FloatingSidebar />

      <main className="relative z-10 min-h-screen pl-[90px]">
        {children}
      </main>
    </div>
  );
}