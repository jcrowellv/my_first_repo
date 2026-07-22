import { useState, type ReactNode } from "react";
import { HashRouter, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { canonical, newestChangelogDate } from "../lib/data";
import { formatIsoDate } from "../lib/dates";

const pathByView: Record<string, string> = {
  timeline: "/",
  falsifiers: "/falsifiers",
  evidence: "/evidence",
  bottlenecks: "/bottlenecks",
  changelog: "/changelog",
  methodology: "/methodology",
};

const primaryViews = new Set(["timeline", "evidence", "falsifiers", "methodology"]);

function Navigation({ close }: { close?: () => void }) {
  return (
    <nav aria-label="Primary navigation" className="flex flex-col gap-1 lg:flex-row lg:items-center">
      {canonical.meta.views.filter((view) => primaryViews.has(view.id)).map((view) => (
        <NavLink
          key={view.id}
          to={pathByView[view.id]}
          end={view.id === "timeline"}
          onClick={close}
          className={({ isActive }) =>
            `rounded-full px-4 py-2 text-sm transition-colors ${
              isActive ? "bg-ink text-panel" : "text-muted hover:bg-raised hover:text-ink"
            }`
          }
        >
          {view.label}
        </NavLink>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <HashRouter>
      <div className="min-h-screen bg-canvas text-ink">
        <header className="sticky top-0 z-50 border-b border-line/80 bg-canvas/90 backdrop-blur-xl">
          <div className="mx-auto flex min-h-[72px] max-w-[1240px] items-center justify-between gap-6 px-5 md:px-8">
            <NavLink to="/" className="min-w-0">
              <span className="block truncate text-base font-semibold tracking-[-0.025em] text-ink">
                {canonical.meta.site_title}
              </span>
              <span className="hidden text-[11px] text-muted sm:block">{canonical.meta.site_subtitle}</span>
            </NavLink>
            <div className="hidden lg:block"><Navigation /></div>
            <div className="hidden border-l border-line pl-5 text-right xl:block">
              <span className="block font-mono text-[9px] uppercase tracking-[0.15em] text-muted">{canonical.meta.last_updated_label}</span>
              <span className="text-xs text-ink">{formatIsoDate(newestChangelogDate)}</span>
            </div>
            <button
              type="button"
              className="rounded-full border border-line bg-panel p-2.5 text-muted lg:hidden"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
          {menuOpen ? <div className="border-t border-line bg-panel px-5 py-4 lg:hidden"><Navigation close={() => setMenuOpen(false)} /></div> : null}
        </header>
        <main className="mx-auto max-w-[1240px] px-5 py-9 md:px-8 md:py-14">{children}</main>
        <footer className="mt-16 border-t border-line bg-panel/60">
          <div className="mx-auto grid max-w-[1240px] gap-8 px-5 py-10 md:grid-cols-[1fr_auto] md:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-ink">{canonical.meta.site_title}</p>
              <p className="mt-2 text-xs leading-5 text-muted">{canonical.meta.scoring_convention}</p>
            </div>
            <div className="flex flex-wrap items-start gap-x-5 gap-y-3 text-xs">
              <NavLink className="text-muted hover:text-ink" to="/bottlenecks">{canonical.meta.views.find((v) => v.id === "bottlenecks")?.label}</NavLink>
              <NavLink className="text-muted hover:text-ink" to="/changelog">{canonical.meta.views.find((v) => v.id === "changelog")?.label}</NavLink>
              <span className="text-muted">{canonical.meta.next_review_label}: {formatIsoDate(canonical.meta.next_review_date)}</span>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
}
