import { useState, type ReactNode } from "react";
import { HashRouter, NavLink } from "react-router-dom";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
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

function DesktopNavigation() {
  return (
    <nav aria-label="Primary navigation" className="flex items-center rounded-full border border-line/80 bg-panel/70 p-1 shadow-sm">
      {canonical.meta.navigation_groups.map((group) => (
        <div
          key={group.id}
          className="group relative"
          onKeyDown={(event) => {
            if (event.key === "Escape" && document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
            }
          }}
        >
          <NavLink
            to={pathByView[group.id]}
            end={group.id === "timeline"}
            aria-haspopup="true"
            className={({ isActive }) =>
              `flex items-center gap-1 rounded-full px-4 py-2.5 text-sm transition-colors ${
                isActive ? "bg-ink text-panel" : "text-muted hover:bg-raised hover:text-ink"
              }`
            }
          >
            {group.label}
            <ChevronDown size={13} aria-hidden="true" className="opacity-60 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
          </NavLink>
          <div className="invisible absolute right-0 top-full z-50 w-[520px] translate-y-1 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <div className="overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_24px_70px_rgba(19,35,54,.18)]">
              <div className="border-b border-line bg-raised/55 px-5 py-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.17em] text-cyan">Explore {group.label}</p>
                <p className="mt-2 max-w-md text-sm leading-6 text-muted">{group.summary}</p>
              </div>
              <div className="grid grid-cols-3 gap-px bg-line">
                {group.items.map((item) => (
                  <NavLink
                    key={`${group.id}-${item.view_id}`}
                    to={pathByView[item.view_id]}
                    end={item.view_id === "timeline"}
                    className={({ isActive }) => `min-h-36 bg-panel p-5 transition-colors hover:bg-raised ${isActive ? "shadow-[inset_0_3px_0_#167f92]" : ""}`}
                  >
                    <span className="block text-sm font-semibold text-ink">{item.label}</span>
                    <span className="mt-2 block text-xs leading-5 text-muted">{item.description}</span>
                    <ArrowUpRight size={13} className="mt-4 text-cyan" aria-hidden="true" />
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </nav>
  );
}

function MobileNavigation({ close }: { close: () => void }) {
  return (
    <nav aria-label="Mobile navigation" className="space-y-2">
      {canonical.meta.navigation_groups.map((group, index) => (
        <details key={group.id} open={index === 0} className="group overflow-hidden rounded-2xl border border-line bg-panel">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5">
            <span className="text-sm font-semibold text-ink">{group.label}</span>
            <ChevronDown size={15} className="text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="border-t border-line bg-raised/35 p-2">
            {group.items.map((item) => (
              <NavLink
                key={`${group.id}-${item.view_id}`}
                to={pathByView[item.view_id]}
                end={item.view_id === "timeline"}
                onClick={close}
                className={({ isActive }) => `block rounded-xl px-3 py-3 ${isActive ? "bg-ink text-panel" : "hover:bg-panel"}`}
              >
                {({ isActive }) => (
                  <>
                    <span className="block text-sm font-medium">{item.label}</span>
                    <span className={`mt-1 block text-xs leading-5 ${isActive ? "text-canvas/65" : "text-muted"}`}>{item.description}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </details>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <HashRouter>
      <div className="min-h-screen bg-canvas text-ink">
        <header className="sticky top-0 z-50 border-b border-line/80 bg-canvas/95 backdrop-blur-xl">
          <div className="mx-auto flex min-h-[82px] max-w-[1320px] items-center justify-between gap-6 px-5 md:px-8">
            <NavLink to="/" className="min-w-0 shrink-0" aria-label={`${canonical.meta.site_title} home`}>
              <span className="block truncate text-[17px] font-semibold tracking-[-0.035em] text-ink">
                {canonical.meta.site_title}
              </span>
              <span className="mt-0.5 hidden text-[11px] text-muted sm:block">{canonical.meta.site_subtitle}</span>
            </NavLink>
            <div className="hidden lg:block"><DesktopNavigation /></div>
            <div className="hidden min-w-[108px] border-l border-line pl-5 text-right xl:block">
              <span className="block font-mono text-[9px] uppercase tracking-[0.15em] text-muted">{canonical.meta.last_updated_label}</span>
              <span className="mt-1 block text-xs font-medium text-ink">{formatIsoDate(newestChangelogDate)}</span>
              <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-muted"><span className="h-1.5 w-1.5 rounded-full bg-green" /> Public record</span>
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
          {menuOpen ? <div className="max-h-[calc(100vh-82px)] overflow-y-auto border-t border-line bg-canvas px-5 py-4 lg:hidden"><MobileNavigation close={() => setMenuOpen(false)} /></div> : null}
        </header>
        <main className="mx-auto max-w-[1240px] px-5 py-9 md:px-8 md:py-14">{children}</main>
        <footer className="mt-20 bg-ink text-panel">
          <div className="mx-auto max-w-[1240px] px-5 py-12 md:px-8 md:py-16">
            <div className="grid gap-10 border-b border-canvas/15 pb-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">{canonical.meta.action_center.eyebrow}</p>
                <h2 className="mt-4 max-w-lg text-3xl font-semibold tracking-[-0.045em] text-panel md:text-4xl">{canonical.meta.action_center.title}</h2>
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
