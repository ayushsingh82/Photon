"use client";

import { useEffect, useState } from "react";
import { ChainLogo, ProtocolLogo, TokenLogo } from "@/components/Logo";
import type { ChainSlug, ProtocolSlug, TokenSymbol } from "@/lib/assets";
import { useSession } from "@/store/session";
import { CHAIN_SLUG } from "@/lib/chains";
import { getPositions, type Position } from "@/lib/positions";
import { fetchTopPools, type Pool } from "@/lib/apy";

const PROTOCOL: Record<Pool["protocol"], { slug: ProtocolSlug; name: string }> = {
  "aave-v3": { slug: "aave", name: "Aave v3" },
  "morpho-blue": { slug: "morpho", name: "Morpho Blue" },
};

export default function DashboardPage() {
  const { user, account, balanceUsd } = useSession();
  const [positions, setPositions] = useState<Position[] | null>(null);
  const [pools, setPools] = useState<Pool[] | null>(null);
  const [loadingPositions, setLoadingPositions] = useState(false);

  // Live market data — works with or without a connected account.
  useEffect(() => {
    fetchTopPools()
      .then(setPools)
      .catch(() => setPools([]));
  }, []);

  // Real on-chain positions for the connected Universal Account.
  useEffect(() => {
    if (!account) {
      setPositions(null);
      return;
    }
    setLoadingPositions(true);
    getPositions(account.address)
      .then(setPositions)
      .catch(() => setPositions([]))
      .finally(() => setLoadingPositions(false));
  }, [account]);

  const suppliedUsd = (positions ?? []).reduce((a, p) => a + p.valueUsd, 0);
  const avgApy =
    suppliedUsd > 0
      ? (positions ?? []).reduce((a, p) => a + p.apy * p.valueUsd, 0) / suppliedUsd
      : 0;

  const topPools = (pools ?? []).slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="font-display italic text-3xl text-brand">your portfolio</p>
          <h1 className="mt-1 text-4xl font-semibold">Dashboard</h1>
        </div>
        {user ? (
          <div className="flex items-center gap-3 rounded-full border border-line bg-white/[0.02] px-4 py-2">
            <div className="leading-tight">
              <div className="text-xs text-muted">Universal Account</div>
              <div className="font-mono text-xs">
                {account
                  ? `${account.address.slice(0, 6)}…${account.address.slice(-4)}`
                  : "provisioning…"}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-full border border-line bg-white/[0.02] px-4 py-2 text-sm text-muted">
            Connect to view your portfolio
          </div>
        )}
      </div>

      {/* Summary cards */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <SummaryCard
          label="Unified balance"
          value={fmtUsd(balanceUsd)}
          sub="Across all chains · Particle"
        />
        <SummaryCard
          label="Supplied on Aave"
          value={
            positions === null
              ? "—"
              : `$${suppliedUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
          }
          sub={
            positions === null
              ? "Connect to load"
              : `${positions.length} position${positions.length === 1 ? "" : "s"}`
          }
          accent
        />
        <SummaryCard
          label="Avg APY"
          value={avgApy > 0 ? `${avgApy.toFixed(2)}%` : "—"}
          sub="Value-weighted, live"
        />
      </div>

      {/* Positions */}
      <section className="mt-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-medium">Positions</h2>
          <a
            href="/deposit"
            className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white shadow-glow transition hover:brightness-110"
          >
            + New deposit
          </a>
        </div>

        {!user ? (
          <EmptyState text="Sign in to see your live Aave positions." />
        ) : loadingPositions || positions === null ? (
          <EmptyState text="Reading your on-chain positions…" />
        ) : positions.length === 0 ? (
          <EmptyState text="No positions yet. Make your first deposit to start earning." />
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-line">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.02] text-muted">
                <tr>
                  <Th>Asset</Th>
                  <Th>Chain</Th>
                  <Th>Protocol</Th>
                  <Th align="right">Balance</Th>
                  <Th align="right">Value</Th>
                  <Th align="right">APY</Th>
                  <Th align="right" />
                </tr>
              </thead>
              <tbody>
                {positions.map((p) => (
                  <tr
                    key={`${p.asset}-${p.chainId}`}
                    className="border-t border-line transition hover:bg-white/[0.03]"
                  >
                    <Td>
                      <div className="flex items-center gap-3">
                        <TokenLogo symbol={p.asset as TokenSymbol} size="sm" />
                        <span className="font-medium">{p.asset}</span>
                      </div>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <ChainLogo slug={CHAIN_SLUG[p.chainId] as ChainSlug} size="xs" />
                        <span className="capitalize">{CHAIN_SLUG[p.chainId]}</span>
                      </div>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <ProtocolLogo slug={PROTOCOL[p.protocol].slug} size="xs" />
                        <span>{PROTOCOL[p.protocol].name}</span>
                      </div>
                    </Td>
                    <Td align="right">
                      {p.balance.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                    </Td>
                    <Td align="right">{fmtUsd(p.valueUsd)}</Td>
                    <Td align="right" className="text-brand">
                      {p.apy.toFixed(2)}%
                    </Td>
                    <Td align="right">
                      <button className="rounded-full border border-line px-3 py-1 text-xs transition hover:border-brand">
                        Withdraw
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Top pools — live from DefiLlama */}
      <section className="mt-16">
        <p className="font-display italic text-2xl text-brand">market</p>
        <h2 className="mt-1 text-2xl font-medium">Top pools right now</h2>
        {pools === null ? (
          <EmptyState text="Loading live yields…" />
        ) : topPools.length === 0 ? (
          <EmptyState text="No markets available right now." />
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topPools.map((p) => {
              const slug = CHAIN_SLUG[p.chainId] as ChainSlug;
              return (
                <div
                  key={p.id}
                  className="rounded-2xl border border-line p-5 transition hover:border-brand hover:shadow-glow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <TokenLogo symbol={p.asset as TokenSymbol} size="lg" />
                        <div className="absolute -bottom-1 -right-1 rounded-full ring-2 ring-bg">
                          <ChainLogo slug={slug} size="xs" />
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-medium">{p.asset}</div>
                        <div className="text-xs capitalize text-muted">{p.chainName}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display italic text-3xl text-brand">
                        {p.apy.toFixed(2)}%
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-muted">apy</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs text-muted">
                    <div className="flex items-center gap-2">
                      <ProtocolLogo slug={PROTOCOL[p.protocol].slug} size="xs" />
                      <span>{PROTOCOL[p.protocol].name}</span>
                    </div>
                    <span>
                      ${(p.tvlUsd / 1e6).toLocaleString(undefined, { maximumFractionDigits: 1 })}M TVL
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function fmtUsd(v: number | null): string {
  if (v === null) return "—";
  return `$${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-line p-10 text-center text-sm text-muted">
      {text}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-6 ${accent ? "border-brand shadow-glow" : "border-line"}`}>
      <div className="text-sm text-muted">{label}</div>
      <div className={`mt-2 text-3xl font-semibold ${accent ? "text-brand" : ""}`}>{value}</div>
      {sub && <div className="mt-1 text-xs text-muted">{sub}</div>}
    </div>
  );
}

function Th({ children, align }: { children?: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th
      className={`px-5 py-3 text-xs font-normal uppercase tracking-wider ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align,
  className = "",
}: {
  children?: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <td className={`px-5 py-4 ${align === "right" ? "text-right" : "text-left"} ${className}`}>
      {children}
    </td>
  );
}
