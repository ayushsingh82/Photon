"use client";

import { useMemo, useState } from "react";
import { ChainLogo, ProtocolLogo, TokenLogo } from "@/components/Logo";
import type { ChainSlug, TokenSymbol } from "@/lib/assets";

const assets: TokenSymbol[] = ["USDC", "USDT", "ETH"];
const chains: ChainSlug[] = [
  "ethereum",
  "base",
  "polygon",
  "optimism",
  "arbitrum",
];

type ProtocolSlug = "aave" | "morpho";
const bestRoute: Record<
  TokenSymbol,
  { chain: ChainSlug; protocol: ProtocolSlug; protocolName: string; apy: number }
> = {
  USDC: { chain: "arbitrum", protocol: "aave", protocolName: "Aave v3", apy: 4.81 },
  USDT: { chain: "arbitrum", protocol: "aave", protocolName: "Aave v3", apy: 5.12 },
  ETH: { chain: "arbitrum", protocol: "morpho", protocolName: "Morpho Blue", apy: 3.92 },
};

export default function DepositPage() {
  const [asset, setAsset] = useState<TokenSymbol>("USDC");
  const [fromChain, setFromChain] = useState<ChainSlug>("base");
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
      <p className="font-display italic text-3xl text-brand">one click, max yield</p>
      <h1 className="mt-2 text-4xl font-semibold">Deposit</h1>
      <p className="mt-3 text-muted">
        We&apos;ll automatically route your funds from{" "}
        <span className="capitalize text-fg">{fromChain}</span> to the
        highest-yielding pool. No bridging, no gas tokens.
      </p>

      <div className="mt-10 rounded-3xl border border-line bg-white/[0.02] p-6 md:p-8">
        {/* Asset selector */}
        <Label>Asset</Label>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {assets.map((a) => (
            <button
              key={a}
              onClick={() => setAsset(a)}
              className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-base transition ${
                asset === a
                  ? "border-brand bg-brand/10 text-fg shadow-glow"
                  : "border-line text-muted hover:border-brand/50 hover:text-fg"
              }`}
            >
              <TokenLogo symbol={a} size="sm" />
              <span>{a}</span>
            </button>
          ))}
        </div>

        {/* Amount */}
        <Label className="mt-8">Amount</Label>
        <div className="mt-3 flex items-center justify-between rounded-2xl border border-line bg-bg px-5 py-4">
          <input
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            className="w-full bg-transparent text-3xl font-medium outline-none placeholder:text-muted/40"
          />
          <div className="ml-3 flex items-center gap-2 rounded-full border border-line px-3 py-1.5">
            <TokenLogo symbol={asset} size="xs" />
            <span className="text-sm">{asset}</span>
          </div>
        </div>
        <div className="mt-2 flex justify-end gap-2 text-xs text-muted">
          {["25%", "50%", "MAX"].map((q) => (
            <button
              key={q}
              className="rounded-full border border-line px-2 py-0.5 hover:border-brand hover:text-fg"
            >
              {q}
            </button>
          ))}
        </div>

        {/* From chain */}
        <Label className="mt-8">From chain</Label>
        <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-5">
          {chains.map((c) => (
            <button
              key={c}
              onClick={() => setFromChain(c)}
              className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm capitalize transition ${
                fromChain === c
                  ? "border-brand text-fg"
                  : "border-line text-muted hover:border-brand/50 hover:text-fg"
              }`}
            >
              <ChainLogo slug={c} size="xs" />
              <span>{c}</span>
            </button>
          ))}
        </div>

        {/* Route preview */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-brand/40 bg-brand/[0.04] shadow-glow">
          <div className="border-b border-brand/20 px-5 py-3 text-xs uppercase tracking-widest text-brand">
            Best route · auto-found
          </div>

          <div className="p-5">
            {/* Route visualisation: from → bridge → protocol */}
            <div className="flex items-center justify-between gap-4">
              <RouteNode
                title={fromChain}
                subtitle="From"
                icon={<ChainLogo slug={fromChain} size="lg" />}
              />
              <RouteArrow label="Particle UA" />
              <RouteNode
                title={route.chain}
                subtitle="Settle on"
                icon={<ChainLogo slug={route.chain} size="lg" />}
              />
              <RouteArrow label={`${route.apy.toFixed(2)}% APY`} accent />
              <RouteNode
                title={route.protocolName}
                subtitle="Supply to"
                icon={<ProtocolLogo slug={route.protocol} size="lg" />}
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-brand/20 pt-4 text-sm md:grid-cols-4">
              <Row label="You deposit">
                <div className="flex items-center gap-2">
                  <TokenLogo symbol={asset} size="xs" />
                  {amount || "0"} {asset}
                </div>
              </Row>
              <Row label="Est. yearly">
                <span className="text-brand">
                  +{yearly.toLocaleString(undefined, { maximumFractionDigits: 4 })}{" "}
                  {asset}
                </span>
              </Row>
              <Row label="Gas">Sponsored · paid in {asset}</Row>
              <Row label="Bridge">Auto · Particle UA</Row>
            </div>
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
            : `Deposit ${amount || "0"} ${asset} →`}
        </button>

        {submitted && (
          <p className="mt-3 text-center text-sm text-muted">
            (Demo) In production this builds a Universal Transaction via
            Particle and confirms on <span className="capitalize text-fg">{route.chain}</span>.
          </p>
        )}
      </div>

      {/* trust strip */}
      <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-line bg-white/[0.02] p-6 md:flex-row md:justify-between">
        <div className="text-xs uppercase tracking-widest text-muted">
          Funds settle directly into
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <ProtocolLogo slug="aave" size="sm" />
            <span className="text-sm text-fg/80">Aave v3</span>
          </div>
          <div className="flex items-center gap-2">
            <ProtocolLogo slug="morpho" size="sm" />
            <span className="text-sm text-fg/80">Morpho Blue</span>
          </div>
          <div className="flex items-center gap-2">
            <ChainLogo slug="arbitrum" size="sm" />
            <span className="text-sm text-fg/80">Arbitrum</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      className={`block text-xs uppercase tracking-widest text-muted ${className}`}
    >
      {children}
    </label>
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

function RouteNode({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex min-w-[88px] flex-col items-center text-center">
      <div className="rounded-2xl border border-line bg-bg p-3">{icon}</div>
      <div className="mt-2 text-[10px] uppercase tracking-widest text-muted">
        {subtitle}
      </div>
      <div className="text-sm font-medium capitalize">{title}</div>
    </div>
  );
}

function RouteArrow({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center">
      <div
        className={`h-px w-full ${
          accent ? "bg-gradient-to-r from-brand/30 via-brand to-brand/30" : "bg-line"
        }`}
      />
      <span
        className={`mt-1 text-[10px] uppercase tracking-widest ${
          accent ? "text-brand" : "text-muted"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
