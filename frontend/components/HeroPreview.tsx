import { TokenLogo, ChainLogo, ProtocolLogo } from "@/components/Logo";

// A semi-realistic "product screenshot" rendered in real HTML so it stays
// crisp on every screen. Used in the hero — the first thing the user sees.
export function HeroPreview() {
  return (
    <div className="relative">
      {/* glow */}
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-brand/20 blur-3xl" />

      <div className="rounded-3xl border border-line bg-[#0A0A0A] p-5 shadow-2xl">
        {/* fake window chrome */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-muted">
            photon · deposit
          </span>
        </div>

        {/* asset row */}
        <div className="mt-5 flex items-center justify-between rounded-2xl border border-line bg-bg p-4">
          <div className="flex items-center gap-3">
            <TokenLogo symbol="USDC" size="lg" />
            <div>
              <div className="text-xs uppercase tracking-widest text-muted">
                You deposit
              </div>
              <div className="text-xl font-medium">2,500.00 USDC</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs uppercase tracking-widest text-muted">
              From
            </span>
            <div className="mt-1 flex items-center gap-1.5">
              <ChainLogo slug="base" size="sm" />
              <span className="text-sm">Base</span>
            </div>
          </div>
        </div>

        {/* route line */}
        <div className="my-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <span className="rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-[11px] uppercase tracking-widest text-brand">
            auto-route via particle
          </span>
          <span className="h-px flex-1 bg-line" />
        </div>

        {/* destination row */}
        <div className="flex items-center justify-between rounded-2xl border border-brand/50 bg-brand/[0.06] p-4 shadow-glow">
          <div className="flex items-center gap-3">
            <ProtocolLogo slug="aave" size="lg" />
            <div>
              <div className="text-xs uppercase tracking-widest text-muted">
                Supply to
              </div>
              <div className="text-xl font-medium">Aave v3</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs uppercase tracking-widest text-muted">
              On
            </span>
            <div className="mt-1 flex items-center gap-1.5">
              <ChainLogo slug="arbitrum" size="sm" />
              <span className="text-sm">Arbitrum</span>
            </div>
          </div>
        </div>

        {/* footer numbers */}
        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <Stat label="APY" value="4.81%" accent />
          <Stat label="Est. yearly" value="120.25 USDC" />
          <Stat label="Gas" value="Sponsored" />
        </div>

        <button className="mt-5 w-full rounded-2xl bg-brand py-3 text-sm font-medium text-white shadow-glow transition hover:brightness-110">
          Deposit 2,500 USDC →
        </button>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-line bg-bg p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted">
        {label}
      </div>
      <div className={`mt-1 text-sm font-medium ${accent ? "text-brand" : ""}`}>
        {value}
      </div>
    </div>
  );
}
