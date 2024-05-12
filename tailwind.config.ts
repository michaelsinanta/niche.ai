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
        primary: "#6d00f9",
        secondary: "#eae7fb",
        purple: "#6E00FA",
        lightpurple: "#F5E8FF",
        green: "#66D63F",
        lilac: "#B6B8F7",
      },
      fontFamily: {
        jakarta: "jakarta",
      },
    },
  },
  plugins: [],
};
export default config;
