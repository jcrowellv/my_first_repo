import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#080c12",
        panel: "#0d131c",
        raised: "#131b26",
        line: "#253143",
        ink: "#e8edf4",
        muted: "#8997aa",
        cyan: "#5fd5e8",
        amber: "#f5ae54",
        violet: "#a990ff",
        rose: "#f07b91",
        green: "#6bd49a"
      },
      boxShadow: {
        instrument: "0 24px 70px rgba(0,0,0,.26)"
      }
    }
  },
  plugins: []
} satisfies Config;
