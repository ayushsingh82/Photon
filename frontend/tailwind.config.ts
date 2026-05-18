import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#000000",
        fg: "#FFFFFF",
        brand: "#A500E6",
        "brand-soft": "#A500E61A",
        muted: "#9CA3AF",
        line: "#1A1A1A",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        glow: "0 0 40px 0 rgba(165, 0, 230, 0.35)",
      },
    },
  },
  plugins: [],
} satisfies Config;
