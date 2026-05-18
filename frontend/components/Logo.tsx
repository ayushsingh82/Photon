import {
  CHAIN,
  PROTOCOL,
  TOKEN_ICON,
  type ChainSlug,
  type ProtocolSlug,
  type TokenSymbol,
} from "@/lib/assets";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

const sizes: Record<Size, string> = {
  xs: "h-4 w-4",
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
  xl: "h-14 w-14",
};

export function TokenLogo({
  symbol,
  size = "md",
  className = "",
}: {
  symbol: TokenSymbol;
  size?: Size;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={TOKEN_ICON[symbol]}
      alt={symbol}
      className={`${sizes[size]} rounded-full ring-1 ring-white/10 ${className}`}
    />
  );
}

export function ChainLogo({
  slug,
  size = "md",
  className = "",
}: {
  slug: ChainSlug;
  size?: Size;
  className?: string;
}) {
  const c = CHAIN[slug];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={c.icon}
      alt={c.name}
      title={c.name}
      className={`${sizes[size]} rounded-full ring-1 ring-white/10 ${className}`}
    />
  );
}

export function ProtocolLogo({
  slug,
  size = "md",
  className = "",
}: {
  slug: ProtocolSlug;
  size?: Size;
  className?: string;
}) {
  const p = PROTOCOL[slug];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={p.icon}
      alt={p.name}
      title={p.name}
      className={`${sizes[size]} rounded-xl ring-1 ring-white/10 ${className}`}
    />
  );
}

// Stacked overlapping icons (e.g. supported chains row)
export function ChainStack({
  slugs,
  size = "md",
}: {
  slugs: ChainSlug[];
  size?: Size;
}) {
  return (
    <div className="flex -space-x-2">
      {slugs.map((s) => (
        <ChainLogo
          key={s}
          slug={s}
          size={size}
          className="ring-2 ring-bg"
        />
      ))}
    </div>
  );
}
