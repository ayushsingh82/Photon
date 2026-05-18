export function StatsBar() {
  const stats = [
    { v: "$14.2M", l: "Total deposits routed" },
    { v: "4.81%", l: "Best USDC APY today" },
    { v: "5", l: "Chains supported" },
    { v: "2,431", l: "Universal Accounts" },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="bg-bg p-6">
            <div className="font-display italic text-4xl text-brand">{s.v}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-muted">
              {s.l}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
