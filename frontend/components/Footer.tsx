import { ProtocolLogo, ChainStack } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-baseline gap-2">
              <span className="font-display italic text-3xl text-brand">Photon</span>
              <span className="text-xs text-muted">cross-chain yield</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted">
              One-click access to the best DeFi yields. Powered by Magic for
              social login and Particle Network for chain-abstracted execution.
            </p>
            <div className="mt-4">
              <div className="text-xs uppercase tracking-widest text-muted">
                Live on
              </div>
              <div className="mt-2 flex items-center gap-3">
                <ChainStack
                  slugs={[
                    "ethereum",
                    "arbitrum",
                    "base",
                    "polygon",
                    "optimism",
                  ]}
                  size="sm"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-muted">
              Product
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a className="text-fg/80 hover:text-brand" href="/deposit">
                  Deposit
                </a>
              </li>
              <li>
                <a className="text-fg/80 hover:text-brand" href="/dashboard">
                  Dashboard
                </a>
              </li>
              <li>
                <a className="text-fg/80 hover:text-brand" href="/">
                  How it works
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-muted">
              Built with
            </div>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <ProtocolLogo slug="particle" size="xs" />
                <span className="text-fg/80">Particle Network</span>
              </li>
              <li className="flex items-center gap-2">
                <ProtocolLogo slug="magic" size="xs" />
                <span className="text-fg/80">Magic Labs</span>
              </li>
              <li className="flex items-center gap-2">
                <ProtocolLogo slug="aave" size="xs" />
                <span className="text-fg/80">Aave v3</span>
              </li>
              <li className="flex items-center gap-2">
                <ProtocolLogo slug="morpho" size="xs" />
                <span className="text-fg/80">Morpho Blue</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-muted md:flex-row">
          <span>© {new Date().getFullYear()} Photon. All rights reserved.</span>
          <span>
            Built for the <span className="text-brand">Particle Network Hackathon</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
