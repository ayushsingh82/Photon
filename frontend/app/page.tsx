import Link from "next/link";

const features = [
  {
    title: "Social login",
    body: "Magic Labs. Sign in with email, Google, or X. No seed phrase to lose.",
  },
  {
    title: "One universal account",
    body: "Particle Network gives you a single balance across every chain you hold.",
  },
  {
    title: "Gasless",
    body: "Pay gas in the asset you deposit. Never hold native tokens again.",
  },
  {
    title: "Auto-routed yield",
    body: "We scan Aave + Morpho across chains and send your funds to the winner.",
  },
];

const supportedChains = ["Ethereum", "Base", "Polygon", "Optimism", "Arbitrum"];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="glow relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 pt-24 pb-32 text-center">
          <p className="font-cursive text-3xl text-brand">
            yield, the easy way
          </p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight md:text-7xl">
            DeFi yield in <span className="brand-underline">one click.</span>
            <br />
            From any chain. With any asset.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            Deposit USDC, USDT, or ETH from any chain. We bridge, supply, and
            optimize across Aave and Morpho — settled on Arbitrum. No gas
            tokens. No seed phrases. No nonsense.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/deposit"
              className="rounded-full bg-brand px-6 py-3 text-base font-medium text-white shadow-glow transition hover:brightness-110"
            >
              Start earning →
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-line px-6 py-3 text-base text-fg transition hover:border-brand"
            >
              View dashboard
            </Link>
          </div>

          <div className="mt-16 text-xs uppercase tracking-widest text-muted">
            Supported chains
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {supportedChains.map((c) => (
              <span
                key={c}
                className="rounded-full border border-line px-4 py-1.5 text-sm text-fg/80"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="font-cursive text-2xl text-brand">why us</p>
        <h2 className="mt-2 text-4xl font-semibold">
          The whole flow, abstracted away.
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-line bg-white/[0.02] p-6 transition hover:border-brand"
            >
              <h3 className="text-xl font-medium">{f.title}</h3>
              <p className="mt-2 text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="font-cursive text-2xl text-brand">how it works</p>
        <h2 className="mt-2 text-4xl font-semibold">
          Four steps. None of them yours.
        </h2>

        <ol className="mt-12 grid gap-6 md:grid-cols-4">
          {[
            { n: "01", t: "Sign in", b: "Email or social — Magic Labs." },
            {
              n: "02",
              t: "Universal Account",
              b: "Particle provisions a smart account across chains.",
            },
            {
              n: "03",
              t: "Deposit",
              b: "Pick an asset. We find the best APY.",
            },
            {
              n: "04",
              t: "Earn",
              b: "Funds route to Aave / Morpho on Arbitrum.",
            },
          ].map((s) => (
            <li
              key={s.n}
              className="rounded-2xl border border-line p-6 transition hover:border-brand"
            >
              <div className="text-brand font-cursive text-3xl">{s.n}</div>
              <div className="mt-2 text-lg font-medium">{s.t}</div>
              <div className="mt-1 text-sm text-muted">{s.b}</div>
            </li>
          ))}
        </ol>

        <div className="mt-12 text-center">
          <Link
            href="/deposit"
            className="rounded-full bg-brand px-6 py-3 text-base font-medium text-white shadow-glow transition hover:brightness-110"
          >
            Try the demo
          </Link>
        </div>
      </section>
    </div>
  );
}
