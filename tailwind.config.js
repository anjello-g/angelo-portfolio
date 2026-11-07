/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Semantic tokens: the actual values live in src/index.css so light/dark can swap them.
        paper: "rgb(var(--paper) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        onink: "rgb(var(--onink) / <alpha-value>)",
        body: "rgb(var(--body) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        faint: "rgb(var(--faint) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        line2: "rgb(var(--line2) / <alpha-value>)",
        mist: "rgb(var(--mist) / <alpha-value>)",
        sand: "rgb(var(--sand) / <alpha-value>)",
        band: "rgb(var(--band) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          deep: "rgb(var(--accent-deep) / <alpha-value>)",
        },
        onaccent: "rgb(var(--onaccent) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ['"Instrument Serif"', "Georgia", "serif"],
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "scaleY(0.4)" },
          "50%": { transform: "scaleY(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        wave: "wave 1s ease-in-out infinite",
      },
      boxShadow: {
        card: "0 24px 48px -30px rgb(var(--shadow) / 0.22)",
        tile: "0 8px 20px -14px rgb(var(--shadow) / 0.2)",
        cta: "0 12px 28px -10px rgb(var(--shadow) / 0.5), inset 0 1px 0 rgb(255 255 255 / 0.18)",
      },
    },
  },
  plugins: [],
};
