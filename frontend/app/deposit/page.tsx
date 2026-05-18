"use client";

import { useMemo, useState } from "react";

const assets = ["USDC", "USDT", "ETH"] as const;
const chains = ["Ethereum", "Base", "Polygon", "Optimism", "Arbitrum"] as const;

type Asset = (typeof assets)[number];

// Mocked best route per asset until APY oracle is wired up.
const bestRoute: Record<Asset, { chain: string; protocol: string; apy: number }> = {
  USDC: { chain: "Arbitrum", protocol: "Aave v3", apy: 4.81 },
  USDT: { chain: "Arbitrum", protocol: "Aave v3", apy: 5.12 },
  ETH: { chain: "Arbitrum", protocol: "Morpho Blue", apy: 3.92 },
};

export default function DepositPage() {
  const [asset, setAsset] = useState<Asset>("USDC");
  const [fromChain, setFromChain] = useState<string>("Base");
  const [amount, setAmount] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const route = bestRoute[asset];
  const yearly = useMemo(() => {
    const n = parseFloat(amount);
    if (!n || isNaN(n)) return 0;
    return n * (route.apy / 100);
  }, [amount, route.apy]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-cursive text-3xl text-brand">one click, max yield</p>
      <h1 className="mt-2 text-4xl font-semibold">Deposit</h1>
      <p className="mt-3 text-muted">
        We&apos;ll automatically route your funds from {fromChain} to the
        highest-yielding pool. No bridging, no gas tokens.
      </p>

      <div className="mt-10 rounded-3xl border border-line bg-white/[0.02] p-6 md:p-8">
        {/* Asset selector */}
        <label className="block text-xs uppercase tracking-widest text-muted">
          Asset
        </label>
        <div className="mt-3 flex gap-2">
          {assets.map((a) => (
            <button
              key={a}
              onClick={() => setAsset(a)}
              className={`flex-1 rounded-2xl border px-4 py-3 text-base transition ${
                asset === a
                  ? "border-brand bg-brand/10 text-fg shadow-glow"
                  : "border-line text-muted hover:border-brand/50 hover:text-fg"
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        {/* Amount */}
        <label className="mt-8 block text-xs uppercase tracking-widest text-muted">
          Amount
        </label>
        <div className="mt-3 flex items-center justify-between rounded-2xl border border-line bg-bg px-5 py-4">
          <input
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            className="w-full bg-transparent text-3xl font-medium outline-none placeholder:text-muted/40"
          />
          <span className="ml-3 text-base text-muted">{asset}</span>
        </div>

        {/* From chain */}
        <label className="mt-8 block text-xs uppercase tracking-widest text-muted">
          From chain
        </label>
        <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-5">
          {chains.map((c) => (
            <button
              key={c}
              onClick={() => setFromChain(c)}
              className={`rounded-xl border px-3 py-2 text-sm transition ${
                fromChain === c
                  ? "border-brand text-fg"
                  : "border-line text-muted hover:border-brand/50 hover:text-fg"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Route preview */}
        <div className="mt-8 rounded-2xl border border-line p-5">
          <div className="text-xs uppercase tracking-widest text-muted">
            Best route
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="text-lg">
                {fromChain} → <span className="text-brand">{route.chain}</span>
              </div>
              <div className="text-sm text-muted">
                Supply to {route.protocol}
              </div>
            </div>
            <div className="text-right">
              <div className="font-cursive text-4xl text-brand">
                {route.apy.toFixed(2)}%
              </div>
              <div className="text-xs text-muted">APY</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-line pt-4 text-sm">
            <Row label="You deposit">
              {amount || "0"} {asset}
            </Row>
            <Row label="Est. yearly">
              <span className="text-brand">
                {yearly.toLocaleString(undefined, {
                  maximumFractionDigits: 4,
                })}{" "}
                {asset}
              </span>
            </Row>
            <Row label="Gas">Sponsored · paid in {asset}</Row>
            <Row label="Bridge">Auto · Particle UA</Row>
          </div>
        </div>

        {/* CTA */}
        <button
          disabled={!amount || parseFloat(amount) <= 0}
          onClick={() => setSubmitted(true)}
          className="mt-8 w-full rounded-full bg-brand py-4 text-base font-medium text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          {submitted
            ? "Routing your deposit…"
            : `Deposit ${amount || "0"} ${asset}`}
        </button>

        {submitted && (
          <p className="mt-3 text-center text-sm text-muted">
            (Demo) In production this builds a Universal Transaction via
            Particle and confirms on {route.chain}.
          </p>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-muted">
        {label}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}
