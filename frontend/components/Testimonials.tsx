import { avatar } from "@/lib/assets";

const quotes = [
  {
    name: "Sasha P.",
    role: "DeFi power-user",
    img: avatar(12),
    body:
      "I used to bridge manually every time APYs flipped. Photon just does it. The first thing in DeFi that actually feels like an app.",
  },
  {
    name: "Marcus L.",
    role: "Crypto-curious",
    img: avatar(33),
    body:
      "Logged in with Google, deposited 500 USDC, earned within a minute. I have no idea what chain my money is on. That's the point.",
  },
  {
    name: "Yuki T.",
    role: "Treasury ops",
    img: avatar(45),
    body:
      "We park stables on Photon and never think about gas tokens again. Withdrawing back to Base in one click is everything.",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <p className="font-display italic text-2xl text-brand">people who use it</p>
      <h2 className="mt-2 text-4xl font-semibold">
        Built for everyone. Quietly loved by the pros.
      </h2>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {quotes.map((q) => (
          <figure
            key={q.name}
            className="flex h-full flex-col justify-between rounded-2xl border border-line bg-white/[0.02] p-6 transition hover:border-brand"
          >
            <blockquote className="text-lg leading-relaxed text-fg/90">
              &ldquo;{q.body}&rdquo;
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={q.img}
                alt=""
                className="h-10 w-10 rounded-full ring-2 ring-brand/30"
              />
              <div>
                <div className="text-sm font-medium">{q.name}</div>
                <div className="text-xs text-muted">{q.role}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
