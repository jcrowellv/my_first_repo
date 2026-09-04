import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Link } from "react-router";
import type { ReactNode } from "react";
import { evidenceById } from "../lib/data";

export function PageIntro({
  number,
  title,
  children,
}: {
  number: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <header className="page-header">
      <span className="eyebrow">THE CAPABILITY LEDGER / {number}</span>
      <h1>{title}</h1>
      <p>{children}</p>
    </header>
  );
}
export function SectionTitle({
  label,
  title,
  children,
}: {
  label: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{label}</p>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
export function Sources({ ids }: { ids: string[] }) {
  return (
    <div className="source-list">
      {ids.map((id) => {
        const e = evidenceById.get(id);
        return e ? (
          <Link key={id} to={`/evidence#${id}`}>
            {e.publisher}: {e.source_label}
            <ArrowUpRight size={13} />
          </Link>
        ) : null;
      })}
    </div>
  );
}
export function Disclosure({
  title,
  children,
  open = false,
  id,
}: {
  title: ReactNode;
  children: ReactNode;
  open?: boolean;
  id?: string;
}) {
  return (
    <details className="disclosure" open={open || undefined} id={id}>
      <summary>
        {title}
        <ChevronDown size={18} />
      </summary>
      <div className="disclosure-body">{children}</div>
    </details>
  );
}
export function External({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a className="source-link" href={href} target="_blank" rel="noreferrer">
      {children}
      <ArrowUpRight size={14} />
    </a>
  );
}
