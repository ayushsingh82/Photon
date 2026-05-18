import Link from "next/link";
import { HeroPreview } from "@/components/HeroPreview";
import { PartnersStrip } from "@/components/PartnersStrip";
import { StatsBar } from "@/components/StatsBar";
import { Testimonials } from "@/components/Testimonials";
import {
  ChainLogo,
  ChainStack,
  ProtocolLogo,
  TokenLogo,
} from "@/components/Logo";

const features = [
  {
    title: "Social login",
    body: "Magic Labs. Sign in with email, Google, or X. No seed phrase to lose.",
    icon: <ProtocolLogo slug="magic" size="lg" />,
  },
  {
    title: "One universal account",
    body: "Particle Network gives you a single balance across every chain you hold.",
    icon: <ProtocolLogo slug="particle" size="lg" />,
  },
  {
    title: "Aave & Morpho, blended",
    body: "We watch APYs on both, on every chain, and put your funds wherever pays most.",
    icon: (
      <div className="flex -space-x-2">
        <ProtocolLogo slug="aave" size="lg" />
        <ProtocolLogo slug="morpho" size="lg" />
      </div>
    ),
  },
  {
    title: "Settled on Arbitrum",
    body: "Deep liquidity, sub-cent fees, instant finality. The right home for active yield.",
    icon: <ChainLogo slug="arbitrum" size="lg" />,
  },
];

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="glow relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-20 pb-24 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-xs uppercase tracking-widest text-brand">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
              Live on 5 chains
            </span>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
              <span className="font-display italic font-normal text-brand">
                Photon.
              </span>
              <br />
              The best DeFi yield,
              <br />
              in <span className="brand-underline">one click.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              Photon scans Aave and Morpho across every major chain and routes
              your deposit to the winner — automatically. Social login, no gas
              tokens, no bridging.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
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

            <div className="mt-10 flex items-center gap-4">
              <ChainStack
                slugs={["ethereum", "arbitrum", "base", "polygon", "optimism"]}
                size="sm"
              />
              <span className="text-sm text-muted">
                Deposit from any chain — we handle the rest
              </span>
            </div>
          </div>

          <div className="md:pl-6">
            <HeroPreview />
          </div>
        </div>
      </section>

      <PartnersStrip />
      <StatsBar />

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-display italic text-2xl text-brand">why photon</p>
        <h2 className="mt-2 text-4xl font-semibold">
          The whole flow, abstracted away.
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          We didn&apos;t build a new chain or a new token. We built the layer
          that makes the existing ones invisible to your users.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex gap-5 rounded-2xl border border-line bg-white/[0.02] p-6 transition hover:border-brand hover:shadow-glow"
            >
              <div>{f.icon}</div>
              <div>
                <h3 className="text-xl font-medium">{f.title}</h3>
                <p className="mt-2 text-muted">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SUPPORTED ASSETS */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-display italic text-2xl text-brand">supported assets</p>
        <h2 className="mt-2 text-4xl font-semibold">
          Stablecoins and ETH. The ones you actually hold.
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {(
            [
              { symbol: "USDC" as const, apy: "4.81%", note: "via Aave on Arbitrum" },
              { symbol: "USDT" as const, apy: "5.12%", note: "via Aave on Arbitrum" },
              { symbol: "ETH" as const, apy: "3.92%", note: "via Morpho on Arbitrum" },
            ]
          ).map((a) => (
            <div
              key={a.symbol}
              className="flex items-center justify-between rounded-2xl border border-line bg-white/[0.02] p-6 transition hover:border-brand"
            >
              <div className="flex items-center gap-4">
                <TokenLogo symbol={a.symbol} size="xl" />
                <div>
                  <div className="text-lg font-medium">{a.symbol}</div>
                  <div className="text-xs text-muted">{a.note}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-display italic text-4xl text-brand">{a.apy}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted">
                  apy
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-display italic text-2xl text-brand">how it works</p>
        <h2 className="mt-2 text-4xl font-semibold">
          Four steps. None of them yours.
        </h2>

        <ol className="mt-12 grid gap-6 md:grid-cols-4">
          {[
            {
              n: "01",
              t: "Sign in",
              b: "Email or social — Magic Labs.",
              icon: <ProtocolLogo slug="magic" size="md" />,
            },
            {
              n: "02",
              t: "Universal Account",
              b: "Particle provisions a smart account across chains.",
              icon: <ProtocolLogo slug="particle" size="md" />,
            },
            {
              n: "03",
              t: "Deposit",
              b: "Pick an asset. We find the best APY.",
              icon: <TokenLogo symbol="USDC" size="md" />,
            },
            {
              n: "04",
              t: "Earn",
              b: "Funds route to Aave / Morpho on Arbitrum.",
              icon: <ProtocolLogo slug="aave" size="md" />,
            },
          ].map((s) => (
            <li
              key={s.n}
              className="rounded-2xl border border-line p-6 transition hover:border-brand hover:shadow-glow"
            >
              <div className="flex items-center justify-between">
                <div className="font-display italic text-3xl text-brand">{s.n}</div>
                {s.icon}
              </div>
              <div className="mt-4 text-lg font-medium">{s.t}</div>
              <div className="mt-1 text-sm text-muted">{s.b}</div>
            </li>
          ))}
        </ol>
      </section>

      <Testimonials />

      {/* FINAL CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="glow relative overflow-hidden rounded-3xl border border-brand/40 p-12 text-center shadow-glow">
          <p className="font-display italic text-3xl text-brand">ready?</p>
          <h2 className="mt-2 text-4xl font-semibold md:text-5xl">
            Your first deposit takes 30 seconds.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            No download. No seed phrase. No bridge. Just yield.
          </p>
          <div className="mt-8">
            <Link
              href="/deposit"
              className="rounded-full bg-brand px-8 py-4 text-base font-medium text-white shadow-glow transition hover:brightness-110"
            >
              Launch Photon →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
