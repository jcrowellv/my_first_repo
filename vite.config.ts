import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";

const canonical = JSON.parse(
  readFileSync(new URL("./data/canonical.json", import.meta.url), "utf8"),
) as { meta: { site_title: string; site_description: string } };

export default defineConfig({
  plugins: [
    react(),
    {
      name: "canonical-index-metadata",
      transformIndexHtml(html) {
        return html
          .replaceAll("%SITE_TITLE%", canonical.meta.site_title)
          .replaceAll("%SITE_DESCRIPTION%", canonical.meta.site_description);
      },
    },
  ],
  base:
    process.env.GITHUB_PAGES === "true"
      ? process.env.VITE_BASE_PATH ?? "/my_first_repo/"
      : "/",
  build: {
    target: "es2022",
    sourcemap: false,
  },
});
