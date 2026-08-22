"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    const formData = new FormData(e.currentTarget);

    const password = formData.get("password") as string;
    const confirmPassword =
      formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    if (!agree) {
      setError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    // Temporary signup flow.
    // Once real authentication is connected,
    // replace this with your actual signup request.
    router.push("/");
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent px-6 py-10 text-white">

      {/* =========================================
          AMBIENT BACKGROUND
      ========================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div
          className="
            absolute
            left-[8%]
            top-[15%]
            h-72
            w-72
            rounded-full
            bg-cyan-400/10
            blur-[120px]
            animate-pulse
          "
        />

        <div
          className="
            absolute
            bottom-[5%]
            right-[8%]
            h-96
            w-96
            rounded-full
            bg-blue-500/10
            blur-[140px]
            animate-pulse
          "
          style={{ animationDelay: "2s" }}
        />

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-64
            w-64
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-violet-500/10
            blur-[120px]
          "
        />

      </div>

      {/* =========================================
          SIGNUP CONTAINER
      ========================================= */}

      <div className="relative z-10 w-full max-w-[460px]">

        {/* LOGO */}

        <div className="mb-7 flex flex-col items-center">

          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-br
              from-blue-500
              via-cyan-400
              to-blue-500
              shadow-[0_0_45px_rgba(34,211,238,0.25)]
            "
          >
            <Sparkles
              size={28}
              className="text-white"
            />
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight">
            Zora
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Your AI Operating System
          </p>

        </div>

        {/* =========================================
            CARD
        ========================================= */}

        <div
          className="
            rounded-[32px]
            border
            border-white/10
            bg-[#0b1422]/75
            p-7
            shadow-[0_25px_80px_rgba(0,0,0,0.35)]
            backdrop-blur-2xl
            sm:p-9
          "
        >

          {/* HEADING */}

          <div className="mb-7">

            <h2 className="text-3xl font-bold tracking-tight">
              Create your account.
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Your workspace is waiting. Let's build something.
            </p>

          </div>

          {/* GOOGLE */}

          <button
            type="button"
            className="
              flex
              h-12
              w-full
              items-center
              justify-center
              gap-3
              rounded-xl
              border
              border-white/10
              bg-white/[0.04]
              text-sm
              font-medium
              text-white
              transition
              hover:border-white/20
              hover:bg-white/[0.07]
            "
          >
            <span
              className="
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                bg-white
                text-xs
                font-bold
                text-slate-900
              "
            >
              G
            </span>

            Continue with Google
          </button>

          {/* DIVIDER */}

          <div className="my-6 flex items-center gap-4">

            <div className="h-px flex-1 bg-white/10" />

            <span className="text-xs text-slate-600">
              OR
            </span>

            <div className="h-px flex-1 bg-white/10" />

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* NAME */}

            <div>

              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Your name
              </label>

              <div
                className="
                  flex
                  h-12
                  items-center
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.035]
                  px-4
                  transition
                  focus-within:border-cyan-400/40
                  focus-within:bg-cyan-400/[0.025]
                "
              >

                <User
                  size={18}
                  className="mr-3 shrink-0 text-slate-500"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="What should we call you?"
                  className="
                    w-full
                    bg-transparent
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-slate-600
                  "
                />

              </div>

            </div>

            {/* EMAIL */}

            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email
              </label>

              <div
                className="
                  flex
                  h-12
                  items-center
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.035]
                  px-4
                  transition
                  focus-within:border-cyan-400/40
                  focus-within:bg-cyan-400/[0.025]
                "
              >

                <Mail
                  size={18}
                  className="mr-3 shrink-0 text-slate-500"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="
                    w-full
                    bg-transparent
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-slate-600
                  "
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div>

              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Password
              </label>

              <div
                className="
                  flex
                  h-12
                  items-center
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.035]
                  px-4
                  transition
                  focus-within:border-cyan-400/40
                  focus-within:bg-cyan-400/[0.025]
                "
              >

                <Lock
                  size={18}
                  className="mr-3 shrink-0 text-slate-500"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  className="
                    w-full
                    bg-transparent
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-slate-600
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  className="
                    ml-2
                    shrink-0
                    text-slate-500
                    transition
                    hover:text-white
                  "
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

              <p className="mt-1.5 text-[11px] text-slate-600">
                Use at least 8 characters.
              </p>

            </div>

            {/* CONFIRM PASSWORD */}

            <div>

              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Confirm password
              </label>

              <div
                className="
                  flex
                  h-12
                  items-center
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.035]
                  px-4
                  transition
                  focus-within:border-cyan-400/40
                  focus-within:bg-cyan-400/[0.025]
                "
              >

                <Lock
                  size={18}
                  className="mr-3 shrink-0 text-slate-500"
                />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Enter it again"
                  className="
                    w-full
                    bg-transparent
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-slate-600
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (value) => !value
                    )
                  }
                  className="
                    ml-2
                    shrink-0
                    text-slate-500
                    transition
                    hover:text-white
                  "
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* TERMS */}

            <label className="flex cursor-pointer items-start gap-3 pt-1">

              <input
                type="checkbox"
                required
                checked={agree}
                onChange={(e) =>
                  setAgree(e.target.checked)
                }
                className="
                  mt-0.5
                  h-4
                  w-4
                  shrink-0
                  rounded
                  border-white/20
                  bg-white/5
                  accent-cyan-400
                "
              />

              <span className="text-xs leading-5 text-slate-500">
                I agree to Zora's{" "}
                <Link
                  href="/terms"
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  Privacy Policy
                </Link>
                .
              </span>

            </label>

            {/* ERROR */}

            {error && (
              <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* CREATE ACCOUNT */}

            <button
              type="submit"
              className="
                group
                flex
                h-13
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-blue-500
                via-cyan-400
                to-blue-500
                bg-[length:200%_100%]
                px-5
                text-sm
                font-bold
                text-white
                shadow-[0_0_30px_rgba(34,211,238,0.15)]
                transition-all
                duration-300
                hover:bg-right
                hover:shadow-[0_0_40px_rgba(34,211,238,0.25)]
              "
            >
              Create account

              <ArrowRight
                size={17}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </button>

          </form>

          {/* SECURITY */}

          <div
            className="
              mt-5
              flex
              items-center
              justify-center
              gap-2
              text-xs
              text-slate-60
            "

          >
            <ShieldCheck size={14} />

            Your data stays secure
          </div>

        </div>

        {/* LOGIN LINK */}

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have a Zora account?{" "}
          <Link
            href="/login"
            className="
              font-medium
              text-cyan-400
              transition
              hover:text-cyan-300
            "
          >
            Sign in
          </Link>
        </p>

        <p className="mt-7 text-center text-[11px] uppercase tracking-[0.25em] text-slate-700">
          Zora · Built for what comes next
        </p>

      </div>
    </main>
  );
}