import { useEffect, useState, type ReactNode } from "react";
import { HashRouter, Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { canonical, newestChangelogDate } from "../lib/data";
import { formatIsoDate } from "../lib/dates";

function RouteScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const jumpWithoutAnimation = (action: () => void) => {
      const root = document.documentElement;
      const priorBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      action();
      root.style.scrollBehavior = priorBehavior;
    };

    if (!hash) {
      jumpWithoutAnimation(() => window.scrollTo({ top: 0, left: 0 }));
      return;
    }

    let followupFrame = 0;
    const settle = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return false;
      jumpWithoutAnimation(() => target.scrollIntoView({ block: "start" }));
      followupFrame = window.requestAnimationFrame(() => {
        jumpWithoutAnimation(() => target.scrollIntoView({ block: "start" }));
      });
      return true;
    };

    const observer = new MutationObserver(() => {
      if (settle()) observer.disconnect();
    });
    observer.observe(document.getElementById("root") ?? document.body, { childList: true, subtree: true });
    if (settle()) observer.disconnect();

    const timeout = window.setTimeout(() => observer.disconnect(), 4_000);
    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
      window.cancelAnimationFrame(followupFrame);
    };
  }, [pathname, hash]);

  return null;
}

function DesktopNavigation() {
  const { pathname } = useLocation();

  return (
    <nav aria-label="Primary navigation" className="flex items-center gap-0.5">
      {canonical.meta.navigation.map((item) => (
        <div key={item.id} className="group relative">
          <NavLink
            to={item.path}
            end={item.path === "/"}
            onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "auto" })}
            className={({ isActive }) => {
              const groupedActive =
                item.id === "method" && ["/methodology", "/bottlenecks", "/glossary", "/changelog"].includes(pathname);
              return (
              `inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm transition-colors ${
                isActive || groupedActive
                  ? "bg-ink font-medium text-panel"
                  : "text-muted hover:bg-raised hover:text-ink"
              }`
              );
            }}
          >
            {item.label}
            <ChevronDown size={12} className="opacity-55" aria-hidden="true" />
          </NavLink>
          <div className="invisible absolute left-1/2 top-full z-50 w-[310px] -translate-x-1/2 pt-3 opacity-0 transition-[opacity,visibility] duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
            <div className="rounded-2xl border border-line bg-panel p-2 shadow-[0_22px_60px_rgba(19,35,54,.16)]">
              {item.children.map((child) => (
                <Link
                  key={child.path}
                  to={child.path}
                  className="block rounded-xl px-3.5 py-3 transition-colors hover:bg-raised focus-visible:bg-raised"
                >
                  <span className="block text-sm font-semibold text-ink">{child.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-muted">{child.description}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ))}
    </nav>
  );
}

function MobileNavigation({ close }: { close: () => void }) {
  const { pathname } = useLocation();

  return (
    <nav aria-label="Primary navigation" className="divide-y divide-line">
      {canonical.meta.navigation.map((item) => {
        const active =
          pathname === item.path ||
          (item.id === "method" && ["/methodology", "/bottlenecks", "/glossary", "/changelog"].includes(pathname));
        return (
          <details key={item.id} className="group py-2" open={active}>
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between rounded-xl px-3 py-2.5 text-base font-semibold text-ink">
              <span className="flex items-center gap-2.5">
                {item.label}
                {active ? (
                  <span className="rounded-full bg-cyan/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-cyan">
                    Current
                  </span>
                ) : null}
              </span>
              <ChevronDown size={16} className="text-muted transition-transform group-open:rotate-180" />
            </summary>
            <div className="pb-2 pl-3">
              <Link
                to={item.path}
                aria-current={pathname === item.path ? "page" : undefined}
                onClick={() => {
                  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
                  close();
                }}
                className="block min-h-10 rounded-xl px-3 py-2.5 text-sm font-medium text-cyan"
              >
                Open {item.label}
              </Link>
              {item.children.map((child) => (
                <Link
                  key={child.path}
                  to={child.path}
                  onClick={close}
                  className="block rounded-xl px-3 py-2.5 hover:bg-raised"
                >
                  <span className="block text-sm font-medium text-ink">{child.label}</span>
                  <span className="mt-0.5 block text-[13px] leading-5 text-muted">{child.description}</span>
                </Link>
              ))}
            </div>
          </details>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <HashRouter>
      <RouteScrollManager />
      <div className="min-h-screen bg-canvas text-ink">
        <header className="sticky top-0 z-50 border-b border-line/80 bg-canvas/95 backdrop-blur-md">
          <div className="mx-auto flex min-h-[70px] max-w-[1360px] items-center justify-between gap-5 px-5 md:px-8">
            <NavLink to="/" className="min-w-0 shrink-0" aria-label={`${canonical.meta.site_title} home`}>
              <span className="block truncate font-serif text-[21px] font-semibold tracking-[-0.02em] text-ink">
                {canonical.meta.site_title}
              </span>
              <span className="mt-0.5 hidden text-[10px] uppercase tracking-[0.08em] text-muted 2xl:block">
                {canonical.meta.site_subtitle}
              </span>
            </NavLink>
            <div className="hidden lg:block">
              <DesktopNavigation />
            </div>
            <div className="hidden shrink-0 border-l border-line pl-5 text-right xl:block">
              <span className="block font-mono text-[8px] uppercase tracking-[0.17em] text-muted">
                {canonical.meta.last_updated_label}
              </span>
              <span className="mt-1 block text-[11px] font-medium text-ink">
                {formatIsoDate(newestChangelogDate)}
              </span>
            </div>
            <button
              type="button"
              className="rounded-full border border-line bg-panel p-3 text-muted lg:hidden"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
          {menuOpen ? (
            <div className="max-h-[calc(100vh-70px)] overflow-y-auto border-t border-line bg-panel px-5 py-3 lg:hidden">
              <MobileNavigation close={() => setMenuOpen(false)} />
            </div>
          ) : null}
        </header>

        <main id="main-content" className="mx-auto max-w-[1240px] px-5 py-9 md:px-8 md:py-14">{children}</main>

        <footer className="mt-20 bg-ink text-panel">
          <div className="mx-auto max-w-[1240px] px-5 py-12 md:px-8 md:py-16">
            <div className="grid gap-10 border-b border-canvas/15 pb-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">
                  {canonical.meta.action_center.eyebrow}
                </p>
                <h2 className="mt-4 max-w-lg font-serif text-3xl font-semibold tracking-[-0.015em] text-panel md:text-4xl">
                  {canonical.meta.action_center.title}
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-canvas/65">
                  {canonical.meta.action_center.description}
                </p>
              </div>
              <div className="grid gap-8 sm:grid-cols-3">
                {canonical.meta.action_center.groups.map((group) => (
                  <section key={group.id} aria-labelledby={`footer-${group.id}`}>
                    <h3 id={`footer-${group.id}`} className="font-mono text-[10px] uppercase tracking-[0.17em] text-canvas/50">
                      {group.label}
                    </h3>
                    <div className="mt-4 space-y-5">
                      {group.items.map((item) => (
                        <a key={item.url} href={item.url} target="_blank" rel="noreferrer" className="group/link block">
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-panel transition-colors group-hover/link:text-cyan">
                            {item.label}<ArrowUpRight size={12} aria-hidden="true" />
                          </span>
                          <span className="mt-1.5 block text-[13px] leading-5 text-canvas/60">{item.description}</span>
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
