import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
import { AppShell } from "./components/AppShell";
import { TimelineView } from "./views/TimelineView";

const RSIView = lazy(() =>
  import("./views/RSIView").then((module) => ({ default: module.RSIView })),
);

const FalsifierBoard = lazy(() =>
  import("./views/FalsifierBoard").then((module) => ({
    default: module.FalsifierBoard,
  })),
);
const ForecastsView = lazy(() =>
  import("./views/ForecastsView").then((module) => ({
    default: module.ForecastsView,
  })),
);
const EvidenceLedger = lazy(() =>
  import("./views/EvidenceLedger").then((module) => ({
    default: module.EvidenceLedger,
  })),
);
const BottleneckTracker = lazy(() =>
  import("./views/BottleneckTracker").then((module) => ({
    default: module.BottleneckTracker,
  })),
);
const ChangelogView = lazy(() =>
  import("./views/ChangelogView").then((module) => ({
    default: module.ChangelogView,
  })),
);
const MethodologyView = lazy(() =>
  import("./views/MethodologyView").then((module) => ({
    default: module.MethodologyView,
  })),
);
const GlossaryView = lazy(() =>
  import("./views/GlossaryView").then((module) => ({
    default: module.GlossaryView,
  })),
);

function RouteFallback() {
  return (
    <div
      className="container route-loading"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="live-dot" />
      Opening the ledger…
    </div>
  );
}

export default function App() {
  return (
    <AppShell>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<TimelineView />} />
          <Route path="/rsi" element={<RSIView />} />
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
