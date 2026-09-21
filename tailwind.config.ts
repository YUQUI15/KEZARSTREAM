import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        pastel: {
          yellow: "#F3EFA1",
          rose: "#FEAEBB",
          pink: "#F3B2DB",
          purple: "#C19ADE",
          blue: "#6FCFEB",
          mint: "#99E6D8",
        },
      },
      boxShadow: {
        "pastel-blue": "0 8px 30px rgba(111, 207, 235, 0.25)",
        "pastel-purple": "0 8px 30px rgba(193, 154, 222, 0.25)",
        "pastel-pink": "0 8px 30px rgba(243, 178, 219, 0.25)",
        "pastel-rose": "0 8px 30px rgba(254, 174, 187, 0.25)",
        "pastel-mint": "0 8px 30px rgba(153, 230, 216, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
