import type { Config } from "tailwindcss";

const rgb = (name: string) => `rgb(var(--qd-${name}) / <alpha-value>)`;
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        qd: {
          bg: rgb("bg"), card: rgb("card"), card2: rgb("card2"), line: rgb("line"),
          green: rgb("green"), emerald: rgb("emerald"), text: rgb("text"), mute: rgb("mute"),
          red: rgb("red"), amber: rgb("amber"), nav: rgb("nav"), "warn-bg": rgb("warn-bg"),
          "on-accent": rgb("on-accent"),
        },
      },
      borderRadius: { qd: "18px" },
      boxShadow: { glow: "0 10px 30px rgba(16,185,129,.15)" },
    },
  },
  plugins: [],
};
export default config;