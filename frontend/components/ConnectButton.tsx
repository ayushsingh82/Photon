"use client";

import { useState } from "react";
import { useSession } from "@/store/session";

/**
 * Auth entry point. When signed out it reveals an email-OTP / Google popover;
 * when signed in it shows the Universal Account address and unified balance.
 */
export function ConnectButton() {
  const { user, status, balanceUsd, loginWithEmail, loginWithGoogle, logout } =
    useSession();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) {
    return (
      <div className="flex items-center gap-3 rounded-full border border-line bg-white/[0.02] px-3 py-1.5">
        <div className="leading-tight text-right">
          <div className="text-[10px] uppercase tracking-widest text-muted">
            {balanceUsd === null
              ? "Universal Account"
              : `$${balanceUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          </div>
          <div className="font-mono text-xs">
            {user.address.slice(0, 6)}…{user.address.slice(-4)}
          </div>
        </div>
        <button
          onClick={() => void logout()}
          className="rounded-full border border-line px-3 py-1 text-xs transition hover:border-brand hover:text-fg"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={status === "connecting"}
        className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white shadow-glow transition hover:brightness-110 disabled:opacity-50"
      >
        {status === "connecting" ? "Connecting…" : "Connect"}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-line bg-bg p-4 shadow-glow">
          <p className="text-xs uppercase tracking-widest text-muted">
            Sign in
          </p>
          <form
            className="mt-3 flex flex-col gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!email) return;
              setBusy(true);
              try {
                await loginWithEmail(email);
                setOpen(false);
              } finally {
                setBusy(false);
              }
            }}
          >
            <input
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-line bg-white/[0.02] px-3 py-2 text-sm outline-none focus:border-brand"
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-brand py-2 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-50"
            >
              {busy ? "Sending code…" : "Continue with email"}
            </button>
          </form>
          <div className="my-3 flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted">
            <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
          </div>
          <button
            onClick={() => void loginWithGoogle()}
            className="w-full rounded-xl border border-line py-2 text-sm transition hover:border-brand hover:text-fg"
          >
            Continue with Google
          </button>
          <p className="mt-3 text-[10px] leading-relaxed text-muted">
            Seedless login by Magic. Your Universal Account is provisioned by
            Particle Network on first sign-in.
          </p>
        </div>
      )}
    </div>
  );
}
