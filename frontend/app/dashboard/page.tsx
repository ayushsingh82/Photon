const positions = [
  {
    asset: "USDC",
    chain: "Arbitrum",
    protocol: "Aave v3",
    balance: 1_250.42,
    apy: 4.81,
    accrued: 12.06,
  },
  {
    asset: "ETH",
    chain: "Arbitrum",
    protocol: "Morpho Blue",
    balance: 0.823,
    apy: 3.92,
    accrued: 0.0041,
  },
  {
    asset: "USDT",
    chain: "Arbitrum",
    protocol: "Aave v3",
    balance: 540.0,
    apy: 5.12,
    accrued: 4.7,
  },
];

const topPools = [
  { asset: "USDC", chain: "Arbitrum", protocol: "Aave v3", apy: 4.81 },
  { asset: "USDC", chain: "Base", protocol: "Morpho Blue", apy: 4.05 },
  { asset: "USDT", chain: "Arbitrum", protocol: "Aave v3", apy: 5.12 },
  { asset: "ETH", chain: "Arbitrum", protocol: "Morpho Blue", apy: 3.92 },
  { asset: "ETH", chain: "Optimism", protocol: "Aave v3", apy: 2.71 },
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
      <p className="font-cursive text-3xl text-brand">your portfolio</p>
      <h1 className="mt-2 text-4xl font-semibold">Dashboard</h1>

      {/* Summary cards */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <SummaryCard
          label="Total deposited"
          value={`$${totalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
        />
        <SummaryCard
          label="Accrued yield"
          value={`$${totalAccrued.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          accent
        />
        <SummaryCard label="Active positions" value={`${positions.length}`} />
      </div>

      {/* Positions */}
      <section className="mt-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-medium">Positions</h2>
          <a href="/deposit" className="text-sm text-brand hover:underline">
            + new deposit
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
                <tr key={p.asset} className="border-t border-line">
                  <Td className="font-medium">{p.asset}</Td>
                  <Td>{p.chain}</Td>
                  <Td>{p.protocol}</Td>
                  <Td align="right">
                    {p.balance.toLocaleString(undefined, {
                      maximumFractionDigits: 4,
                    })}
                  </Td>
                  <Td align="right" className="text-brand">
                    {p.apy.toFixed(2)}%
                  </Td>
                  <Td align="right">
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
        <p className="font-cursive text-2xl text-brand">market</p>
        <h2 className="mt-1 text-2xl font-medium">Top pools right now</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {topPools.map((p) => (
            <div
              key={`${p.asset}-${p.chain}-${p.protocol}`}
              className="rounded-2xl border border-line p-5 transition hover:border-brand"
            >
              <div className="flex items-center justify-between">
                <div className="text-lg font-medium">{p.asset}</div>
                <div className="font-cursive text-2xl text-brand">
                  {p.apy.toFixed(2)}%
                </div>
              </div>
              <div className="mt-1 text-sm text-muted">
                {p.protocol} · {p.chain}
              </div>
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
  accent,
}: {
  label: string;
  value: string;
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
