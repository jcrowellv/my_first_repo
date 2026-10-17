import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { canonical } from "../lib/data";
import { TimelineView } from "./TimelineView";
import { RSIView } from "./RSIView";
import { ForecastsView } from "./ForecastsView";
import { EvidenceLedger } from "./EvidenceLedger";
import { FalsifierBoard } from "./FalsifierBoard";
import { BottleneckTracker } from "./BottleneckTracker";
import { MethodologyView } from "./MethodologyView";
import { GlossaryView } from "./GlossaryView";
import { ChangelogView } from "./ChangelogView";

const routes = [
  ["/", TimelineView],
  ["/rsi", RSIView],
  ["/forecasts", ForecastsView],
  ["/evidence", EvidenceLedger],
  ["/falsifiers", FalsifierBoard],
  ["/bottlenecks", BottleneckTracker],
  ["/methodology", MethodologyView],
  ["/glossary", GlossaryView],
  ["/changelog", ChangelogView],
] as const;

describe("route content and navigation", () => {
  const rendered = new Map(
    routes.map(([path, View]) => [
      path,
      renderToStaticMarkup(
        <MemoryRouter initialEntries={[path]}>
          {createElement(View)}
        </MemoryRouter>,
      ),
    ]),
  );
  it.each(routes)(
    "renders %s with a page heading and unique anchors",
    (path) => {
      const html = rendered.get(path)!;
      expect(html.match(/<h1[ >]/g)?.length).toBe(1);
      const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
      expect(new Set(ids).size).toBe(ids.length);
    },
  );
  it("keeps every published navigation target reachable", () => {
    const paths = canonical.meta.navigation.flatMap((group) => [
      group.path,
      ...group.children.map((c) => c.path),
    ]);
    for (const path of paths) {
      const url = new URL(path, "https://ledger.example");
      const html = rendered.get(url.pathname as (typeof routes)[number][0]);
      expect(html, path).toBeDefined();
      if (url.hash) expect(html, path).toContain(`id="${url.hash.slice(1)}"`);
    }
  });
  it("renders the complete packet audit and the successor monitor", () => {
    const html = rendered.get("/rsi")!;
    for (const claim of canonical.research_review.claims) {
      expect(html).toContain(`id="claim-${claim.id}"`);
    }
    expect(rendered.get("/falsifiers")).toContain('id="f-successor-gains"');
  });
});
