/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14161A",
        body: "#363B43",
        muted: "#626872",
        line: "#E6E8EB",
        mist: "#F5F6F7",
        lime: { DEFAULT: "#C5E86C", deep: "#A6E22E" },
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
        card: "0 24px 48px -30px rgba(20,22,26,0.22)",
        tile: "0 8px 20px -14px rgba(20,22,26,0.2)",
        cta: "0 12px 28px -10px rgba(20,22,26,0.5), inset 0 1px 0 rgba(255,255,255,0.18)",
      },
    },
  },
  plugins: [],
};
