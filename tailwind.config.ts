import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(231, 21%, 12%)",
        surface: "hsl(229, 25%, 19%)",
        accent: "hsl(266, 85%, 62%)",
        "accent-soft": "hsl(266, 85%, 72%)",
        success: "hsl(152, 73%, 55%)",
        warning: "hsl(36, 100%, 68%)"
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
