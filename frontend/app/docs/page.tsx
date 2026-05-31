import type { Metadata } from "next";
import { ChainLogo, ProtocolLogo, TokenLogo } from "@/components/Logo";
import type { ChainSlug, TokenSymbol } from "@/lib/assets";
import {
  AAVE_V3_POOL,
  ASSET_DECIMALS,
  CHAIN_SLUG,
  SETTLEMENT_CHAIN,
  SUPPORTED_ASSETS,
  SUPPORTED_CHAINS,
  TOKEN_ADDRESS,
  type Asset,
  type ChainId,
} from "@/lib/chains";

export const metadata: Metadata = {
  title: "Photon — Docs",
  description: "What Photon is, how it works, the stack, and the contract addresses it routes into.",
};

const CHAIN_IDS = Object.keys(SUPPORTED_CHAINS).map(Number) as ChainId[];

const EXPLORER: Record<ChainId, string> = {
  1: "https://etherscan.io/address/",
  10: "https://optimistic.etherscan.io/address/",
  137: "https://polygonscan.com/address/",
  8453: "https://basescan.org/address/",
  42161: "https://arbiscan.io/address/",
};

const STACK: { layer: string; choice: string }[] = [
  { layer: "Frontend", choice: "Next.js 15 (App Router), React 19, TypeScript, Tailwind" },
  { layer: "Auth", choice: "Magic Labs — email OTP + Google (magic-sdk, @magic-ext/oauth2)" },
  { layer: "Smart accounts", choice: "Particle Network — Universal Accounts" },
  { layer: "Onchain", choice: "viem (calldata) · ethers (Magic signer) · Aave v3 · Morpho Blue" },
  { layer: "Yield oracle", choice: "DefiLlama Yields API (no key)" },
  { layer: "State", choice: "Zustand" },
  { layer: "Settlement", choice: "Arbitrum One" },
];

const FLOW = [
  { t: "Sign in", d: "Magic returns a non-custodial EOA — the owner of your Particle Universal Account. No seed phrase." },
  { t: "Find the best route", d: "lib/apy.ts filters the live DefiLlama pool list to Aave v3 / Morpho Blue markets for USDC/USDT/ETH and picks the highest APY." },
  { t: "Build the call", d: "lib/aave.ts encodes approve → supply calldata with viem for the destination chain." },
  { t: "One signature", d: "Particle wraps it in a Universal Transaction; you sign a single rootHash. It sources funds across chains, bridges, sponsors gas, and executes." },
];

const SECTIONS: { id: string; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "how-it-works", label: "How it works" },
  { id: "stack", label: "Tech stack" },
  { id: "coverage", label: "Chains & assets" },
  { id: "addresses", label: "Contract addresses" },
];

export default function DocsPage() {
  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-6 py-16">
      {/* Sidebar */}
      <aside className="hidden w-48 shrink-0 lg:block">
        <nav className="sticky top-24">
          <p className="mb-3 text-[10px] uppercase tracking-widest text-muted">
            On this page
          </p>
          <ul className="space-y-1 border-l border-line">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-muted transition hover:border-brand hover:text-fg"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Content */}
      <div className="min-w-0 flex-1">
      <p className="font-display italic text-3xl text-brand">what we build</p>
      <h1 className="mt-2 text-4xl font-semibold">Docs</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Photon routes a one-click deposit to the best DeFi yield across chains —
        seedless login via Magic, chain-abstracted gasless execution via Particle
        Universal Accounts, settled into Aave / Morpho on Arbitrum.
      </p>

      {/* What we build */}
      <Section id="overview" title="Overview" kicker="the product">
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Seedless login">
            Email OTP or Google via Magic Labs — non-custodial, no seed phrase.
          </Card>
          <Card title="One account, every chain">
            A Particle Universal Account holds a unified balance across Ethereum,
            Base, Polygon, Optimism, and Arbitrum.
          </Card>
          <Card title="Gasless, auto-routed">
            Gas is sponsored and paid in the asset you deposit; Photon picks the
            highest live APY automatically.
          </Card>
          <Card title="No contracts deployed">
            Photon calls existing audited protocols (Aave v3, Morpho Blue)
            directly — nothing custom to trust.
          </Card>
        </div>
      </Section>

      {/* How it works */}
      <Section id="how-it-works" title="How it works" kicker="architecture">
        <ol className="space-y-4">
          {FLOW.map((s, i) => (
            <li key={s.t} className="flex gap-4 rounded-2xl border border-line bg-white/[0.02] p-5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand/50 text-sm text-brand">
                {i + 1}
              </div>
              <div>
                <div className="font-medium">{s.t}</div>
                <div className="mt-1 text-sm text-muted">{s.d}</div>
              </div>
            </li>
          ))}
        </ol>

        <pre className="mt-6 overflow-x-auto rounded-2xl border border-line bg-bg p-5 text-xs leading-relaxed text-muted">{`Magic (auth, EOA)            DefiLlama (APY oracle)
        │                            │
        ▼                            ▼
  owner / signer  ───▶  Photon best-route  ───▶  Particle Universal Account
                                                   │  source · bridge · gas
                                                   ▼
                                      Arbitrum · Aave v3 / Morpho Blue`}</pre>
      </Section>

      {/* Tech stack */}
      <Section id="stack" title="Tech stack" kicker="stack">
        <div className="overflow-hidden rounded-2xl border border-line">
          <table className="w-full text-sm">
            <tbody>
              {STACK.map((row, i) => (
                <tr key={row.layer} className={i ? "border-t border-line" : ""}>
                  <td className="w-40 px-5 py-3 text-muted">{row.layer}</td>
                  <td className="px-5 py-3">{row.choice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Supported chains & assets */}
      <Section id="coverage" title="Supported chains & assets" kicker="coverage">
        <div className="flex flex-wrap gap-3">
          {CHAIN_IDS.map((id) => (
            <span
              key={id}
              className="flex items-center gap-2 rounded-full border border-line bg-white/[0.02] px-3 py-1.5 text-sm"
            >
              <ChainLogo slug={CHAIN_SLUG[id] as ChainSlug} size="xs" />
              <span className="capitalize">{SUPPORTED_CHAINS[id].name}</span>
              {id === SETTLEMENT_CHAIN && (
                <span className="rounded-full bg-brand/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-brand">
                  settles here
                </span>
              )}
            </span>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {SUPPORTED_ASSETS.map((a) => (
            <span
              key={a}
              className="flex items-center gap-2 rounded-full border border-line bg-white/[0.02] px-3 py-1.5 text-sm"
            >
              <TokenLogo symbol={a as TokenSymbol} size="xs" />
              {a}
              <span className="text-xs text-muted">{ASSET_DECIMALS[a]} dec</span>
            </span>
          ))}
        </div>
      </Section>

      {/* Contract addresses */}
      <Section id="addresses" title="Contract addresses" kicker="onchain">
        <p className="-mt-2 mb-4 text-sm text-muted">
          Every address is verified on-chain (correct symbol/decimals and listed
          as an Aave v3 reserve). ETH routes through the canonical WETH market.
        </p>
        <div className="space-y-6">
          {CHAIN_IDS.map((id) => (
            <div key={id} className="overflow-hidden rounded-2xl border border-line">
              <div className="flex items-center gap-2 border-b border-line bg-white/[0.02] px-5 py-3">
                <ChainLogo slug={CHAIN_SLUG[id] as ChainSlug} size="xs" />
                <span className="font-medium">{SUPPORTED_CHAINS[id].name}</span>
                <span className="text-xs text-muted">· chainId {id}</span>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  <AddrRow
                    label="Aave v3 Pool"
                    icon={<ProtocolLogo slug="aave" size="xs" />}
                    address={AAVE_V3_POOL[id]}
                    explorer={EXPLORER[id]}
                  />
                  {SUPPORTED_ASSETS.map((a) => (
                    <AddrRow
                      key={a}
                      label={`${a}${a === "ETH" ? " (WETH)" : ""}`}
                      icon={<TokenLogo symbol={a as TokenSymbol} size="xs" />}
                      address={TOKEN_ADDRESS[id][a as Asset]}
                      explorer={EXPLORER[id]}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </Section>

      <div className="mt-16 rounded-2xl border border-line bg-white/[0.02] p-6 text-sm text-muted">
        Source on{" "}
        <a className="text-brand hover:underline" href="https://github.com/ayushsingh82/Photon">
          GitHub
        </a>{" "}
        · full design notes in <span className="text-fg">frontend/PLANNING.md</span>.
      </div>
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  kicker,
  children,
}: {
  id: string;
  title: string;
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-14 scroll-mt-24">
      <p className="font-display italic text-2xl text-brand">{kicker}</p>
      <h2 className="mb-5 mt-1 text-2xl font-medium">{title}</h2>
      {children}
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-white/[0.02] p-5">
      <div className="font-medium">{title}</div>
      <div className="mt-1 text-sm text-muted">{children}</div>
    </div>
  );
}

function AddrRow({
  label,
  icon,
  address,
  explorer,
}: {
  label: string;
  icon: React.ReactNode;
  address?: `0x${string}`;
  explorer: string;
}) {
  return (
    <tr className="border-t border-line first:border-t-0">
      <td className="w-44 px-5 py-3">
        <div className="flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </div>
      </td>
      <td className="px-5 py-3">
        {address ? (
          <a
            href={`${explorer}${address}`}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-muted transition hover:text-brand"
          >
            {address}
          </a>
        ) : (
          <span className="text-xs text-muted/50">— not listed</span>
        )}
      </td>
    </tr>
  );
}
