import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Compass } from "lucide-react";
import { Link } from "react-router-dom";

export type SectionNavItem = {
  id: string;
  label: string;
};

export function SectionNav({
  items,
  label = "On this page",
  updateHash = true,
}: {
  items: SectionNavItem[];
  label?: string;
  updateHash?: boolean;
}) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const itemKey = items.map((item) => item.id).join("|");

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const offset = 150;
      let next = items[0]?.id ?? "";

      for (const item of items) {
        const element = document.getElementById(item.id);
        if (element && element.getBoundingClientRect().top <= offset) next = item.id;
      }

      setActiveId(next);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [itemKey, items]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  return (
    <nav
      aria-label={label}
      className="sticky top-[69px] z-40 -mx-5 mb-10 border-y border-line/80 bg-canvas/95 px-5 py-2 backdrop-blur-md md:-mx-8 md:px-8"
    >
      <div className="mx-auto flex max-w-[1240px] items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span className="mr-2 hidden shrink-0 items-center gap-2 text-xs font-medium text-muted sm:inline-flex">
          <Compass size={14} className="text-cyan" aria-hidden="true" />
          {label}
        </span>
        {items.map((item) => {
          const active = activeId === item.id;
          const className = `inline-flex min-h-11 shrink-0 items-center rounded-full px-3.5 py-2 text-xs font-medium transition-colors ${
            active ? "bg-ink text-panel" : "text-muted hover:bg-panel hover:text-ink"
          }`;

          return updateHash ? (
            <Link
              key={item.id}
              to={`#${item.id}`}
              aria-current={active ? "location" : undefined}
              className={className}
            >
              {item.label}
            </Link>
          ) : (
            <button
              key={item.id}
              type="button"
              aria-current={active ? "location" : undefined}
              className={className}
              onClick={() => scrollTo(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function ChartScroller({
  children,
  label,
  className = "",
}: {
  children: ReactNode;
  label: string;
  className?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);

  const updateScrollState = () => {
    const element = scrollerRef.current;
    if (!element) return;
    setCanScrollBack(element.scrollLeft > 4);
    setCanScrollForward(element.scrollLeft + element.clientWidth < element.scrollWidth - 4);
  };

  useEffect(() => {
    const element = scrollerRef.current;
    if (!element) return;

    updateScrollState();
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);
    return () => observer.disconnect();
  }, []);

  const move = (direction: -1 | 1) => {
    const element = scrollerRef.current;
    if (!element) return;
    element.scrollBy({
      left: direction * Math.max(240, element.clientWidth * 0.78),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <div>
      <div
        ref={scrollerRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        onScroll={updateScrollState}
        className={`overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-cyan ${className}`}
      >
        {children}
      </div>
      <div className="flex min-h-12 items-center justify-between gap-3 border-t border-line px-3 sm:hidden">
        <span className="text-[11px] leading-4 text-muted">
          {canScrollBack || canScrollForward ? "Swipe or use arrows to explore the timeline" : "Timeline fits this screen"}
        </span>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            aria-label={`Scroll ${label} backward`}
            disabled={!canScrollBack}
            onClick={() => move(-1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-raised hover:text-ink disabled:cursor-not-allowed disabled:opacity-25"
          >
            <ChevronLeft size={17} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={`Scroll ${label} forward`}
            disabled={!canScrollForward}
            onClick={() => move(1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-raised hover:text-ink disabled:cursor-not-allowed disabled:opacity-25"
          >
            <ChevronRight size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
