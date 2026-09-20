"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthTestPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const [message, setMessage] = useState("");

  const getSupabase = () => createClient();

  const signUp = async () => {
    if (!email || !password) {
      setMessage("Enter your email and password.");
      return;
    }

    const supabase = getSupabase();

    setMessage("Creating account...");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(
      "Account created! Check your email to confirm your account."
    );
  };

  const signIn = async () => {
    if (!email || !password) {
      setMessage("Enter your email and password.");
      return;
    }

    const supabase = getSupabase();

    setMessage("Signing in...");

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setMessage(error.message);
      return;
    }

    if (!data.user) {
      setMessage("No authenticated user found.");
      return;
    }

    setMessage("Signed in. Creating your Monobloc...");

    const cleanUsername = username
      .trim()
      .toLowerCase()
      .replace(/^@/, "");

    const cleanName = name.trim();

    if (!cleanUsername || !cleanName) {
      setMessage(
        "You're signed in. Enter your name and username, then click Create Profile."
      );
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        name: cleanName,
        username: cleanUsername,
        initials: cleanName
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        role: "Connection",
        status: "online",
      });

    if (profileError) {
      if (profileError.code === "23505") {
        setMessage(
          "That username is already taken. Try another one."
        );
        return;
      }

      if (profileError.code === "23503") {
        setMessage(
          "Your authentication session is not ready yet. Please sign in again."
        );
        return;
      }

      setMessage(
        `Profile error: ${profileError.message}`
      );
      return;
    }

    setMessage(
      "Monoblocfile created successfully 🚀"
    );
  };

  const createProfile = async () => {
    const supabase = getSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("You are not logged in.");
      return;
    }

    const cleanUsername = username
      .trim()
      .toLowerCase()
      .replace(/^@/, "");

    const cleanName = name.trim();

    if (!cleanUsername || !cleanName) {
      setMessage("Enter your name and username.");
      return;
    }

    setMessage("Creating Monoblocfile...");

    const { error } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        name: cleanName,
        username: cleanUsername,
        initials: cleanName
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        role: "Connection",
        status: "online",
      });

    if (error) {
      if (error.code === "23505") {
        setMessage(
          "That username is already taken."
        );
        return;
      }

      setMessage(
        `Profile error: ${error.message}`
      );
      return;
    }

    setMessage(
      "Monobloc profile created successfully 🚀"
    );
  };

  const checkUser = async () => {
    const supabase = getSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("No user is currently logged in.");
      return;
    }

    setMessage(`Logged in as: ${user.email}`);
  };

  const checkProfile = async () => {
    const supabase = getSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("No user is currently logged in.");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      setMessage(
        `Profile error: ${error.message}`
      );
      return;
    }

    setMessage(
      `Profile found: @${data.username} — ${data.name}`
    );
  };

  const signOut = async () => {
    const supabase = getSupabase();

    await supabase.auth.signOut();

    setMessage("Logged out.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050b16] px-5 text-white">
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#0b1525] p-6 shadow-2xl">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
            Monobloc / PROFILE TEST
          </p>

          <h1 className="mt-2 text-2xl font-bold">
            Monobloc Account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create and test your Monobloc profile.
          </p>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
          />

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
              @
            </span>

            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value.replace(/^@/, "")
                )
              }
              className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-9 pr-4 text-sm outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
          />

          <button
            onClick={signUp}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3 text-sm font-bold"
          >
            Create Account
          </button>

          <button
            onClick={signIn}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 text-sm font-semibold text-slate-300"
          >
            Sign In
          </button>

          <button
            onClick={createProfile}
            className="w-full rounded-xl border border-cyan-400/20 bg-cyan-400/[0.05] py-3 text-sm font-semibold text-cyan-300"
          >
            Create Monobloc Profile
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={checkUser}
              className="rounded-xl border border-white/10 py-3 text-xs text-slate-400"
            >
              Check User
            </button>

            <button
              onClick={checkProfile}
              className="rounded-xl border border-white/10 py-3 text-xs text-slate-400"
            >
              Check Profile
            </button>
          </div>

          <button
            onClick={signOut}
            className="w-full rounded-xl border border-white/10 py-3 text-xs text-slate-500"
          >
            Sign Out
          </button>
        </div>

        {message && (
          <div className="mt-5 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.04] p-3 text-xs text-slate-400">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}