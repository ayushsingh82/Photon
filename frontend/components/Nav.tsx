import Link from "next/link";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-cursive text-3xl text-brand">yield</span>
          <span className="text-xs text-muted">/ cross-chain</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
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
            Launch app
          </Link>
        </nav>
      </div>
    </header>
  );
}
