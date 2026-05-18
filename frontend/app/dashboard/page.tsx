import { ChainLogo, ProtocolLogo, TokenLogo } from "@/components/Logo";
import { avatar } from "@/lib/assets";

type Position = {
  asset: "USDC" | "USDT" | "ETH";
  chain: "arbitrum" | "base" | "optimism" | "polygon" | "ethereum";
  protocol: "aave" | "morpho";
  protocolName: string;
  balance: number;
  apy: number;
  accrued: number;
};

const positions: Position[] = [
  {
    asset: "USDC",
    chain: "arbitrum",
    protocol: "aave",
    protocolName: "Aave v3",
    balance: 1_250.42,
    apy: 4.81,
    accrued: 12.06,
  },
  {
    asset: "ETH",
    chain: "arbitrum",
    protocol: "morpho",
    protocolName: "Morpho Blue",
    balance: 0.823,
    apy: 3.92,
    accrued: 0.0041,
  },
  {
    asset: "USDT",
    chain: "arbitrum",
    protocol: "aave",
    protocolName: "Aave v3",
    balance: 540.0,
    apy: 5.12,
    accrued: 4.7,
  },
];

const topPools: {
  asset: "USDC" | "USDT" | "ETH";
  chain: "arbitrum" | "base" | "optimism";
  protocol: "aave" | "morpho";
  protocolName: string;
  apy: number;
}[] = [
  { asset: "USDC", chain: "arbitrum", protocol: "aave", protocolName: "Aave v3", apy: 4.81 },
  { asset: "USDC", chain: "base", protocol: "morpho", protocolName: "Morpho Blue", apy: 4.05 },
  { asset: "USDT", chain: "arbitrum", protocol: "aave", protocolName: "Aave v3", apy: 5.12 },
  { asset: "ETH", chain: "arbitrum", protocol: "morpho", protocolName: "Morpho Blue", apy: 3.92 },
  { asset: "ETH", chain: "optimism", protocol: "aave", protocolName: "Aave v3", apy: 2.71 },
  { asset: "USDC", chain: "optimism", protocol: "aave", protocolName: "Aave v3", apy: 3.48 },
];

const activity = [
  { ts: "2 min ago", text: "Deposited 500 USDC", route: "Base → Arbitrum · Aave", icon: "USDC" as const },
  { ts: "1 hr ago", text: "Auto-rebalanced 0.3 ETH", route: "Aave → Morpho · +0.4% APY", icon: "ETH" as const },
  { ts: "Yesterday", text: "Withdrew 100 USDT", route: "Arbitrum → Polygon", icon: "USDT" as const },
];

export default function DashboardPage() {
  const totalBalance = positions.reduce(
    (a, p) => a + p.balance * (p.asset === "ETH" ? 3200 : 1),
    0,
  );
  const totalAccrued = positions.reduce(
    (a, p) => a + p.accrued * (p.asset === "ETH" ? 3200 : 1),
    0,
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="font-display italic text-3xl text-brand">your portfolio</p>
          <h1 className="mt-1 text-4xl font-semibold">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-line bg-white/[0.02] px-4 py-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatar(8)}
            alt=""
            className="h-8 w-8 rounded-full ring-2 ring-brand/40"
          />
          <div className="leading-tight">
            <div className="text-xs text-muted">Universal Account</div>
            <div className="font-mono text-xs">0x4f2…b71a</div>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <SummaryCard
          label="Total deposited"
          value={`$${totalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          sub="Across 3 positions"
        />
        <SummaryCard
          label="Accrued yield"
          value={`$${totalAccrued.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          sub="↑ $1.42 today"
          accent
        />
        <SummaryCard label="Avg APY" value="4.62%" sub="Blended across positions" />
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
        <div className="mt-6 overflow-hidden rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.02] text-muted">
              <tr>
                <Th>Asset</Th>
                <Th>Chain</Th>
                <Th>Protocol</Th>
                <Th align="right">Balance</Th>
                <Th align="right">APY</Th>
                <Th align="right">Accrued</Th>
                <Th align="right" />
              </tr>
            </thead>
            <tbody>
              {positions.map((p) => (
                <tr
                  key={`${p.asset}-${p.chain}-${p.protocol}`}
                  className="border-t border-line transition hover:bg-white/[0.03]"
                >
                  <Td>
                    <div className="flex items-center gap-3">
                      <TokenLogo symbol={p.asset} size="sm" />
                      <span className="font-medium">{p.asset}</span>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <ChainLogo slug={p.chain} size="xs" />
                      <span className="capitalize">{p.chain}</span>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <ProtocolLogo slug={p.protocol} size="xs" />
                      <span>{p.protocolName}</span>
                    </div>
                  </Td>
                  <Td align="right">
                    {p.balance.toLocaleString(undefined, {
                      maximumFractionDigits: 4,
                    })}
                  </Td>
                  <Td align="right" className="text-brand">
                    {p.apy.toFixed(2)}%
                  </Td>
                  <Td align="right">
                    +
                    {p.accrued.toLocaleString(undefined, {
                      maximumFractionDigits: 4,
                    })}
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
      </section>

      {/* Top pools */}
      <section className="mt-16">
        <p className="font-display italic text-2xl text-brand">market</p>
        <h2 className="mt-1 text-2xl font-medium">Top pools right now</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {topPools.map((p) => (
            <div
              key={`${p.asset}-${p.chain}-${p.protocol}`}
              className="rounded-2xl border border-line p-5 transition hover:border-brand hover:shadow-glow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <TokenLogo symbol={p.asset} size="lg" />
                    <div className="absolute -bottom-1 -right-1 rounded-full ring-2 ring-bg">
                      <ChainLogo slug={p.chain} size="xs" />
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-medium">{p.asset}</div>
                    <div className="text-xs text-muted capitalize">{p.chain}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display italic text-3xl text-brand">
                    {p.apy.toFixed(2)}%
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-muted">
                    apy
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 border-t border-line pt-3 text-xs text-muted">
                <ProtocolLogo slug={p.protocol} size="xs" />
                <span>{p.protocolName}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Activity */}
      <section className="mt-16">
        <p className="font-display italic text-2xl text-brand">recent</p>
        <h2 className="mt-1 text-2xl font-medium">Activity</h2>
        <div className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line">
          {activity.map((a, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-5 transition hover:bg-white/[0.02]"
            >
              <div className="flex items-center gap-4">
                <TokenLogo symbol={a.icon} size="md" />
                <div>
                  <div className="text-sm font-medium">{a.text}</div>
                  <div className="text-xs text-muted">{a.route}</div>
                </div>
              </div>
              <div className="text-xs text-muted">{a.ts}</div>
            </div>
          ))}
        </div>
      </section>
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
    <div
      className={`rounded-2xl border p-6 ${
        accent ? "border-brand shadow-glow" : "border-line"
      }`}
    >
      <div className="text-sm text-muted">{label}</div>
      <div
        className={`mt-2 text-3xl font-semibold ${accent ? "text-brand" : ""}`}
      >
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-muted">{sub}</div>}
    </div>
  );
}

function Th({
  children,
  align,
}: {
  children?: React.ReactNode;
  align?: "left" | "right";
}) {
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
    <td
      className={`px-5 py-4 ${align === "right" ? "text-right" : "text-left"} ${className}`}
    >
      {children}
    </td>
  );
}
