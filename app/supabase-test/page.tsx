"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SupabaseTest() {
  const [status, setStatus] = useState("Testing connection...");

  useEffect(() => {
    const test = async () => {
      const supabase = createClient();

      const { error } = await supabase
        .from("profiles")
        .select("id")
        .limit(1);

      if (error) {
        setStatus(`Error: ${error.message}`);
        return;
      }

      setStatus("Supabase connected successfully 🚀");
    };

    test();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050b16] text-white">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-6">
        <p className="text-lg font-semibold">
          {status}
        </p>
      </div>
    </main>
  );
}