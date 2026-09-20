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

import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [agree, setAgree] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================================
  // CREATE ACCOUNT
  // =========================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // =========================================
    // BASIC VALIDATION
    // =========================================

    if (!cleanName) {
      setError("Please enter your name.");
      return;
    }

    if (!cleanEmail) {
      setError("Please enter your email.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Your password must be at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    if (!agree) {
      setError(
        "Please accept the Terms of Service and Privacy Policy."
      );
      return;
    }

    setLoading(true);

    try {
      // =========================================
      // CREATE SUPABASE ACCOUNT
      // =========================================

      const {
        data,
        error: signupError,
      } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: cleanName,
          },
        },
      });

      // =========================================
      // SIGNUP ERROR
      // =========================================

      if (signupError) {
        console.error("Signup error:", signupError);

        const message = signupError.message.toLowerCase();

        if (
          message.includes("already registered") ||
          message.includes("already exists")
        ) {
          setError(
            "An account with this email already exists. Try signing in instead."
          );
        } else if (message.includes("password")) {
          setError(signupError.message);
        } else {
          setError(signupError.message);
        }

        setLoading(false);
        return;
      }

      // =========================================
      // MAKE SURE USER WAS CREATED
      // =========================================

      if (!data.user) {
        setError(
          "Account creation failed. Please try again."
        );

        setLoading(false);
        return;
      }

      // =========================================
      // GENERATE USERNAME
      // =========================================

      const emailUsername = cleanEmail
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "")
        .slice(0, 20);

      const fallbackUsername =
        emailUsername ||
        `Monoblocuser${Date.now().toString().slice(-6)}`;

      const initials = cleanName
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();

      // =========================================
      // CREATE Monobloc PROFILE
      // =========================================

      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          name: cleanName,
          username: fallbackUsername,
          initials:
            initials ||
            cleanName.charAt(0).toUpperCase(),
          role: "Connection",
          status: "online",
        });

      // =========================================
      // PROFILE ERROR
      // =========================================

      if (profileError) {
        console.error(
          "Profile creation error:",
          profileError
        );

        if (profileError.code === "23505") {
          setError(
            "Your account was created, but that username already exists. You can continue and fix your profile later."
          );
        } else {
          setError(
            `Account created, but your Monobloc profile could not be created: ${profileError.message}`
          );
        }

        setLoading(false);
        return;
      }

      // =========================================
      // EMAIL CONFIRMATION REQUIRED
      // =========================================

      if (data.user && !data.session) {
        setSuccess(
          "Account created! Check your email to confirm your Monobloc account."
        );

        setLoading(false);
        return;
      }

      // =========================================
      // FULL SUCCESS
      // =========================================

      if (data.user && data.session) {
        setSuccess(
          "Account created successfully! Welcome to Monobloc."
        );

        setTimeout(() => {
          router.replace("/");
          router.refresh();
        }, 500);

        return;
      }

      setLoading(false);
    } catch (err) {
      console.error("Unexpected signup error:", err);

      setError(
        "Something went wrong while creating your account. Please try again."
      );

      setLoading(false);
    }
  };

  // =========================================
  // GOOGLE SIGNUP / LOGIN
  // =========================================

  const handleGoogleSignup = async () => {
    if (loading) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { error: googleError } =
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo:
              `${window.location.origin}/auth/callback`,
          },
        });

      if (googleError) {
        console.error(
          "Google signup error:",
          googleError
        );

        setError(googleError.message);
        setLoading(false);
      }
    } catch (err) {
      console.error(
        "Unexpected Google error:",
        err
      );

      setError(
        "Unable to continue with Google."
      );

      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070707] px-5 py-10 font-sans text-white antialiased sm:px-6">

      {/* =========================================
          AMBIENT BACKGROUND
      ========================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div
          className="
            absolute
            left-[5%]
            top-[10%]
            h-72
            w-72
            rounded-full
            bg-purple-500/[0.07]
            blur-[130px]
          "
        />

        <div
          className="
            absolute
            bottom-[5%]
            right-[5%]
            h-96
            w-96
            rounded-full
            bg-violet-500/[0.06]
            blur-[150px]
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-72
            w-72
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-purple-500/[0.035]
            blur-[140px]
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
              border
              border-purple-400/20
              bg-purple-500/[0.12]
              shadow-[0_0_40px_rgba(168,85,247,0.12)]
            "
          >
            <Sparkles
              size={27}
              className="text-purple-300"
            />
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight">
            Monobloc
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
            rounded-[28px]
            border
            border-white/10
            bg-[#101010]/95
            p-7
            shadow-[0_25px_80px_rgba(0,0,0,0.45)]
            backdrop-blur-2xl
            sm:p-9
          "
        >

          {/* HEADING */}

          <div className="mb-7">

            <div className="mb-3 flex items-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-purple-400">
                Monobloc / ACCOUNT
              </span>

            </div>

            <h2 className="text-3xl font-bold tracking-tight">
              Create your account.
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your workspace is waiting. Let's build something.
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div
              className="
                mb-5
                rounded-xl
                border
                border-red-400/20
                bg-red-400/[0.07]
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

          {/* SUCCESS */}

          {success && (
            <div
              className="
                mb-5
                rounded-xl
                border
                border-purple-400/20
                bg-purple-400/[0.06]
                px-4
                py-3
                text-sm
                leading-5
                text-purple-300
              "
            >
              {success}
            </div>
          )}

          {/* GOOGLE */}

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
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
              bg-white/[0.035]
              text-sm
              font-semibold
              text-white
              transition
              hover:border-white/20
              hover:bg-white/[0.06]
              disabled:cursor-not-allowed
              disabled:opacity-50
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

                Connecting...
              </>
            ) : (
              <>
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
              </>
            )}

          </button>

          {/* DIVIDER */}

          <div className="my-6 flex items-center gap-4">

            <div className="h-px flex-1 bg-white/[0.08]" />

            <span className="text-[10px] font-medium tracking-widest text-slate-700">
              OR
            </span>

            <div className="h-px flex-1 bg-white/[0.08]" />

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
                className="
                  mb-2
                  block
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  text-slate-400
                "
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
                  bg-white/[0.025]
                  px-4
                  transition
                  focus-within:border-purple-400/40
                  focus-within:bg-purple-400/[0.025]
                "
              >

                <User
                  size={17}
                  className="mr-3 shrink-0 text-slate-600"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="What should we call you?"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="
                    w-full
                    bg-transparent
                    text-sm
                    font-medium
                    text-white
                    outline-none
                    placeholder:text-slate-700
                  "
                />

              </div>

            </div>

            {/* EMAIL */}

            <div>

              <label
                htmlFor="email"
                className="
                  mb-2
                  block
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  text-slate-400
                "
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
                  bg-white/[0.025]
                  px-4
                  transition
                  focus-within:border-purple-400/40
                  focus-within:bg-purple-400/[0.025]
                "
              >

                <Mail
                  size={17}
                  className="mr-3 shrink-0 text-slate-600"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="
                    w-full
                    bg-transparent
                    text-sm
                    font-medium
                    text-white
                    outline-none
                    placeholder:text-slate-700
                  "
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div>

              <label
                htmlFor="password"
                className="
                  mb-2
                  block
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  text-slate-400
                "
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
                  bg-white/[0.025]
                  px-4
                  transition
                  focus-within:border-purple-400/40
                  focus-within:bg-purple-400/[0.025]
                "
              >

                <Lock
                  size={17}
                  className="mr-3 shrink-0 text-slate-600"
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
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="
                    w-full
                    bg-transparent
                    text-sm
                    font-medium
                    text-white
                    outline-none
                    placeholder:text-slate-700
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                  className="
                    ml-2
                    shrink-0
                    text-slate-600
                    transition
                    hover:text-purple-300
                  "
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>

              <p className="mt-1.5 text-[10px] text-slate-700">
                Use at least 8 characters.
              </p>

            </div>

            {/* CONFIRM PASSWORD */}

            <div>

              <label
                htmlFor="confirmPassword"
                className="
                  mb-2
                  block
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  text-slate-400
                "
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
                  bg-white/[0.025]
                  px-4
                  transition
                  focus-within:border-purple-400/40
                  focus-within:bg-purple-400/[0.025]
                "
              >

                <Lock
                  size={17}
                  className="mr-3 shrink-0 text-slate-600"
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
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    bg-transparent
                    text-sm
                    font-medium
                    text-white
                    outline-none
                    placeholder:text-slate-700
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
                    text-slate-600
                    transition
                    hover:text-purple-300
                  "
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
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
                  accent-purple-500
                "
              />

              <span className="text-xs leading-5 text-slate-600">

                I agree to Monobloc's{" "}

                <Link
                  href="/terms"
                  className="
                    font-medium
                    text-purple-400
                    transition
                    hover:text-purple-300
                  "
                >
                  Terms of Service
                </Link>{" "}

                and{" "}

                <Link
                  href="/privacy"
                  className="
                    font-medium
                    text-purple-400
                    transition
                    hover:text-purple-300
                  "
                >
                  Privacy Policy
                </Link>
                .

              </span>

            </label>

            {/* CREATE ACCOUNT */}

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
                bg-purple-500
                px-5
                text-sm
                font-bold
                text-white
                shadow-[0_0_25px_rgba(168,85,247,0.14)]
                transition-all
                duration-300
                hover:bg-purple-400
                hover:shadow-[0_0_35px_rgba(168,85,247,0.22)]
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

                  Creating account...
                </>
              ) : (
                <>
                  Create account

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

          {/* SECURITY */}

          <div
            className="
              mt-5
              flex
              items-center
              justify-center
              gap-2
              text-xs
              text-slate-700
            "
          >
            <ShieldCheck size={14} />

            Your data stays secure
          </div>

        </div>

        {/* LOGIN LINK */}

        <p className="mt-6 text-center text-sm text-slate-500">

          Already have a Monobloc account?{" "}

          <Link
            href="/login"
            className="
              font-semibold
              text-purple-400
              transition
              hover:text-purple-300
            "
          >
            Sign in
          </Link>

        </p>

        <p
          className="
            mt-7
            text-center
            text-[10px]
            font-medium
            uppercase
            tracking-[0.25em]
            text-slate-700
          "
        >
          Monobloc · Built for what comes next
        </p>

      </div>

    </main>
  );
}