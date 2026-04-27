import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["DM Serif Display", "Georgia", "serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
      colors: {
        background: "#0c0c0d",
        surface: "#141416",
        "surface-raised": "#1c1c1f",
        "surface-hover": "#232328",
        border: "#2a2a2f",
        "border-subtle": "#1f1f24",
        amber: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
          DEFAULT: "#f59e0b",
          dim: "#d97706",
          deep: "#b45309",
          muted: "#92400e",
          subtle: "#1c1308",
          glow: "rgba(245, 158, 11, 0.15)",
        },
        paper: {
          DEFAULT: "#fafaf9",
          ink: "#1c1917",
          muted: "#57534e",
          subtle: "#78716c",
          line: "#e7e5e4",
          fine: "#d6d3d1",
        },
        text: {
          primary: "#f4f4f5",
          secondary: "#a1a1aa",
          muted: "#52525b",
          inverse: "#0c0c0d",
        },
        green: {
          profit: "#22c55e",
          "profit-muted": "#14532d",
          "profit-subtle": "#0d2a18",
        },
        red: {
          expense: "#ef4444",
          "expense-muted": "#7f1d1d",
          "expense-subtle": "#2a0d0d",
        },
      },
      borderRadius: {
        DEFAULT: "8px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)",
        "card-hover":
          "0 4px 16px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)",
        amber: "0 0 20px rgba(245, 158, 11, 0.2)",
        "amber-sm": "0 0 8px rgba(245, 158, 11, 0.15)",
        paper: "0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.5)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(-12px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out forwards",
        "fade-in-delay-1": "fade-in 0.4s 0.1s ease-out forwards",
        "fade-in-delay-2": "fade-in 0.4s 0.2s ease-out forwards",
        "fade-in-delay-3": "fade-in 0.4s 0.3s ease-out forwards",
        "fade-in-delay-4": "fade-in 0.4s 0.4s ease-out forwards",
        "slide-in": "slide-in 0.3s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
