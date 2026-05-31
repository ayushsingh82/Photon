<div align="center">

<img src="assets/logo.svg" width="96" height="96" alt="Photon logo" />

# Photon

### Cross-chain DeFi yield, in one click.

**Social login. No bridges. No gas tokens.**

Deposit USDC, USDT, or ETH from any chain — Photon auto-routes it to the
highest-APY market on Aave or Morpho and settles on Arbitrum, with gasless,
chain-abstracted execution.

Built for the **Particle Network Hackathon**.

[Quick start](#-quick-start) · [How it works](#-how-it-works) · [Architecture](#-architecture) · [Project layout](#-project-layout)

</div>

---

## The problem

DeFi yield is good. The UX is brutal. To chase the best rate a user has to:

> pick a chain → bridge to it → buy the gas token → approve → approve again →
> deposit → watch the wrong chain → and repeat every time the best APY moves.

Each step is a place to lose funds, time, or patience. Most people never make it
past "buy the gas token."

## The solution

**Photon collapses all of it into a single button.** Sign in with an email or
Google account, type an amount, and press deposit. Behind that one click Photon:

1. Reads **live yields** across Aave v3 and Morpho Blue and picks the winner.
2. Builds **one Universal Transaction** that sources your funds from wherever
   they sit across chains.
3. **Bridges, sponsors gas, and supplies** into the chosen market — atomically.

No seed phrase. No bridge UI. No gas token. One signature.

---

## ✨ Features

| | |
|---|---|
| 🔑 **Seedless login** | Email OTP or Google via **Magic Labs** — non-custodial, no seed phrase. |
| 🌐 **One account, every chain** | A **Particle Universal Account** holds a unified balance across Ethereum, Base, Polygon, Optimism, and Arbitrum. |
| ⛽ **Gasless** | Gas is sponsored and paid in the asset you deposit — never hold the native token. |
| 🧭 **Live auto-routing** | Real-time APY from the **DefiLlama Yields API**; Photon settles into the best Aave / Morpho market. |
| ↩️ **Withdraw anywhere** | Pull funds back to any supported chain in one click. |

---

## 🛠 Stack

| Layer | Choice |
|---|---|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript, Tailwind |
| **Auth** | Magic Labs SDK (`magic-sdk`, `@magic-ext/oauth2`) |
| **Smart accounts** | Particle Network — Universal Accounts (`@particle-network/universal-account-sdk`) |
| **Onchain** | `viem` (calldata), `ethers` (Magic signer), Aave v3, Morpho Blue |
| **Yield oracle** | DefiLlama Yields API (no key) |
| **State** | Zustand |
| **Settlement** | Arbitrum One |

---

## 🔍 How it works

### Deposit flow

```
  User                Magic            Photon              Particle UA           Arbitrum
   │  email / google    │                │                      │                    │
   ├───────────────────▶│  EOA + signer  │                      │                    │
   │                    ├───────────────▶│ provision UA(owner)  │                    │
   │                    │                ├─────────────────────▶│ smart account addr │
   │  "Deposit 100 USDC"│                │                      │                    │
   ├────────────────────┼───────────────▶│ bestRoute(USDC) ─ DefiLlama              │
   │                    │                ├─ buildAaveSupply(approve + supply) ──────▶│
   │                    │                ├─────────────────────▶│ createUniversalTx  │
   │   sign rootHash    │◀───────────────┼──────────────────────┤                    │
   ├───────────────────▶│  signature     ├─────────────────────▶│ sendTransaction    │
   │                    │                │     source · bridge · gas · supply ──────▶│ aTokens
```

1. **Auth** — Magic returns a non-custodial EOA. That EOA is the *owner* (signer)
   of the user's Particle Universal Account.
2. **Route** — `lib/apy.ts` filters the live DefiLlama pool list down to Aave v3 /
   Morpho Blue markets for USDC / USDT / ETH and picks the highest APY.
3. **Build** — `lib/aave.ts` encodes the `approve → supply` calldata with `viem`.
4. **Execute** — `lib/particle.ts` wraps it in a Universal Transaction. The owner
   signs a single `rootHash`; Particle sources funds across chains, bridges,
   sponsors gas, and executes on the destination chain.

The unified USD balance shown in the header comes straight from
`UniversalAccount.getPrimaryAssets()` — one number across every chain.

---

## 🧱 Architecture

```
┌────────────────────────── Next.js (Vercel) ──────────────────────────┐
│                                                                       │
│  app/            components/         store/session.ts (Zustand)       │
│  ├ page          ├ ConnectButton ──▶ user · account · balance · deposit
│  ├ deposit ──────┤ SessionProvider                                    │
│  └ dashboard     └ Logo / Nav            │                            │
│                                          ▼                            │
│   lib/  magic.ts ──▶ particle.ts ──▶ aave.ts ──▶ apy.ts / chains.ts   │
└──────────┬───────────────┬──────────────────────────┬────────────────┘
           ▼               ▼                           ▼
      Magic Labs     Particle Universal          DefiLlama Yields
     (auth, EOA)        Accounts (CHA)              (APY oracle)
                            │
                            ▼
                  Arbitrum · Aave v3 / Morpho Blue
```

Photon **deploys no contracts** — it calls existing, audited protocols directly.

| Protocol | Contract (Arbitrum) | Methods |
|---|---|---|
| Aave v3 `Pool` | `0x794a61358D6845594F94dc1DB02A252b5b4814aD` | `supply`, `withdraw` |
| Morpho Blue | `0x6c247b1F6182318877311737BaC0844bAa518F5e` | `supply`, `withdraw` |

---

## 🚀 Quick start

```bash
cd frontend
npm install

cp .env.example .env.local   # fill in Magic + Particle keys
npm run dev                  # → http://localhost:3000
```

### Environment

| Key | Where to get it |
|---|---|
| `NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY` | https://dashboard.magic.link |
| `NEXT_PUBLIC_PARTICLE_PROJECT_ID` | https://dashboard.particle.network |
| `NEXT_PUBLIC_PARTICLE_CLIENT_KEY` | https://dashboard.particle.network |
| `NEXT_PUBLIC_PARTICLE_APP_ID` | https://dashboard.particle.network |

> The yield layer (`lib/apy.ts`) needs **no keys** — it runs against the public
> DefiLlama API out of the box, so the routing UI is live before you configure auth.

```bash
npm run build   # production build
npm run lint    # eslint
```

---

## 📁 Project layout

```
photon/
├── README.md                   # you are here
├── assets/logo.svg             # brand mark
└── frontend/
    ├── PLANNING.md             # architecture, milestones, risks
    ├── app/                    # App Router routes
    │   ├── page.tsx            #   landing
    │   ├── deposit/            #   live deposit flow (best route + Universal Tx)
    │   ├── dashboard/          #   live positions, balance, top pools
    │   └── docs/               #   what we build: stack, architecture, addresses
    ├── components/
    │   ├── ConnectButton.tsx   #   Magic login / account chip
    │   ├── SessionProvider.tsx #   restores session on load
    │   └── Logo, Nav, …        #   UI primitives
    ├── store/
    │   └── session.ts          #   Zustand: user · UA · balance · deposit
    └── lib/
        ├── magic.ts            #   seedless login + ethers signer
        ├── particle.ts         #   Universal Account: provision, balance, deposit
        ├── aave.ts             #   Aave v3 supply/withdraw calldata (viem)
        ├── positions.ts        #   on-chain Aave positions + pricing
        ├── apy.ts              #   DefiLlama yields → best route
        └── chains.ts           #   chain / token / protocol registries
```

---

## 🗺 Roadmap

- [x] Live DefiLlama yield routing
- [x] Magic seedless auth + Particle Universal Account provisioning
- [x] Gasless cross-chain Aave deposit via one Universal Transaction
- [ ] One-click withdraw to any chain
- [ ] Auto-rebalance when the best APY moves
- [ ] Morpho Blue market selection by collateral

See [`PLANNING.md`](./frontend/PLANNING.md) for the full design and non-goals.

---

<div align="center">
<sub>Photon · cross-chain yield in one click · Particle Network Hackathon</sub>
</div>
