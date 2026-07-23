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

export default function App() {
  return (
    <AppShell>
      <Suspense fallback={<div className="min-h-[35vh] animate-pulse rounded-xl border border-line bg-panel" />}>
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
