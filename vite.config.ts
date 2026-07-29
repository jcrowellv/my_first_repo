import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const canonicalSource = readFileSync(
  new URL("./data/canonical.json", import.meta.url),
  "utf8",
);
const canonical = JSON.parse(canonicalSource) as {
  meta: { site_title: string; site_description: string; site_url: string };
};
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const sitesWorkerSource =
  "export default { async fetch(request, env) { return env.ASSETS.fetch(request); } };";
let projectRoot = process.cwd();

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
          .replaceAll("%OG_IMAGE%", new URL("og-v2.png", canonical.meta.site_url).href);
      },
    },
    {
      name: "publish-canonical-data",
      configResolved(config) {
        projectRoot = config.root;
        if (!isGitHubPages) {
          rmSync(resolve(projectRoot, "dist"), { force: true, recursive: true });
        }
      },
      generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "data/canonical.json",
          source: canonicalSource,
        });
      },
      closeBundle() {
        if (!isGitHubPages) {
          const serverDirectory = resolve(projectRoot, "dist", "server");
          mkdirSync(serverDirectory, { recursive: true });
          writeFileSync(
            resolve(serverDirectory, "index.js"),
            sitesWorkerSource,
            "utf8",
          );
        }
      },
    },
  ],
  base: isGitHubPages
    ? process.env.VITE_BASE_PATH ?? "/my_first_repo/"
    : "/",
  build: {
    target: "es2022",
    sourcemap: false,
    outDir: isGitHubPages ? "dist" : "dist/client",
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-dom/client", "react-router"],
          "markdown-vendor": ["react-markdown", "remark-gfm"],
          "validation-vendor": ["zod"],
          "icons-vendor": ["lucide-react"],
        },
      },
    },
  },
});
