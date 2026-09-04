import { useId, useRef, useState, useEffect } from "react";
import { forecastSeries, type ForecastRecord } from "../lib/forecast-series";
import { probabilityFromPoints } from "../lib/forecast-math";
import { tracksById } from "../lib/data";
export function ProbabilityChart({
  records,
  year,
  end,
  ticks,
}: {
  records: ForecastRecord[];
  year: number;
  end: number;
  ticks: number[];
}) {
  const clip = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1000);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.max(300, entry.contentRect.width)),
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const w = width,
    h = width < 600 ? 250 : 310,
    left = 42,
    right = 18,
    top = 15,
    bottom = 42;
  const x = (y: number) =>
      left + ((y - 2026) / (end - 2026)) * (w - left - right),
    y = (p: number) => top + (1 - p) * (h - top - bottom);
  return (
    <div className="probability-chart" ref={ref}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label="Cumulative chance of arrival by year. Lines connect known probabilities and stop where the source becomes uncertain."
      >
        <defs>
          <clipPath id={clip}>
            <rect
              x={left}
              y={top}
              width={w - left - right}
              height={h - top - bottom}
            />
          </clipPath>
        </defs>
        {[0.1, 0.3, 0.5, 0.7, 0.9].map((p) => (
          <g key={p}>
            <line
              x1={left}
              x2={w - right}
              y1={y(p)}
              y2={y(p)}
              stroke="#273a45"
              strokeDasharray={p === 0.5 ? "4 5" : undefined}
            />
            <text
              x={left - 12}
              y={y(p) + 4}
              textAnchor="end"
              fill="#8ca6b2"
              fontSize="13"
            >
              {p * 100}%
            </text>
          </g>
        ))}
        {ticks.map((v) => (
          <g key={v}>
            <line
              x1={x(v)}
              x2={x(v)}
              y1={top}
              y2={h - bottom}
              stroke="#1d303a"
            />
            <text
              x={x(v)}
              y={h - 16}
              textAnchor={v === 2026 ? "start" : v === end ? "end" : "middle"}
              fill="#8ca6b2"
              fontSize="13"
            >
              {v}
            </text>
          </g>
        ))}
        <g clipPath={`url(#${clip})`}>
          <line
            x1={x(year)}
            x2={x(year)}
            y1={top}
            y2={h - bottom}
            stroke="#9aafb9"
            strokeDasharray="4 6"
          />
          {records.map((f) => {
            const series = forecastSeries(f),
              p = probabilityFromPoints(series.points, year),
              color = tracksById.get(f.track)!.color;
            return (
              <g key={f.id}>
                <path
                  d={series.points
                    .map(
                      (p, i) =>
                        `${i ? "L" : "M"}${x(p.year).toFixed(2)},${y(p.p).toFixed(2)}`,
                    )
                    .join(" ")}
                  fill="none"
                  stroke={color}
                  strokeWidth="2.5"
                />
                {!["below", "above"].includes(p.bound) && (
                  <circle
                    cx={x(year)}
                    cy={y(p.value)}
                    r="5"
                    fill={color}
                    stroke="#0c151b"
                    strokeWidth="2"
                  />
                )}
              </g>
            );
          })}
        </g>
      </svg>
      <p>
        Chance the capability has arrived. Lines connect available judgments;
        they do not extend to an invented 0% or 100%.
      </p>
    </div>
  );
}
