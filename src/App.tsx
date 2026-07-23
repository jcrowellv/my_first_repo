import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { TimelineView } from "./views/TimelineView";

const FalsifierBoard = lazy(() =>
  import("./views/FalsifierBoard").then((module) => ({ default: module.FalsifierBoard })),
);
const ForecastsView = lazy(() =>
  import("./views/ForecastsView").then((module) => ({ default: module.ForecastsView })),
);
const EvidenceLedger = lazy(() =>
  import("./views/EvidenceLedger").then((module) => ({ default: module.EvidenceLedger })),
);
const BottleneckTracker = lazy(() =>
  import("./views/BottleneckTracker").then((module) => ({ default: module.BottleneckTracker })),
);
const ChangelogView = lazy(() =>
  import("./views/ChangelogView").then((module) => ({ default: module.ChangelogView })),
);
const MethodologyView = lazy(() =>
  import("./views/MethodologyView").then((module) => ({ default: module.MethodologyView })),
);
const GlossaryView = lazy(() =>
  import("./views/GlossaryView").then((module) => ({ default: module.GlossaryView })),
);

function RouteFallback() {
  return (
    <div role="status" aria-live="polite" className="min-h-[55vh] animate-pulse">
      <span className="sr-only">Loading page</span>
      <div className="h-3 w-40 rounded-full bg-cyan/15" />
      <div className="mt-5 h-12 max-w-2xl rounded-xl bg-line/65" />
      <div className="mt-3 h-12 max-w-xl rounded-xl bg-line/45" />
      <div className="mt-6 h-4 max-w-3xl rounded-full bg-line/55" />
      <div className="mt-3 h-4 max-w-2xl rounded-full bg-line/40" />
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-44 rounded-2xl border border-line bg-panel/70" />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppShell>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<TimelineView />} />
          <Route path="/forecasts" element={<ForecastsView />} />
          <Route path="/falsifiers" element={<FalsifierBoard />} />
          <Route path="/evidence" element={<EvidenceLedger />} />
          <Route path="/bottlenecks" element={<BottleneckTracker />} />
          <Route path="/changelog" element={<ChangelogView />} />
          <Route path="/methodology" element={<MethodologyView />} />
          <Route path="/glossary" element={<GlossaryView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}
