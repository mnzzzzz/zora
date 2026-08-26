"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const ALLOWED_EMAILS = [
  "monicca.yuvaraj@gmail.com",
  "un4188099@gmail.com",
];

const CORRECT_PASSWORD = "nmdt@2026";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Always reset previous error
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    /*
     * IMPORTANT:
     * Do not redirect before BOTH credentials
     * have been verified.
     */

    // Check email
    const emailIsAllowed =
      ALLOWED_EMAILS.includes(cleanEmail);

    if (!emailIsAllowed) {
      setLoading(false);
      setError(
        "This email is not authorized to access Zora."
      );
      return;
    }

    // Check password
    if (password !== CORRECT_PASSWORD) {
      setLoading(false);
      setError("Incorrect password.");
      return;
    }

    /*
     * At this point:
     *
     * email = one of the two allowed emails
     * password = nmdt@2026
     *
     * ONLY NOW are we allowed to log the user in.
     */

    setLoading(true);

    // Remove any old authentication state first
    localStorage.removeItem("zora-authenticated");
    localStorage.removeItem("zora-user-email");

    sessionStorage.removeItem("zora-authenticated");
    sessionStorage.removeItem("zora-user-email");

    // Store successful login
    if (remember) {
      localStorage.setItem(
        "zora-authenticated",
        "true"
      );

      localStorage.setItem(
        "zora-user-email",
        cleanEmail
      );
    } else {
      sessionStorage.setItem(
        "zora-authenticated",
        "true"
      );

      sessionStorage.setItem(
        "zora-user-email",
        cleanEmail
      );
    }

    // Successful login ONLY
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
            top-[10%]
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
          style={{
            animationDelay: "2s",
          }}
        />

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-48
            w-48
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-violet-500/10
            blur-[110px]
          "
        />

      </div>

      {/* =========================================
          LOGIN WRAPPER
      ========================================= */}

      <div className="relative z-10 w-full max-w-[460px]">

        {/* =========================================
            LOGO
        ========================================= */}

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
            LOGIN CARD
        ========================================= */}

        <div
          className="
            rounded-[32px]
            border
            border-white/10
            bg-[#0b1422]/80
            p-7
            shadow-[0_25px_80px_rgba(0,0,0,0.4)]
            backdrop-blur-2xl
            sm:p-9
          "
        >

          {/* HEADING */}

          <div className="mb-7">

            <h2 className="text-3xl font-bold tracking-tight">
              Welcome back.
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Sign in to continue where you left off.
            </p>

          </div>

          {/* =========================================
              FORM
          ========================================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
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

              <div className="mb-2 flex items-center justify-between">

                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="
                    text-xs
                    text-cyan-400
                    transition
                    hover:text-cyan-300
                  "
                >
                  Forgot password?
                </Link>

              </div>

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
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
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
                    setShowPassword(
                      (current) => !current
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

            </div>

            {/* =========================================
                REMEMBER ME
            ========================================= */}

            <label className="flex cursor-pointer items-center gap-3">

              <input
                type="checkbox"
                checked={remember}
                onChange={(e) =>
                  setRemember(e.target.checked)
                }
                className="
                  h-4
                  w-4
                  rounded
                  border-white/20
                  bg-white/5
                  accent-cyan-400
                "
              />

              <span className="text-sm text-slate-400">
                Remember me
              </span>

            </label>

            {/* =========================================
                ERROR
            ========================================= */}

            {error && (
              <div
                className="
                  rounded-xl
                  border
                  border-red-400/20
                  bg-red-400/10
                  px-4
                  py-3
                  text-sm
                  leading-5
                  text-red-300
                "
              >
                {error}
              </div>
            )}

            {/* =========================================
                SIGN IN BUTTON
            ========================================= */}

            <button
              type="submit"
              disabled={loading}
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
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {loading ? (
                <>
                  <span
                    className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-white/30
                      border-t-white
                    "
                  />

                  Signing in...
                </>
              ) : (
                <>
                  Sign in

                  <ArrowRight
                    size={17}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </>
              )}

            </button>

          </form>

          {/* =========================================
              SECURITY
          ========================================= */}

          <div
            className="
              mt-5
              flex
              items-center
              justify-center
              gap-2
              text-xs
              text-slate-600
            "
          >
            <ShieldCheck size={14} />

            Your data stays secure
          </div>

        </div>

        {/* =========================================
            SIGNUP
        ========================================= */}

        <p className="mt-6 text-center text-sm text-slate-500">

          Don't have a Zora account?{" "}

          <Link
            href="/signup"
            className="
              font-medium
              text-cyan-400
              transition
              hover:text-cyan-300
            "
          >
            Create one
          </Link>

        </p>

        <p className="mt-7 text-center text-[11px] uppercase tracking-[0.25em] text-slate-700">
          Zora · Built for what comes next
        </p>

      </div>

    </main>
  );
}