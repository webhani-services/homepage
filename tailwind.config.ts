import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#eab308",
          dark: "#ca8a04",
        },
        secondary: {
          light: "#ca8a04",
          dark: "#a16207",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "128": "32rem",
        "136": "34rem",
        "144": "36rem",
      },
    },
  },
  plugins: [],
};
export default config;
