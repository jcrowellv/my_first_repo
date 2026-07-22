import { useState, type ReactNode } from "react";
import { HashRouter, NavLink } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
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
    <nav
      aria-label="Primary navigation"
      className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-0.5 lg:rounded-full lg:border lg:border-line/80 lg:bg-panel/80 lg:p-1 lg:shadow-sm"
    >
      {canonical.meta.views.map((view) => (
        <NavLink
          key={view.id}
          to={pathByView[view.id]}
          end={view.id === "timeline"}
          onClick={close}
          className={({ isActive }) =>
            `rounded-full px-4 py-2.5 text-sm transition-colors lg:py-2 ${
              isActive
                ? "bg-ink font-medium text-panel"
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
          <div className="mx-auto flex min-h-[76px] max-w-[1320px] items-center justify-between gap-6 px-5 md:px-8">
            <NavLink to="/" className="min-w-0 shrink-0" aria-label={`${canonical.meta.site_title} home`}>
              <span className="block truncate font-serif text-[21px] font-semibold tracking-[-0.01em] text-ink">
                {canonical.meta.site_title}
              </span>
              <span className="mt-0.5 hidden text-[11px] text-muted xl:block">{canonical.meta.site_subtitle}</span>
            </NavLink>
            <div className="hidden lg:block"><Navigation /></div>
            <div className="hidden min-w-[104px] shrink-0 border-l border-line pl-5 text-right xl:block">
              <span className="block font-mono text-[9px] uppercase tracking-[0.15em] text-muted">{canonical.meta.last_updated_label}</span>
              <span className="mt-1 block text-xs font-medium text-ink">{formatIsoDate(newestChangelogDate)}</span>
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
          {menuOpen ? (
            <div className="border-t border-line bg-canvas px-5 py-4 lg:hidden">
              <Navigation close={() => setMenuOpen(false)} />
            </div>
          ) : null}
        </header>
        <main className="mx-auto max-w-[1240px] px-5 py-9 md:px-8 md:py-14">{children}</main>
        <footer className="mt-20 bg-ink text-panel">
          <div className="mx-auto max-w-[1240px] px-5 py-12 md:px-8 md:py-16">
            <div className="grid gap-10 border-b border-canvas/15 pb-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">{canonical.meta.action_center.eyebrow}</p>
                <h2 className="mt-4 max-w-lg font-serif text-3xl font-semibold tracking-[-0.015em] text-panel md:text-4xl">{canonical.meta.action_center.title}</h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-canvas/65">{canonical.meta.action_center.description}</p>
              </div>
              <div className="grid gap-8 sm:grid-cols-3">
                {canonical.meta.action_center.groups.map((group) => (
                  <section key={group.id} aria-labelledby={`footer-${group.id}`}>
                    <h3 id={`footer-${group.id}`} className="font-mono text-[10px] uppercase tracking-[0.17em] text-canvas/50">{group.label}</h3>
                    <div className="mt-4 space-y-5">
                      {group.items.map((item) => (
                        <a key={item.url} href={item.url} target="_blank" rel="noreferrer" className="group/link block">
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-panel transition-colors group-hover/link:text-cyan">
                            {item.label}<ArrowUpRight size={12} aria-hidden="true" />
                          </span>
                          <span className="mt-1.5 block text-xs leading-5 text-canvas/55">{item.description}</span>
                        </a>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-6 text-[11px] text-canvas/45 sm:flex-row sm:items-center sm:justify-between">
              <span>{canonical.meta.site_title} · {canonical.meta.scoring_convention}</span>
              <span>{canonical.meta.next_review_label}: {formatIsoDate(canonical.meta.next_review_date)}</span>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
}
