import { ProtocolLogo } from "@/components/Logo";

export function PartnersStrip() {
  const items: { slug: "particle" | "magic" | "aave" | "morpho"; label: string }[] = [
    { slug: "particle", label: "Particle Network" },
    { slug: "magic", label: "Magic Labs" },
    { slug: "aave", label: "Aave" },
    { slug: "morpho", label: "Morpho" },
  ];
  return (
    <section className="border-y border-line bg-white/[0.015]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-8 md:flex-row md:justify-between">
        <span className="text-xs uppercase tracking-widest text-muted">
          Powered by the best in DeFi
        </span>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {items.map((it) => (
            <div
              key={it.slug}
              className="flex items-center gap-2 opacity-80 transition hover:opacity-100"
            >
              <ProtocolLogo slug={it.slug} size="sm" />
              <span className="text-sm text-fg/80">{it.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
