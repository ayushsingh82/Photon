import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yield — Cross-Chain Yield Aggregator",
  description:
    "One-click DeFi yield. Social login. No bridges. No gas tokens. Powered by Particle Universal Accounts and Magic Labs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${caveat.variable}`}>
      <body className="min-h-screen bg-bg text-fg font-sans">
        <Nav />
        <main>{children}</main>
        <footer className="border-t border-line mt-24 py-8 text-center text-muted text-sm">
          Built for the{" "}
          <span className="text-brand">Particle Network Hackathon</span>.
        </footer>
      </body>
    </html>
  );
}
