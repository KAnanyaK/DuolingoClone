import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      keyframes: {
        "owl-waddle": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "25%": { transform: "translateY(-6px) rotate(-5deg)" },
          "50%": { transform: "translateY(0) rotate(0deg)" },
          "75%": { transform: "translateY(-6px) rotate(5deg)" },
        },
        "owl-wing-left": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(-25deg)" },
        },
        "owl-wing-right": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(25deg)" },
        },
        "panda-chew": {
          "0%, 100%": { transform: "translateY(0) scaleY(1)" },
          "30%": { transform: "translateY(2px) scaleY(0.96)" },
          "60%": { transform: "translateY(-2px) scaleY(1.02)" },
        },
        "bamboo-nibble": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(-8deg)" },
        },
        "painter-brush": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-12deg) translateY(-4px)" },
          "50%": { transform: "rotate(8deg) translateY(2px)" },
          "75%": { transform: "rotate(-6deg) translateY(-2px)" },
        },
      },
      animation: {
        "owl-dance": "owl-waddle 2s ease-in-out infinite",
        "owl-wing-l": "owl-wing-left 1s ease-in-out infinite",
        "owl-wing-r": "owl-wing-right 1s ease-in-out infinite",
        "panda-munch": "panda-chew 1.4s ease-in-out infinite",
        "bamboo-shake": "bamboo-nibble 1.4s ease-in-out infinite",
        "painter-sweep": "painter-brush 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
