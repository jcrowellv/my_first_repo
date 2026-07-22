import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Newsreader Variable"', "Georgia", "Cambria", "serif"]
      },
      colors: {
        canvas: "#f3f0e8",
        panel: "#fffdf8",
        raised: "#ebe7dd",
        line: "#d6d1c5",
        ink: "#132336",
        muted: "#66717d",
        cyan: "#167f92",
        amber: "#c97828",
        violet: "#6758bd",
        rose: "#bd4963",
        green: "#2c875d"
      },
      boxShadow: {
        instrument: "0 18px 50px rgba(38,46,52,.08)"
      }
    }
  },
  plugins: []
} satisfies Config;
