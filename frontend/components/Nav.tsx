import Link from "next/link";
import { ChainStack } from "@/components/Logo";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-2">
          <PhotonMark />
          <span className="font-display italic text-2xl text-fg transition group-hover:text-brand">
            Photon
          </span>
          <span className="ml-1 hidden rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted md:inline">
            cross-chain yield
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <div className="hidden items-center gap-2 md:flex">
            <ChainStack
              slugs={["ethereum", "arbitrum", "base", "polygon", "optimism"]}
              size="xs"
            />
            <span className="text-xs text-muted">5 chains live</span>
          </div>
          <Link
            href="/dashboard"
            className="text-muted transition hover:text-fg"
          >
            Dashboard
          </Link>
          <Link
            href="/deposit"
            className="text-muted transition hover:text-fg"
          >
            Deposit
          </Link>
          <Link
            href="/deposit"
            className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white shadow-glow transition hover:brightness-110"
          >
            Launch app →
          </Link>
        </nav>
      </div>
    </header>
  );
}

// Inline SVG mark — a stylised "photon" beam.
function PhotonMark() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className="drop-shadow-[0_0_10px_rgba(165,0,230,0.55)]"
    >
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="#A500E6" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="6" fill="url(#pg)" />
      <circle
        cx="16"
        cy="16"
        r="13"
        stroke="#A500E6"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      <path
        d="M16 2 v6 M16 24 v6 M2 16 h6 M24 16 h6"
        stroke="#A500E6"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
