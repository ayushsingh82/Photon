# Cross-Chain Yield Aggregator

> One-click DeFi yield. Social login. No bridges. No gas tokens.
> Built for the **Particle Network Hackathon**.

Deposit USDC, USDT, or ETH from any supported chain. We automatically route your funds to the highest-APY pool on **Aave** or **Morpho** (settled on **Arbitrum**), powered by **Particle Universal Accounts** for chain abstraction and **Magic Labs** for seedless social login.

---

## Why

DeFi yield is great. The UX is awful:
- Pick a chain. Bridge to it. Buy gas. Approve a token. Approve again. Deposit. Watch the wrong chain.
- Repeat every time the best APY moves.

This app collapses all of that into **one button**.

---

## Features

- **Social / email login** — Magic Labs. No seed phrase.
- **One account, every chain** — Particle Universal Account holds your balance across Ethereum, Base, Polygon, Optimism, Arbitrum.
- **Gasless** — pay gas in your deposited asset (Paymaster).
- **Auto-routing** — we scan Aave + Morpho across chains and pick the winner.
- **Withdraw anywhere** — pull funds back to any supported chain in one click.

---

## Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind
- **Auth:** Magic Labs SDK
- **Smart accounts:** Particle Network — Universal Accounts
- **Onchain:** viem + wagmi, Aave v3, Morpho Blue
- **APY oracle:** DefiLlama Yields API
- **Settlement:** Arbitrum One

See [`PLANNING.md`](./PLANNING.md) for full architecture and milestones.

---

## Quick Start

```bash
# 1. Clone and install
cd frontend
npm install

# 2. Configure env
cp .env.example .env.local
#  → fill in Magic + Particle keys

# 3. Run
npm run dev
# → http://localhost:3000
```

### Required env vars

| Key | Where to get it |
|---|---|
| `NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY` | https://dashboard.magic.link |
| `NEXT_PUBLIC_PARTICLE_PROJECT_ID` | https://dashboard.particle.network |
| `NEXT_PUBLIC_PARTICLE_CLIENT_KEY` | https://dashboard.particle.network |
| `PARTICLE_APP_ID` | https://dashboard.particle.network |

---

## Project Structure

```
yield-aggregator/
├── PLANNING.md          # Architecture, milestones, risks
├── README.md            # You are here
└── frontend/            # Next.js app
    ├── app/             # Routes (App Router)
    ├── components/      # UI primitives
    ├── lib/             # Magic, Particle, APY, router
    └── hooks/           # React hooks
```

---

## User Flow

1. **Sign in** with email / Google / X (Magic Labs).
2. A **Universal Account** is provisioned automatically (Particle).
3. **Deposit** an asset from any supported chain.
4. We **bridge + supply** in one transaction to the best pool.
5. **Yield accrues.** Withdraw anywhere, anytime.

---

## Demo Scenario

Aave offers **4% APY on ETH on Arbitrum**, but only 2–3% elsewhere.
Your ETH is on Ethereum mainnet.
You click **Deposit**.
We move it to Arbitrum, supply it to Aave, and you start earning the full 4% — no bridge, no gas, one click.

---

## Roadmap

- [x] Project scaffold + theme
- [ ] Magic login
- [ ] Particle Universal Account provisioning
- [ ] APY oracle (DefiLlama)
- [ ] Deposit flow — USDC happy path
- [ ] Withdraw flow
- [ ] Dashboard (positions, accrued yield)
- [ ] Auto-rebalance (stretch)

---

## License

MIT
