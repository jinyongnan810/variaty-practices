import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export type SegmentStatus = "skipped" | "finished" | "ongoing";

export type Segment = {
  status: SegmentStatus;
  value?: number;
};

type ArcLayout = {
  startAngle: number;
  endAngle: number;
  status: SegmentStatus;
};

export type SegmentedProgressRingProps = {
  size?: number;
  strokeWidth?: number;
  gapAngle?: number;
  startAngle?: number;
  segments: Segment[];
  animationDuration?: number;
  className?: string;
};

const STATUS_COLORS: Record<SegmentStatus, string> = {
  skipped: "#9CA3AF",
  finished: "#22C55E",
  ongoing: "#EAB308",
};

// Keeps user-provided sizing and gap values inside safe geometry bounds.
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

// Converts an angle on the ring into an SVG coordinate for arc endpoints.
function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180;

  return {
    x: Number((cx + radius * Math.cos(angleInRadians)).toFixed(3)),
    y: Number((cy + radius * Math.sin(angleInRadians)).toFixed(3)),
  };
}

// Builds the SVG path d attribute with elliptical arc commands.
function describeArcPath(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const sweep = endAngle - startAngle;

  if (sweep <= 0) {
    return "";
  }

  if (sweep >= 359.999) {
    const midAngle = startAngle + sweep / 2;
    const start = polarToCartesian(cx, cy, radius, startAngle);
    const mid = polarToCartesian(cx, cy, radius, midAngle);
    const end = polarToCartesian(cx, cy, radius, endAngle);

    return [
      `M ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 0 1 ${mid.x} ${mid.y}`,
      `A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`,
    ].join(" ");
  }

  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, endAngle);
  const largeArcFlag = sweep > 180 ? 1 : 0;

  return [
    `M ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
  ].join(" ");
}

// Turns dynamic weighted data into visible arc angle ranges with real gaps.
function buildSegmentLayout(
  segments: Segment[],
  gapAngle: number,
  startAngle: number,
  strokeWidth: number,
  radius: number,
) {
  if (segments.length === 0) {
    return [];
  }

  const normalizedSegments = segments.map((segment) => ({
    status: segment.status,
    value: Math.max(segment.value ?? 1, 0),
  }));
  const visibleSegments = normalizedSegments.filter(
    (segment) => segment.value > 0,
  );
  const totalValue = visibleSegments.reduce(
    (sum, segment) => sum + segment.value,
    0,
  );

  if (totalValue <= 0) {
    return [];
  }

  const segmentCount = visibleSegments.length;
  const maxGapByCount = segmentCount > 1 ? 360 / segmentCount - 1 : 0;
  const resolvedGapAngle = clamp(gapAngle, 0, Math.max(maxGapByCount, 0));
  const totalGapAngle = segmentCount > 1 ? resolvedGapAngle * segmentCount : 0;
  const availableSweep = Math.max(360 - totalGapAngle, 0);
  // Rounded stroke caps visually extend past path endpoints, so trim arcs
  // slightly to keep the apparent gaps consistent at compact sizes.
  const roundCapInset =
    segmentCount > 1
      ? Math.min(
          (strokeWidth / Math.max(radius, 1)) * (180 / Math.PI) * 0.55,
          resolvedGapAngle * 0.42,
        )
      : 0;

  let cursor = startAngle + (segmentCount > 1 ? resolvedGapAngle / 2 : 0);

  return visibleSegments
    .map((segment) => {
      const segmentSweep =
        totalValue === 0 ? 0 : (segment.value / totalValue) * availableSweep;
      const segmentStart = cursor;
      const start = segmentStart + roundCapInset;
      const end = segmentStart + segmentSweep - roundCapInset;
      cursor = segmentStart + segmentSweep + resolvedGapAngle;

      return {
        startAngle: start,
        endAngle: end,
        status: segment.status,
      };
    })
    .filter((segment) => segment.endAngle - segment.startAngle > 0.01);
}

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

// Interpolates one numeric layout value during requestAnimationFrame updates.
function mix(a: number, b: number, progress: number) {
  return a + (b - a) * progress;
}

// Animates arc geometry when segment values change without animating SVG paths directly.
// The hook stores the previous arc layout in a ref, then requestAnimationFrame
// interpolates each segment's start/end angles toward the new layout. The SVG
// path strings are regenerated from those intermediate angles on every frame.
// When the animation completes, the target layout becomes the next "previous"
// layout so future updates animate from the current visual state.
function useAnimatedLayout(targetLayout: ArcLayout[], duration: number) {
  const [animatedLayout, setAnimatedLayout] = useState(targetLayout);
  const previousLayoutRef = useRef(targetLayout);
  const animationEnabled = duration > 0;

  useEffect(() => {
    if (!animationEnabled) {
      previousLayoutRef.current = targetLayout;
      return;
    }

    const fromLayout = previousLayoutRef.current;
    const frameCount = Math.max(fromLayout.length, targetLayout.length);
    const startTime = performance.now();
    let animationFrame = 0;

    const tick = (now: number) => {
      const rawProgress = clamp((now - startTime) / duration, 0, 1);
      const progress = easeOutCubic(rawProgress);

      const nextLayout = Array.from({ length: frameCount }, (_, index) => {
        const fromSegment = fromLayout[index];
        const toSegment = targetLayout[index];
        const startAngle = mix(
          fromSegment?.startAngle ?? toSegment?.startAngle ?? 0,
          toSegment?.startAngle ?? fromSegment?.startAngle ?? 0,
          progress,
        );
        const endAngle = mix(
          fromSegment?.endAngle ?? startAngle,
          toSegment?.endAngle ?? startAngle,
          progress,
        );

        return {
          startAngle,
          endAngle,
          status: toSegment?.status ?? fromSegment?.status ?? "skipped",
        };
      }).filter((segment) => segment.endAngle - segment.startAngle > 0.01);

      setAnimatedLayout(nextLayout);

      if (rawProgress < 1) {
        animationFrame = requestAnimationFrame(tick);
        return;
      }

      previousLayoutRef.current = targetLayout;
    };

    animationFrame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrame);
  }, [animationEnabled, duration, targetLayout]);

  return animationEnabled ? animatedLayout : targetLayout;
}

// Reusable SVG segmented ring component. Consumers only pass segment data and geometry options.
export function SegmentedProgressRing({
  size = 64,
  strokeWidth = 8,
  gapAngle = 11,
  startAngle = -90,
  segments,
  animationDuration = 420,
  className,
}: SegmentedProgressRingProps) {
  const normalizedSize = Math.max(Math.round(size), 24);
  const normalizedStrokeWidth = clamp(strokeWidth, 2, normalizedSize / 2 - 2);
  const radius = Number(
    ((normalizedSize - normalizedStrokeWidth) / 2).toFixed(3),
  );
  const center = normalizedSize / 2;
  const targetLayout = useMemo(
    () =>
      buildSegmentLayout(
        segments,
        gapAngle,
        startAngle,
        normalizedStrokeWidth,
        radius,
      ),
    [gapAngle, normalizedStrokeWidth, radius, segments, startAngle],
  );
  const animatedLayout = useAnimatedLayout(targetLayout, animationDuration);

  return (
    <svg
      width={normalizedSize}
      height={normalizedSize}
      viewBox={`0 0 ${normalizedSize} ${normalizedSize}`}
      fill="none"
      className={className}
      shapeRendering="geometricPrecision"
      aria-label="Segmented progress ring"
      role="img"
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        stroke="rgba(17, 24, 39, 0.08)"
        strokeWidth={normalizedStrokeWidth}
      />
      {animatedLayout.map((segment, index) => {
        const path = describeArcPath(
          center,
          center,
          radius,
          segment.startAngle,
          segment.endAngle,
        );

        if (!path) {
          return null;
        }

        return (
          <path
            key={`${segment.status}-${index}`}
            d={path}
            stroke={STATUS_COLORS[segment.status]}
            strokeWidth={normalizedStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={{
              transition:
                "stroke 220ms ease, stroke-width 220ms ease, opacity 220ms ease",
            }}
          />
        );
      })}
    </svg>
  );
}

// Compact legend item for the demo status colors.
function StatusPill({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}

// Shared demo panel wrapper that keeps explanatory content visually consistent.
function DemoCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-border bg-white p-5 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
      <h4 className="m-0 font-display text-base font-bold text-text-primary">
        {title}
      </h4>
      <p className="mb-5 mt-1 text-sm leading-6 text-text-secondary">
        {description}
      </p>
      {children}
    </section>
  );
}

// Example usage for the reusable component, including live controls for segment data and geometry.
export default function SegmentedProgressRingDemo() {
  const [finishedCount, setFinishedCount] = useState(3);
  const [size, setSize] = useState(64);
  const [strokeWidth, setStrokeWidth] = useState(8);
  const [gapAngle, setGapAngle] = useState(11);
  const [startAngle, setStartAngle] = useState(-90);

  const ongoingCount = 8 - finishedCount;
  const segments: Segment[] = [
    { status: "finished", value: finishedCount },
    { status: "skipped", value: 1 },
    { status: "ongoing", value: ongoingCount },
  ];
  const totalUnits = segments.reduce(
    (sum, segment) => sum + Math.max(segment.value ?? 1, 0),
    0,
  );

  return (
    <div className="flex w-[min(100%,920px)] flex-col gap-5 rounded-[32px] border border-border bg-[linear-gradient(145deg,#ffffff_0%,#f4f4f5_100%)] p-4 text-text-primary sm:p-5">
      {/* Key point: each segment is an independent SVG arc path, not a conic gradient or canvas drawing. */}
      {/* Geometry helpers own angles, gaps, and edge cases; the component only renders the computed paths. */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.9fr)]">
        <section className="relative overflow-hidden rounded-[30px] bg-[#111827] px-5 py-6 text-white sm:px-6">
          <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
          <div className="absolute -right-12 top-10 h-36 w-36 rounded-full bg-emerald-400/18 blur-3xl" />
          <div className="absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-amber-300/12 blur-3xl" />

          <div className="relative flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
                SVG arc paths
              </span>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
                Weighted segments
              </span>
            </div>

            <div>
              <h3 className="m-0 font-display text-[26px] font-extrabold tracking-tight sm:text-[30px]">
                Segmented Progress Ring
              </h3>
              <p className="mb-0 mt-2 max-w-xl text-sm leading-6 text-white/72">
                Compact status ring built with separate SVG arc paths, rounded
                caps, tunable gaps, and animated geometry updates.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
                <span className="text-[11px] uppercase tracking-[0.18em] text-white/55">
                  Small
                </span>
                <div className="mt-4 flex items-center justify-center rounded-[24px] bg-white/5 py-5">
                  <SegmentedProgressRing
                    size={40}
                    strokeWidth={6}
                    gapAngle={gapAngle}
                    startAngle={startAngle}
                    segments={segments}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
                <span className="text-[11px] uppercase tracking-[0.18em] text-white/55">
                  Default
                </span>
                <div className="mt-4 flex items-center justify-center rounded-[24px] bg-white/5 py-5">
                  <SegmentedProgressRing
                    size={size}
                    strokeWidth={strokeWidth}
                    gapAngle={gapAngle}
                    startAngle={startAngle}
                    segments={segments}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
                <span className="text-[11px] uppercase tracking-[0.18em] text-white/55">
                  Large
                </span>
                <div className="mt-4 flex items-center justify-center rounded-[24px] bg-white/5 py-5">
                  <SegmentedProgressRing
                    size={96}
                    strokeWidth={12}
                    gapAngle={gapAngle}
                    startAngle={startAngle}
                    segments={segments}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusPill label="Skipped" color={STATUS_COLORS.skipped} />
              <StatusPill label="Finished" color={STATUS_COLORS.finished} />
              <StatusPill label="Ongoing" color={STATUS_COLORS.ongoing} />
            </div>
          </div>
        </section>

        <DemoCard
          title="Live Configuration"
          description="Adjust the completed portion while keeping skipped fixed at 1 and the remaining active work capped at 8 total units."
        >
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-border bg-card px-3 py-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-tertiary">
                  Skipped
                </div>
                <div className="mt-1 text-lg font-bold text-text-primary">
                  1
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card px-3 py-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-tertiary">
                  Ongoing
                </div>
                <div className="mt-1 text-lg font-bold text-text-primary">
                  {ongoingCount}
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card px-3 py-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-tertiary">
                  Finished
                </div>
                <div className="mt-1 text-lg font-bold text-text-primary">
                  {finishedCount}
                </div>
              </div>
            </div>

            <label className="flex flex-col gap-2 text-sm text-text-secondary">
              <span className="flex items-center justify-between">
                <span>Finished count</span>
                <strong className="font-mono text-text-primary">
                  {finishedCount} / 8
                </strong>
              </span>
              <input
                type="range"
                min={0}
                max={8}
                value={finishedCount}
                onChange={(event) =>
                  setFinishedCount(Number(event.target.value))
                }
                className="accent-dark"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-text-secondary">
              <span className="flex items-center justify-between">
                <span>Size</span>
                <strong className="font-mono text-text-primary">
                  {size}px
                </strong>
              </span>
              <input
                type="range"
                min={40}
                max={112}
                value={size}
                onChange={(event) => setSize(Number(event.target.value))}
                className="accent-dark"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-text-secondary">
              <span className="flex items-center justify-between">
                <span>Stroke width</span>
                <strong className="font-mono text-text-primary">
                  {strokeWidth}px
                </strong>
              </span>
              <input
                type="range"
                min={4}
                max={16}
                value={strokeWidth}
                onChange={(event) => setStrokeWidth(Number(event.target.value))}
                className="accent-dark"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-text-secondary">
              <span className="flex items-center justify-between">
                <span>Gap angle</span>
                <strong className="font-mono text-text-primary">
                  {gapAngle}deg
                </strong>
              </span>
              <input
                type="range"
                min={0}
                max={28}
                value={gapAngle}
                onChange={(event) => setGapAngle(Number(event.target.value))}
                className="accent-dark"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-text-secondary">
              <span className="flex items-center justify-between">
                <span>Start angle</span>
                <strong className="font-mono text-text-primary">
                  {startAngle}deg
                </strong>
              </span>
              <input
                type="range"
                min={-180}
                max={180}
                value={startAngle}
                onChange={(event) => setStartAngle(Number(event.target.value))}
                className="accent-dark"
              />
            </label>
          </div>
        </DemoCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <DemoCard
          title="Computed Input"
          description="The demo now derives one weighted dataset from the finished slider while preserving the fixed skipped segment."
        >
          <div className="rounded-[24px] bg-[#0f172a] p-4 font-mono text-[12px] leading-6 text-slate-200">
            <div className="text-slate-400">segments</div>
            <pre className="m-0 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(segments, null, 2)}
            </pre>
          </div>
        </DemoCard>

        <DemoCard
          title="Runtime Notes"
          description="These are the cases the helpers account for before any SVG path is rendered."
        >
          <ul className="m-0 flex list-none flex-col gap-3 p-0 text-sm leading-6 text-text-secondary">
            <li>Empty lists render only the background track.</li>
            <li>
              Single segments can span the full circle with a two-arc path.
            </li>
            <li>
              Very small slices are filtered if they collapse below visibility.
            </li>
            <li>Oversized gaps are clamped so the ring never inverts.</li>
            <li>
              Total units:{" "}
              <strong className="font-mono text-text-primary">
                {totalUnits.toFixed(2)}
              </strong>
            </li>
          </ul>
        </DemoCard>
      </div>
    </div>
  );
}
