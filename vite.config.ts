import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";

const canonicalSource = readFileSync(
  new URL("./data/canonical.json", import.meta.url),
  "utf8",
);
const canonical = JSON.parse(canonicalSource) as {
  meta: { site_title: string; site_description: string; site_url: string };
};

export default defineConfig({
  plugins: [
    react(),
    {
      name: "canonical-index-metadata",
      transformIndexHtml(html) {
        return html
          .replaceAll("%SITE_TITLE%", canonical.meta.site_title)
          .replaceAll("%SITE_DESCRIPTION%", canonical.meta.site_description)
          .replaceAll("%SITE_URL%", canonical.meta.site_url)
          .replaceAll("%OG_IMAGE%", new URL("og.png", canonical.meta.site_url).href);
      },
    },
    {
      name: "publish-canonical-data",
      generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "data/canonical.json",
          source: canonicalSource,
        });
        this.emitFile({
          type: "asset",
          fileName: "server/index.js",
          source:
            "export default { async fetch(request, env) { return env.ASSETS.fetch(request); } };",
        });
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
