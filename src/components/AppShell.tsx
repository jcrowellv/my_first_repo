import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { HashRouter, Link, NavLink, useLocation } from "react-router";
import { canonical } from "../lib/data";
import { formatIsoDate } from "../lib/dates";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "The overview" },
  { to: "/rsi", label: "The RSI dossier" },
  { to: "/forecasts", label: "The futures" },
  { to: "/evidence", label: "The evidence" },
  { to: "/falsifiers", label: "What to watch" },
];
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useLayoutEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    const jump = () => {
      const node = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (node) {
        node.scrollIntoView({ block: "start", behavior: "instant" });
        return true;
      }
      return false;
    };
    const observer = new MutationObserver(() => {
      if (jump()) observer.disconnect();
    });
    if (!jump())
      observer.observe(document.getElementById("root")!, {
        childList: true,
        subtree: true,
      });
    const timeout = setTimeout(() => observer.disconnect(), 4000);
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [pathname, hash]);
  return null;
}
function Shell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(false);
    const title =
      links.find((x) => x.to === pathname)?.label ||
      {
        "/methodology": "How we think",
        "/glossary": "A field glossary",
        "/bottlenecks": "The mechanics of progress",
        "/changelog": "The record",
      }[pathname];
    document.title =
      pathname === "/"
        ? "The Capability Ledger — When AI builds AI."
        : `${title || "The Capability Ledger"} · The Capability Ledger`;
  }, [pathname]);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <>
      <ScrollManager />
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link
            className="wordmark"
            to="/"
            aria-label="The Capability Ledger home"
          >
            <span className="brand-symbol" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <span>
              THE CAPABILITY
              <br />
              <b>LEDGER</b>
            </span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map((l) => (
              <NavLink end={l.to === "/"} to={l.to} key={l.to}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <Link className="header-about" to="/methodology">
            Independent by design <ArrowUpRight size={14} />
          </Link>
          <button
            className="menu-button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close navigation" : "Open navigation"}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Mobile navigation"
          >
            {[
              ...links,
              { to: "/methodology", label: "How we think" },
              { to: "/glossary", label: "A field glossary" },
            ].map((l) => (
              <NavLink to={l.to} key={l.to} onClick={() => setOpen(false)}>
                {l.label}
                <ArrowUpRight size={18} />
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <div className="container footer-top">
          <div>
            <Link className="footer-brand" to="/">
              The Capability Ledger<span>Keep looking.</span>
            </Link>
            <p>
              An independent record of AI progress.
              <br />
              The evidence, the possibilities, and the things we don't know.
            </p>
          </div>
          <div className="footer-links">
            <Link to="/rsi">The October RSI dossier</Link>
            <Link to="/forecasts">Explore the futures</Link>
            <Link to="/evidence">Follow the evidence</Link>
            <Link to="/methodology">How we think</Link>
            <Link to="/glossary">Field glossary</Link>
            <Link to="/changelog">Revision history</Link>
            <a
              href="https://github.com/jcrowellv/my_first_repo"
              target="_blank"
              rel="noreferrer"
            >
              Open source <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>Curated by JJ Crowell · Research and development with AI</span>
          <span>
            RSI review {formatIsoDate(canonical.research_review.as_of)}
          </span>
        </div>
      </footer>
    </>
  );
}
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <HashRouter>
      <Shell>{children}</Shell>
    </HashRouter>
  );
}
