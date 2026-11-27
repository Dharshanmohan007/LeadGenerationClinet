import { useState } from 'react';
import {
  ENQUIRY_SOURCE_META,
  ENQUIRY_STATUS_MAP,
} from '../../../config/dsa/enquiryConfig';

/**
 * Generates a smooth SVG path through trend coordinates while clamping vertical
 * control points inside [minY, maxY] so zero stretches never overshoot downward.
 */
function buildSmoothCurvePath(points, minY, maxY) {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  const clampY = (y) => Math.max(minY, Math.min(maxY, y));
  let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = clampY(p1.y + (p2.y - p0.y) / 6);
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = clampY(p2.y - (p3.y - p1.y) / 6);

    path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  return path;
}

/**
 * Displays real Enquiry Source Distribution, Status Overview, and Daily/Weekly/Monthly Trend.
 */
export default function DsaDashboardCharts({
  sourceDistribution = [],
  statusOverview = [],
  trend = [],
  period = 'daily',
  onPeriodChange,
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const totalSources = sourceDistribution.reduce(
    (sum, item) => sum + (item.count || 0),
    0
  );
  const maxStatus = Math.max(
    1,
    ...statusOverview.map((item) => item.count || 0)
  );
  const maxTrend = Math.max(0, ...trend.map((item) => item.total || 0));

  // Build integer Y-axis ticks for the line/area graph
  let yMax;
  let yTicks;
  if (maxTrend <= 4) {
    yMax = Math.max(2, maxTrend);
    yTicks = Array.from({ length: yMax + 1 }, (_, i) => i);
  } else {
    const step = Math.ceil(maxTrend / 4);
    yMax = step * 4;
    yTicks = [0, step, step * 2, step * 3, yMax];
  }

  const svgWidth = 840;
  const svgHeight = 230;
  const padLeft = 42;
  const padRight = 24;
  const padTop = 26;
  const padBottom = 38;
  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;
  const baselineY = padTop + plotHeight;

  const points = trend.map((bucket, idx) => {
    const x =
      trend.length === 1
        ? padLeft + plotWidth / 2
        : padLeft + (idx / (trend.length - 1)) * plotWidth;
    const y = baselineY - ((bucket.total || 0) / yMax) * plotHeight;
    return {
      x,
      y,
      bucket,
      index: idx,
    };
  });

  const linePath = buildSmoothCurvePath(points, padTop, baselineY);
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${baselineY.toFixed(2)} L ${points[0].x.toFixed(2)} ${baselineY.toFixed(2)} Z`
      : '';

  const activePoint =
    hoveredIndex !== null && points[hoveredIndex] ? points[hoveredIndex] : null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-12">
      {/* Source Distribution */}
      <section className="min-w-0 rounded-2xl border border-lf-line bg-white p-4 shadow-2xs sm:p-6 md:col-span-5">
        <h2 className="text-base font-bold text-lf-navy">
          Enquiry Source Distribution
        </h2>
        <p className="mt-1 text-xs text-lf-muted">
          Breakdown across Website, CIBIL, and Bank Rejected lead sources.
        </p>

        <div className="mt-5 space-y-4 sm:mt-6">
          {sourceDistribution.map((item) => {
            const meta =
              ENQUIRY_SOURCE_META[item.source] || ENQUIRY_SOURCE_META.website;
            const percent =
              totalSources > 0
                ? Math.round((item.count / totalSources) * 100)
                : 0;

            return (
              <div key={item.source} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                  <span className="truncate text-lf-navy">{item.label}</span>
                  <span className="tabular-nums shrink-0 text-lf-muted">
                    <strong className="text-lf-navy">{item.count}</strong> ({percent}%)
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-lf-bg">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${meta.barColor}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Status Overview */}
      <section className="min-w-0 rounded-2xl border border-lf-line bg-white p-4 shadow-2xs sm:p-6 md:col-span-7">
        <h2 className="text-base font-bold text-lf-navy">
          Enquiry Status Overview
        </h2>
        <p className="mt-1 text-xs text-lf-muted">
          Live status distribution across active enquiries.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:mt-5 sm:grid-cols-2 sm:gap-3">
          {statusOverview.map((item) => {
            const meta = ENQUIRY_STATUS_MAP[item.status] || {
              label: item.label,
              barColor: 'bg-slate-500',
            };
            const widthPct = Math.round((item.count / maxStatus) * 100);

            return (
              <div
                key={item.status}
                className="min-w-0 rounded-xl border border-lf-line bg-lf-bg/60 p-3"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="truncate font-semibold text-lf-navy">{meta.label}</span>
                  <span className="tabular-nums shrink-0 font-extrabold text-lf-navy">
                    {item.count}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white">
                  <div
                    className={`h-full rounded-full ${meta.barColor}`}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Enquiry Trend Line / Area Graph */}
      <section className="min-w-0 rounded-2xl border border-lf-line bg-white p-4 shadow-2xs sm:p-6 md:col-span-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-lf-navy">Enquiry Trend</h2>
            <p className="mt-1 text-xs text-lf-muted">
              Real submission volume across all enquiry channels.
            </p>
          </div>

          <div
            role="group"
            aria-label="Trend period"
            className="grid w-full grid-cols-3 rounded-xl border border-lf-line bg-lf-bg p-1 sm:inline-flex sm:w-auto sm:shrink-0"
          >
            {[
              { key: 'daily', label: 'Daily' },
              { key: 'weekly', label: 'Weekly' },
              { key: 'monthly', label: 'Monthly' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setHoveredIndex(null);
                  onPeriodChange(tab.key);
                }}
                className={`rounded-lg px-3 py-1.5 text-center text-xs font-bold transition-colors cursor-pointer ${
                  period === tab.key
                    ? 'bg-lf-navy text-white'
                    : 'text-lf-muted hover:text-lf-navy'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 min-h-[30px]">
          {activePoint ? (
            <div className="inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-lf-green-border bg-lf-green-tint px-3 py-1.5 text-xs">
              <span className="font-bold text-lf-navy">
                {activePoint.bucket.label}:
              </span>
              <span className="tabular-nums font-extrabold text-lf-green-dark">
                {activePoint.bucket.total} total
              </span>
              <span className="text-lf-muted">
                (Web {activePoint.bucket.website ?? 0} &bull; CIBIL{' '}
                {activePoint.bucket.cibil ?? 0} &bull; Bank{' '}
                {activePoint.bucket.bankRejected ?? 0})
              </span>
            </div>
          ) : (
            <p className="text-[11px] text-lf-muted">
              Hover or tap a data point to inspect channel breakdown
            </p>
          )}
        </div>

        <div className="mt-3 w-full overflow-x-auto no-scrollbar">
          {points.length === 0 ? (
            <div className="flex h-52 items-center justify-center rounded-xl border border-dashed border-lf-line text-xs text-lf-muted">
              No trend buckets available for this period.
            </div>
          ) : (
            <div className="min-w-[560px]">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                role="img"
                aria-label="Enquiry volume line graph"
                className="w-full h-56 select-none"
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <defs>
                  <linearGradient id="muktivaTrendArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#159b77" stopOpacity="0.24" />
                    <stop offset="100%" stopColor="#159b77" stopOpacity="0.01" />
                  </linearGradient>
                </defs>

                {/* Horizontal Gridlines & Y-Axis Ticks */}
                {yTicks.map((tick) => {
                  const y = baselineY - (tick / yMax) * plotHeight;
                  return (
                    <g key={tick}>
                      <line
                        x1={padLeft}
                        y1={y}
                        x2={svgWidth - padRight}
                        y2={y}
                        stroke={tick === 0 ? '#d8e0e8' : '#e8eef4'}
                        strokeDasharray={tick === 0 ? undefined : '4 4'}
                        strokeWidth={1}
                      />
                      <text
                        x={padLeft - 10}
                        y={y + 4}
                        textAnchor="end"
                        fill="#6b7b8f"
                        fontSize="11"
                        fontWeight="600"
                      >
                        {tick}
                      </text>
                    </g>
                  );
                })}

                {/* Translucent Area Fill Under Trend Curve */}
                <path d={areaPath} fill="url(#muktivaTrendArea)" />

                {/* Main Smooth Trend Line */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="#159b77"
                  strokeWidth={2.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Active Hover Vertical Guide Line */}
                {activePoint && (
                  <line
                    x1={activePoint.x}
                    y1={padTop}
                    x2={activePoint.x}
                    y2={baselineY}
                    stroke="#102541"
                    strokeOpacity="0.22"
                    strokeDasharray="3 3"
                    strokeWidth={1.25}
                  />
                )}

                {/* Data Points, Interactive Hit Targets, Value Labels & X-Axis Labels */}
                {points.map((pt) => {
                  const isHovered = hoveredIndex === pt.index;
                  const showValueLabel = isHovered || pt.bucket.total > 0;
                  const hitWidth =
                    points.length > 1 ? plotWidth / points.length : plotWidth;

                  return (
                    <g key={pt.bucket.key}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 6 : pt.bucket.total > 0 ? 4.5 : 3.2}
                        fill={
                          isHovered
                            ? '#102541'
                            : pt.bucket.total > 0
                            ? '#159b77'
                            : '#ffffff'
                        }
                        stroke={
                          isHovered
                            ? '#159b77'
                            : pt.bucket.total > 0
                            ? '#ffffff'
                            : '#75d4b3'
                        }
                        strokeWidth={isHovered ? 2.5 : 2}
                      />

                      {showValueLabel && (
                        <text
                          x={pt.x}
                          y={Math.max(13, pt.y - 11)}
                          textAnchor="middle"
                          fill="#102541"
                          fontSize="11"
                          fontWeight="700"
                        >
                          {pt.bucket.total}
                        </text>
                      )}

                      <text
                        x={pt.x}
                        y={baselineY + 20}
                        textAnchor="middle"
                        fill={isHovered ? '#102541' : '#6b7b8f'}
                        fontSize="10.5"
                        fontWeight={isHovered ? '700' : '500'}
                      >
                        {pt.bucket.label}
                      </text>

                      {/* Invisible wide hover target column for smooth tooltip tracking */}
                      <rect
                        x={pt.x - hitWidth / 2}
                        y={padTop - 8}
                        width={hitWidth}
                        height={plotHeight + padBottom}
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredIndex(pt.index)}
                        onClick={() =>
                          setHoveredIndex((prev) =>
                            prev === pt.index ? null : pt.index
                          )
                        }
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
