import { useState } from "react";
import { motion } from "framer-motion";
import type { AuthenticatedUser } from "../types/auth";

interface Props {
  onAuthenticate: (user: AuthenticatedUser) => void;
}

type AuthMode = "login" | "register";

const createUserFromEmail = (email: string) => {
  const [namePart] = email.split("@");

  return namePart
    .split(/[._-]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
};

const AuthPage = ({ onAuthenticate }: Props) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleGoogleAuth = () => {
    onAuthenticate({
      name: "Atlas User",
      email: "atlas.user@example.com",
      provider: "google"
    });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (mode === "register" && normalizedName.length < 2) {
      setError("Enter a valid name with at least 2 characters.");
      return;
    }

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    if (normalizedPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (mode === "register" && normalizedPassword !== confirmPassword.trim()) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    onAuthenticate({
      name: mode === "register" ? normalizedName : createUserFromEmail(normalizedEmail) || "Atlas User",
      email: normalizedEmail,
      provider: "manual"
    });
  };

  return (
    <div className="auth-shell min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_36%),radial-gradient(circle_at_80%_20%,_rgba(96,165,250,0.14),_transparent_30%),linear-gradient(180deg,_rgba(15,23,42,0.9),_rgba(2,6,23,0.98))] p-8 shadow-2xl shadow-cyan-950/30 lg:p-10">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.04)_45%,transparent_60%)]" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300/80">Atlas AI</p>
            <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-tight text-white lg:text-5xl">
              A clean AI workspace for retrieval, answers, and persistent conversations.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              This frontend shell is designed like a modern AI product: clear history, focused composer, strong visual hierarchy, and an auth entry point that can later connect to real backend identity.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["Session memory", "Local chat history cards keep the experience feeling continuous."],
                ["Fast retrieval", "The interface stays centered on asking, reading, and iterating quickly."],
                ["Ready to extend", "The auth screen is UI-only now, but structured for future integration."]
              ].map(([title, description]) => (
                <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur">
                  <div className="text-sm font-semibold text-white">{title}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-400">{description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl lg:p-8"
        >
          <div className="flex rounded-2xl border border-white/10 bg-slate-900/70 p-1">
            {(["login", "register"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setMode(value);
                  setError("");
                }}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium capitalize transition ${
                  mode === value
                    ? "bg-cyan-400 text-slate-950"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                {value}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold text-white">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Continue with Google for the fastest path, or use the manual form below.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] hover:shadow-xl hover:shadow-white/10"
          >
            <span className="text-lg">G</span>
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-slate-500">
            <span className="h-px flex-1 bg-white/10" />
            or
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-4">
            {mode === "register" && (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">Full name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="Atlas User"
                />
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                placeholder="you@example.com"
                type="email"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Password</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                placeholder={mode === "login" ? "Enter your password" : "Create a password"}
                type="password"
              />
            </label>

            {mode === "register" && (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">Confirm password</span>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="Repeat your password"
                  type="password"
                />
              </label>
            )}

            {error && (
              <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px] hover:bg-cyan-300"
            >
              {mode === "login" ? "Login" : "Register"}
            </button>
          </form>
        </motion.section>
      </div>
    </div>
  );
};

export default AuthPage;
