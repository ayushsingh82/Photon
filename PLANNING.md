# PLANNING.md — Cross-Chain Yield Aggregator

> **Hackathon target:** Particle Network Hackathon
> **One-line pitch:** A social-login DeFi yield aggregator that auto-routes deposits cross-chain into the best Aave/Morpho APY, with gasless UX powered by Particle Universal Accounts.

---

## 1. Goals

1. Let any user (crypto-native or not) deposit USDC / USDT / ETH from any supported chain in one click.
2. Automatically route the deposit to the chain + protocol offering the best APY (primary settlement: Arbitrum).
3. Abstract away seed phrases (Magic Labs), gas tokens, bridging, and approvals (Particle Universal Accounts).
4. Show a clean dashboard: balances, APY, accrued yield, withdraw button.

## 2. Non-Goals (for the hackathon scope)

- No custom strategy / vault token (we deposit straight into Aave / Morpho).
- No leverage / looping.
- No mobile-native app — responsive web only.
- No KYC / compliance flow.
- No fiat on-ramp (Magic supports it, but out of scope for the demo).

---

## 3. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| **Auth** | Magic Labs SDK | Social + email login, non-custodial, no seed phrase |
| **Smart Account / Chain Abstraction** | Particle Network — Universal Accounts | One account across all chains, gas paid in any token, unified balance |
| **Yield sources** | Aave v3, Morpho Blue | Deepest liquidity, well-audited, public SDKs |
| **Settlement chain** | Arbitrum One | Low fees, deep DeFi liquidity |
| **Source chains supported** | Ethereum, Base, Polygon, Optimism, Arbitrum | Covers ~90% of user funds |
| **Frontend** | Next.js 15 (App Router) + TypeScript | Modern React, fast iteration |
| **Styling** | Tailwind CSS | Theme tokens, fast prototyping |
| **State / data** | TanStack Query + Zustand | Server state vs. UI state separation |
| **Web3 plumbing** | viem + wagmi | Type-safe, modern alt to ethers |
| **APY data** | DefiLlama Yields API + on-chain reads | Free, no API key |
| **Deployment** | Vercel | One-click from repo |

---

## 4. Architecture

```
 ┌─────────────────────────────────────────────────────────┐
 │                     Next.js (Vercel)                    │
 │                                                         │
 │   ┌──────────┐   ┌──────────────┐   ┌──────────────┐    │
 │   │  Pages   │   │   Hooks /    │   │   UI / Theme │    │
 │   │ (App Dir)│──▶│   Services   │──▶│  (Tailwind)  │    │
 │   └──────────┘   └──────┬───────┘   └──────────────┘    │
 │                         │                                │
 └─────────────────────────┼────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
 ┌──────────────┐  ┌──────────────┐   ┌──────────────────┐
 │ Magic Labs   │  │   Particle   │   │  DefiLlama API   │
 │ (auth, EOA)  │  │  Universal   │   │   (APY oracle)   │
 │              │  │   Accounts   │   │                  │
 └──────────────┘  └──────┬───────┘   └──────────────────┘
                          │
                          ▼
              ┌──────────────────────┐
              │   Arbitrum One       │
              │   Aave v3 / Morpho   │
              └──────────────────────┘
```

### Request flow — deposit

1. User clicks **Deposit 100 USDC**.
2. UI calls `yieldRouter.bestRoute({ asset, amount, userUA })` → returns `{ chain: 'arbitrum', protocol: 'aave', apy: 4.1 }`.
3. UI builds a Universal Transaction via Particle SDK:
   - `from`: user's Universal Account (multi-chain balance)
   - `to`: Aave v3 Pool on Arbitrum
   - `calldata`: `supply(USDC, 100, ua, 0)`
   - Particle handles: source-chain debit, bridge, gas sponsorship, destination-chain execute.
4. UI optimistically updates dashboard; polls for `txStatus`.

### Request flow — APY discovery

- Cron / on-demand fetch from DefiLlama `/pools` → filter by `chain ∈ supported && symbol ∈ {USDC, USDT, ETH} && project ∈ {aave-v3, morpho-blue}`.
- Cache in Redis (or in-memory for hackathon) with 5-min TTL.

---

## 5. Smart-Contract Surface (read-only from our side)

We do **not** deploy contracts for v1 — we call existing protocols.

| Protocol | Contract | Method |
|---|---|---|
| Aave v3 Arbitrum | `Pool` `0x794a61358D6845594F94dc1DB02A252b5b4814aD` | `supply`, `withdraw` |
| Morpho Blue Arbitrum | `0x6c247b1F6182318877311737BaC0844bAa518F5e` | `supply`, `withdraw` |

If time permits, we add a thin `YieldRouter.sol` that batches `approve → bridge → supply` for users who want to skip Particle (fallback path).

---

## 6. Directory Layout

```
yield-aggregator/
├── PLANNING.md
├── README.md
├── frontend/                  # Next.js app
│   ├── app/
│   │   ├── layout.tsx         # Theme + providers
│   │   ├── page.tsx           # Landing
│   │   ├── dashboard/page.tsx # Positions, APY, history
│   │   └── deposit/page.tsx   # Deposit / withdraw form
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── ConnectButton.tsx
│   │   ├── AssetCard.tsx
│   │   ├── ApyTable.tsx
│   │   └── DepositForm.tsx
│   ├── lib/
│   │   ├── magic.ts           # Magic SDK client
│   │   ├── particle.ts        # Universal Account client
│   │   ├── apy.ts             # DefiLlama fetcher
│   │   ├── router.ts          # bestRoute() logic
│   │   └── chains.ts          # Supported chain config
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useUniversalAccount.ts
│   │   ├── useApy.ts
│   │   └── useDeposit.ts
│   ├── styles/globals.css
│   ├── tailwind.config.ts
│   └── package.json
└── contracts/                 # (stretch) YieldRouter.sol
```

---

## 7. Milestones

| # | Milestone | Owner | Done when |
|---|---|---|---|
| M0 | Repo scaffold, theme, docs | — | Next.js app boots with dark/purple theme |
| M1 | Magic Labs login | — | User can log in with email/Google and see EOA address |
| M2 | Particle Universal Account provision | — | UA is created on login; unified balance visible |
| M3 | APY oracle | — | `useApy()` returns top pool per asset, refresh every 5 min |
| M4 | Deposit flow (USDC happy path) | — | 100 USDC from Base → Aave Arbitrum, tx confirmed |
| M5 | Withdraw flow | — | Withdraw back to chain of choice |
| M6 | Dashboard polish | — | Positions, accrued yield, history list |
| M7 | Demo video + deploy | — | Vercel URL + 2-min Loom |

---

## 8. UX / Theme

- **Background:** pure black `#000000`
- **Foreground text:** white `#FFFFFF`
- **Highlight / accent:** `#A500E6` (used for CTAs, links, APY numbers, focus rings)
- **Headings:** mix — primary headings in a cursive display font (`"Caveat"` or `"Dancing Script"` from Google Fonts), body in `Inter`.
- **Vibe:** minimalist, lots of whitespace, glow on hover.

Tailwind tokens:
```ts
colors: {
  bg:    '#000000',
  fg:    '#FFFFFF',
  brand: '#A500E6',
  muted: '#9CA3AF',
}
fontFamily: {
  sans:    ['Inter', 'sans-serif'],
  cursive: ['"Caveat"', 'cursive'],
}
```

---

## 9. Environment Variables

```
NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY=
NEXT_PUBLIC_PARTICLE_PROJECT_ID=
NEXT_PUBLIC_PARTICLE_CLIENT_KEY=
PARTICLE_APP_ID=
NEXT_PUBLIC_DEFILLAMA_BASE=https://yields.llama.fi
NEXT_PUBLIC_ARB_RPC=https://arb1.arbitrum.io/rpc
```

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Particle UA testnet quirks | Build on mainnet w/ small amounts; have a mocked-route fallback for demo |
| APY data stale / wrong | Show "as of Xs ago" timestamp; allow manual refresh |
| Magic + Particle session conflict | Particle accepts Magic-derived EOA as signer — verified in their docs; smoke-test on day 1 |
| Bridge failure mid-deposit | Surface tx status from Particle; have a "retry / claim refund" CTA |
| Demo network congestion | Pre-warm a position before the demo; have a screen-recorded fallback |

---

## 11. Stretch Goals

- Auto-rebalance: if APY on another chain beats current by >X bps for >24h, move funds.
- Multi-asset baskets (deposit 50/50 USDC + ETH).
- Push notifications on yield changes.
- Embedded fiat on-ramp via Magic.
- A small fee (10 bps) to a treasury multisig.
