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

function Navigation({ close }: { close?: () => void }) {
  return (
    <nav aria-label="Primary navigation" className="flex flex-col gap-1 lg:flex-row">
      {canonical.meta.views.map((view) => (
        <NavLink
          key={view.id}
          to={pathByView[view.id]}
          end={view.id === "timeline"}
          onClick={close}
          className={({ isActive }) =>
            `rounded-md px-3 py-2 font-mono text-[11px] uppercase tracking-[0.13em] transition-colors ${
              isActive
                ? "bg-cyan/10 text-cyan"
                : "text-muted hover:bg-raised hover:text-ink"
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
        <header className="sticky top-0 z-50 border-b border-line/80 bg-canvas/95 backdrop-blur-sm">
          <div className="mx-auto flex min-h-16 max-w-[1500px] items-center justify-between gap-5 px-4 md:px-6">
            <NavLink to="/" className="min-w-0">
              <span className="block truncate text-sm font-semibold tracking-[-0.01em] text-ink">
                {canonical.meta.site_title}
              </span>
              <span className="hidden font-mono text-[9px] uppercase tracking-[0.17em] text-muted sm:block">
                {canonical.meta.site_subtitle}
              </span>
            </NavLink>
            <div className="hidden lg:block">
              <Navigation />
            </div>
            <div className="hidden text-right xl:block">
              <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                {canonical.meta.last_updated_label}
              </span>
              <span className="text-xs text-ink">{formatIsoDate(newestChangelogDate)}</span>
            </div>
            <button
              type="button"
              className="rounded-md border border-line p-2 text-muted lg:hidden"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
          {menuOpen ? (
            <div className="border-t border-line bg-panel p-4 lg:hidden">
              <Navigation close={() => setMenuOpen(false)} />
            </div>
          ) : null}
        </header>
        <main className="mx-auto max-w-[1500px] px-4 py-8 md:px-6 md:py-12">{children}</main>
        <footer className="border-t border-line">
          <div className="mx-auto grid max-w-[1500px] gap-4 px-4 py-8 text-xs text-muted md:grid-cols-[1fr_auto] md:px-6">
            <p>{canonical.meta.scoring_convention}</p>
            <p className="font-mono uppercase tracking-[0.12em]">
              {canonical.meta.next_review_label}: {formatIsoDate(canonical.meta.next_review_date)}
            </p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
}
