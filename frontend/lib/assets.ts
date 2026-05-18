// Centralised registry of remote logos used throughout the product.
// Sources are public CDNs (DefiLlama, CoinGecko, Trust Wallet) — swap any of
// these out for self-hosted /public files later without touching consumers.

export type TokenSymbol = "USDC" | "USDT" | "ETH";
export type ChainSlug =
  | "ethereum"
  | "arbitrum"
  | "base"
  | "polygon"
  | "optimism";
export type ProtocolSlug = "aave" | "morpho" | "particle" | "magic";

export const TOKEN_ICON: Record<TokenSymbol, string> = {
  USDC: "https://assets.coingecko.com/coins/images/6319/large/usdc.png",
  USDT: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
  ETH: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
};

export const CHAIN: Record<
  ChainSlug,
  { name: string; icon: string; color: string }
> = {
  ethereum: {
    name: "Ethereum",
    icon: "https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg",
    color: "#627EEA",
  },
  arbitrum: {
    name: "Arbitrum",
    icon: "https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg",
    color: "#28A0F0",
  },
  base: {
    name: "Base",
    icon: "https://icons.llamao.fi/icons/chains/rsz_base.jpg",
    color: "#0052FF",
  },
  polygon: {
    name: "Polygon",
    icon: "https://icons.llamao.fi/icons/chains/rsz_polygon.jpg",
    color: "#8247E5",
  },
  optimism: {
    name: "Optimism",
    icon: "https://icons.llamao.fi/icons/chains/rsz_optimism.jpg",
    color: "#FF0420",
  },
};

export const PROTOCOL: Record<
  ProtocolSlug,
  { name: string; icon: string; url: string }
> = {
  aave: {
    name: "Aave",
    icon: "https://icons.llamao.fi/icons/protocols/aave-v3?w=48&h=48",
    url: "https://aave.com",
  },
  morpho: {
    name: "Morpho",
    icon: "https://icons.llamao.fi/icons/protocols/morpho-blue?w=48&h=48",
    url: "https://morpho.org",
  },
  particle: {
    name: "Particle Network",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKK6-3I2JwgBeBmoFwl9U3sVuv5Nn_tdNN8Q&s",
    url: "https://particle.network",
  },
  magic: {
    name: "Magic",
    icon: "https://magic.link/_next/image?url=%2Fimages%2Fmagic-hero-square.png&w=1920&q=75",
    url: "https://magic.link",
  },
};

// Random avatars for testimonials / social proof.
export const avatar = (seed: number) =>
  `https://i.pravatar.cc/120?img=${seed}`;
