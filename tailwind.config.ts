import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FAF6EE",
        ink: "#2B2420",
        forest: {
          DEFAULT: "#2F4034",
          light: "#3F5646",
          dark: "#1E2B22",
        },
        mauve: {
          DEFAULT: "#C97B84",
          light: "#E7B6BC",
          dark: "#9E5760",
        },
        gold: {
          DEFAULT: "#B8925A",
          light: "#D9BD8E",
        },
        blush: "#F1DEDA",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-work-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      borderRadius: {
        organic: "63% 37% 54% 46% / 43% 39% 61% 57%",
      },
      boxShadow: {
        soft: "0 20px 60px -20px rgba(43, 36, 32, 0.25)",
        card: "0 8px 24px -8px rgba(43, 36, 32, 0.18)",
      },
      keyframes: {
        bloom: {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        drift: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(2deg)" },
        },
      },
      animation: {
        bloom: "bloom 0.6s ease-out both",
        drift: "drift 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
