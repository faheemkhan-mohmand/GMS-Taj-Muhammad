import type { Config } from "tailwindcss";

const tokenScale = () => ({
  50: `rgb(var(--bg-rgb) / <alpha-value>)`,
  100: `rgb(var(--surface-raised-rgb) / <alpha-value>)`,
  200: `rgb(var(--border-rgb) / <alpha-value>)`,
  300: `rgb(var(--border-rgb) / <alpha-value>)`,
  400: `rgb(var(--text-muted-rgb) / <alpha-value>)`,
  500: `rgb(var(--primary-rgb) / <alpha-value>)`,
  600: `rgb(var(--primary-rgb) / <alpha-value>)`,
  700: `rgb(var(--primary-rgb) / <alpha-value>)`,
  800: `rgb(var(--primary-strong-rgb) / <alpha-value>)`,
  900: `rgb(var(--primary-strong-rgb) / <alpha-value>)`,
  950: `rgb(var(--primary-strong-rgb) / <alpha-value>)`,
});

const greenPalette = tokenScale();
const goldPalette = {
  50: `rgb(var(--bg-rgb) / <alpha-value>)`,
  100: `rgb(var(--accent-soft-rgb) / <alpha-value>)`,
  200: `rgb(var(--accent-soft-rgb) / <alpha-value>)`,
  300: `rgb(var(--accent-rgb) / <alpha-value>)`,
  400: `rgb(var(--accent-rgb) / <alpha-value>)`,
  500: `rgb(var(--accent-rgb) / <alpha-value>)`,
  600: `rgb(var(--accent-rgb) / <alpha-value>)`,
  700: `rgb(var(--primary-rgb) / <alpha-value>)`,
  800: `rgb(var(--primary-strong-rgb) / <alpha-value>)`,
  900: `rgb(var(--primary-strong-rgb) / <alpha-value>)`,
  950: `rgb(var(--primary-strong-rgb) / <alpha-value>)`,
};
const neutralPalette = {
  50: `rgb(var(--bg-rgb) / <alpha-value>)`,
  100: `rgb(var(--surface-raised-rgb) / <alpha-value>)`,
  200: `rgb(var(--border-rgb) / <alpha-value>)`,
  300: `rgb(var(--border-rgb) / <alpha-value>)`,
  400: `rgb(var(--text-muted-rgb) / <alpha-value>)`,
  500: `rgb(var(--text-muted-rgb) / <alpha-value>)`,
  600: `rgb(var(--text-muted-rgb) / <alpha-value>)`,
  700: `rgb(var(--text-primary-rgb) / <alpha-value>)`,
  800: `rgb(var(--text-primary-rgb) / <alpha-value>)`,
  900: `rgb(var(--text-primary-rgb) / <alpha-value>)`,
  950: `rgb(var(--text-primary-rgb) / <alpha-value>)`,
};

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        display: ['Cormorant Garamond', 'Playfair Display', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        gold: {
          DEFAULT: "rgb(var(--accent-rgb) / <alpha-value>)",
          soft: "rgb(var(--accent-soft-rgb) / <alpha-value>)",
        },
        azure: {
          DEFAULT: "rgb(var(--primary-rgb) / <alpha-value>)",
          strong: "rgb(var(--primary-strong-rgb) / <alpha-value>)",
          soft: "rgb(var(--surface-raised-rgb) / <alpha-value>)",
        },
        border: "rgb(var(--border-rgb) / <alpha-value>)",
        input: "rgb(var(--border-rgb) / <alpha-value>)",
        ring: "rgb(var(--accent-rgb) / <alpha-value>)",
        background: "rgb(var(--bg-rgb) / <alpha-value>)",
        foreground: "rgb(var(--text-primary-rgb) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary-rgb) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground-rgb) / <alpha-value>)",
          dark: "rgb(var(--primary-strong-rgb) / <alpha-value>)",
          light: "rgb(var(--primary-rgb) / <alpha-value>)",
          glow: "rgb(var(--primary-rgb) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--surface-raised-rgb) / <alpha-value>)",
          foreground: "rgb(var(--text-primary-rgb) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgb(var(--primary-strong-rgb) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground-rgb) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--surface-raised-rgb) / <alpha-value>)",
          foreground: "rgb(var(--text-muted-rgb) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent-rgb) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground-rgb) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--surface-rgb) / <alpha-value>)",
          foreground: "rgb(var(--text-primary-rgb) / <alpha-value>)",
        },
        card: {
          DEFAULT: "rgb(var(--surface-rgb) / <alpha-value>)",
          foreground: "rgb(var(--text-primary-rgb) / <alpha-value>)",
        },
        success: "rgb(var(--primary-rgb) / <alpha-value>)",
        warning: "rgb(var(--accent-rgb) / <alpha-value>)",
        red: greenPalette,
        orange: goldPalette,
        amber: goldPalette,
        yellow: goldPalette,
        lime: greenPalette,
        green: greenPalette,
        emerald: greenPalette,
        teal: greenPalette,
        cyan: greenPalette,
        sky: greenPalette,
        blue: greenPalette,
        indigo: greenPalette,
        violet: greenPalette,
        purple: greenPalette,
        fuchsia: goldPalette,
        pink: goldPalette,
        rose: goldPalette,
        slate: neutralPalette,
        gray: neutralPalette,
        zinc: neutralPalette,
        neutral: neutralPalette,
        stone: neutralPalette,
        white: "rgb(var(--surface-rgb) / <alpha-value>)",
        black: "rgb(var(--bg-rgb) / <alpha-value>)",
        sidebar: {
          DEFAULT: "rgb(var(--surface-rgb) / <alpha-value>)",
          foreground: "rgb(var(--text-primary-rgb) / <alpha-value>)",
          primary: "rgb(var(--primary-rgb) / <alpha-value>)",
          "primary-foreground": "rgb(var(--primary-foreground-rgb) / <alpha-value>)",
          accent: "rgb(var(--surface-raised-rgb) / <alpha-value>)",
          "accent-foreground": "rgb(var(--text-primary-rgb) / <alpha-value>)",
          border: "rgb(var(--border-rgb) / <alpha-value>)",
          ring: "rgb(var(--accent-rgb) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "count-up": {
          from: { opacity: "0", transform: "scale(0.5)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "slide-in-right": "slide-in-right 0.5s ease-out forwards",
        "count-up": "count-up 0.4s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
