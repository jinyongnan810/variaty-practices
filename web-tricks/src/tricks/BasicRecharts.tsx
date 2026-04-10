// Basic Recharts demo:
// - switches between bar, line, and pie charts with tabs
// - uses hardcoded data to show common chart setups
// - includes interactive legends and a shared custom tooltip
import { useId, useState } from "react";
import type { TooltipContentProps, TooltipValueType } from "recharts";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TabKey = "bar" | "line" | "pie";
type TooltipName = string | number;
type BarSeriesKey = "desktop" | "mobile";
type LineSeriesKey = "signups" | "activeUsers" | "revenue";

const barSeries = [
  { key: "desktop" as const, label: "Desktop", color: "#0f172a" },
  { key: "mobile" as const, label: "Mobile", color: "#2563eb" },
];

const lineSeries = [
  { key: "signups" as const, label: "Signups", color: "#2563eb" },
  { key: "activeUsers" as const, label: "Active Users", color: "#14b8a6" },
  { key: "revenue" as const, label: "Revenue", color: "#f59e0b" },
];

const tabs: { key: TabKey; label: string; description: string }[] = [
  {
    key: "bar",
    label: "Bar Chart",
    description: "Compare two metrics across locations.",
  },
  {
    key: "line",
    label: "Line Chart",
    description: "Track three related series over time.",
  },
  {
    key: "pie",
    label: "Pie Chart",
    description: "Split a whole into visible segments.",
  },
];

const barData = [
  { location: "Seoul", desktop: 420, mobile: 310 },
  { location: "Tokyo", desktop: 390, mobile: 360 },
  { location: "Berlin", desktop: 320, mobile: 240 },
  { location: "Austin", desktop: 460, mobile: 330 },
  { location: "Sydney", desktop: 370, mobile: 280 },
];

const lineData = [
  { month: "Jan", signups: 140, activeUsers: 320, revenue: 24 },
  { month: "Feb", signups: 205, activeUsers: 410, revenue: 36 },
  { month: "Mar", signups: 125, activeUsers: 280, revenue: 19 },
  { month: "Apr", signups: 260, activeUsers: 455, revenue: 41 },
  { month: "May", signups: 175, activeUsers: 330, revenue: 27 },
  { month: "Jun", signups: 295, activeUsers: 495, revenue: 45 },
];

const pieData = [
  { name: "Direct", value: 38, fill: "#0f172a" },
  { name: "Search", value: 27, fill: "#2563eb" },
  { name: "Referral", value: 19, fill: "#14b8a6" },
  { name: "Social", value: 16, fill: "#f59e0b" },
];

type CustomTooltipEntry = {
  color?: string;
  fill?: string;
  dataKey?: string | number;
  name?: string | number;
  value?: number | string | ReadonlyArray<number | string>;
  payload?: {
    fill?: string;
  };
};

// Tab button for switching between chart types.
function TabButton({
  active,
  controls,
  id,
  label,
  onClick,
}: {
  active: boolean;
  controls: string;
  id: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      id={id}
      role="tab"
      type="button"
      aria-selected={active}
      aria-controls={controls}
      tabIndex={active ? 0 : -1}
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        active
          ? "bg-dark text-text-inverted"
          : "bg-white text-text-secondary border border-border hover:text-text-primary"
      }`}
    >
      {label}
    </button>
  );
}

// Clickable legend used to focus one series or slice at a time.
function InteractiveLegend({
  items,
  selectedKey,
  title,
  onToggle,
}: {
  items: { key: string; label: string; color: string }[];
  selectedKey: string | null;
  title: string;
  onToggle: (key: string) => void;
}) {
  return (
    <div role="group" aria-label={title} className="mb-4 flex flex-wrap gap-2">
      {items.map((item) => {
        const isSelected = selectedKey === item.key;
        const isDimmed = selectedKey !== null && !isSelected;

        return (
          <button
            key={item.key}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onToggle(item.key)}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
              isSelected
                ? "border-transparent bg-dark text-text-inverted"
                : "border-border bg-white text-text-secondary hover:text-text-primary"
            } ${isDimmed ? "opacity-55" : ""}`}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Shared tooltip renderer with colored dots and rounded card styling.
function CustomTooltip({
  active,
  label,
  payload,
}: TooltipContentProps<TooltipValueType, TooltipName>) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="min-w-[180px] rounded-2xl border border-border bg-white px-4 py-3 shadow-lg">
      {label !== undefined && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-text-tertiary">
          {label}
        </p>
      )}
      <div className="flex flex-col gap-2">
        {payload.map((entry, index) => {
          const tooltipEntry = entry as CustomTooltipEntry;
          const color =
            tooltipEntry.color ??
            tooltipEntry.fill ??
            tooltipEntry.payload?.fill ??
            "#0f172a";
          const value = Array.isArray(tooltipEntry.value)
            ? tooltipEntry.value.join(" / ")
            : tooltipEntry.value;

          return (
            <div
              key={`${tooltipEntry.dataKey ?? tooltipEntry.name ?? "item"}-${index}`}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <div className="flex items-center gap-2 text-text-secondary">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span>{tooltipEntry.name}</span>
              </div>
              <span className="font-semibold text-text-primary">{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Main trick component that coordinates tabs, legends, and chart state.
export default function BasicRecharts() {
  const [activeTab, setActiveTab] = useState<TabKey>("bar");
  const [selectedBarSeries, setSelectedBarSeries] =
    useState<BarSeriesKey | null>(null);
  const [selectedLineSeries, setSelectedLineSeries] =
    useState<LineSeriesKey | null>(null);
  const [selectedPieSlice, setSelectedPieSlice] = useState<string | null>(null);
  const id = useId();
  const currentTab = tabs.find((tab) => tab.key === activeTab) ?? tabs[0];
  const tabPanelId = `${id}-${activeTab}-panel`;

  return (
    <section className="w-[820px] max-w-full rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-text-tertiary">
            React + Recharts
          </span>
          <div className="flex flex-col gap-2">
            <h3 className="m-0 font-display text-3xl font-extrabold tracking-tight text-text-primary">
              Basic chart patterns
            </h3>
            <p className="m-0 max-w-[520px] text-sm leading-6 text-text-secondary">
              A minimal Recharts demo with three hardcoded visualizations:
              grouped bars, multi-series lines, and a pie chart.
            </p>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Chart type"
          className="flex flex-wrap gap-3"
        >
          {tabs.map((tab) => (
            <TabButton
              key={tab.key}
              id={`${id}-${tab.key}-tab`}
              controls={`${id}-${tab.key}-panel`}
              label={tab.label}
              active={tab.key === activeTab}
              onClick={() => setActiveTab(tab.key)}
            />
          ))}
        </div>

        <div
          id={tabPanelId}
          role="tabpanel"
          aria-labelledby={`${id}-${activeTab}-tab`}
          className="rounded-[24px] border border-border bg-card p-5"
        >
          <div className="mb-5 flex flex-col gap-1">
            <h4 className="m-0 font-display text-xl font-bold text-text-primary">
              {currentTab.label}
            </h4>
            <p className="m-0 text-sm text-text-secondary">
              {currentTab.description}
            </p>
          </div>

          {activeTab === "bar" && (
            <>
              <InteractiveLegend
                title="Bar chart legend"
                items={barSeries}
                selectedKey={selectedBarSeries}
                onToggle={(key) =>
                  setSelectedBarSeries((current) =>
                    current === key ? null : (key as BarSeriesKey),
                  )
                }
              />
              <div className="h-[360px] w-full" aria-label="Bar chart demo">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} barGap={10}>
                    <CartesianGrid stroke="#d4d4d8" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="location"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip
                      content={(props) => <CustomTooltip {...props} />}
                    />
                    <Bar
                      dataKey="desktop"
                      name="Desktop"
                      fill="#0f172a"
                      style={{ transition: "fill-opacity 240ms ease" }}
                      fillOpacity={
                        selectedBarSeries === null ||
                        selectedBarSeries === "desktop"
                          ? 1
                          : 0.22
                      }
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey="mobile"
                      name="Mobile"
                      fill="#2563eb"
                      style={{ transition: "fill-opacity 240ms ease" }}
                      fillOpacity={
                        selectedBarSeries === null ||
                        selectedBarSeries === "mobile"
                          ? 1
                          : 0.22
                      }
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {activeTab === "line" && (
            <>
              <InteractiveLegend
                title="Line chart legend"
                items={lineSeries}
                selectedKey={selectedLineSeries}
                onToggle={(key) =>
                  setSelectedLineSeries((current) =>
                    current === key ? null : (key as LineSeriesKey),
                  )
                }
              />
              <div className="h-[360px] w-full" aria-label="Line chart demo">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <CartesianGrid stroke="#d4d4d8" strokeDasharray="3 3" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip
                      content={(props) => <CustomTooltip {...props} />}
                    />
                    <Line
                      type="monotone"
                      dataKey="signups"
                      name="Signups"
                      stroke="#2563eb"
                      strokeWidth={3}
                      style={{ transition: "stroke-opacity 240ms ease" }}
                      strokeOpacity={
                        selectedLineSeries === null ||
                        selectedLineSeries === "signups"
                          ? 1
                          : 0.18
                      }
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="activeUsers"
                      name="Active Users"
                      stroke="#14b8a6"
                      strokeWidth={3}
                      style={{ transition: "stroke-opacity 240ms ease" }}
                      strokeOpacity={
                        selectedLineSeries === null ||
                        selectedLineSeries === "activeUsers"
                          ? 1
                          : 0.18
                      }
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      style={{ transition: "stroke-opacity 240ms ease" }}
                      strokeOpacity={
                        selectedLineSeries === null ||
                        selectedLineSeries === "revenue"
                          ? 1
                          : 0.18
                      }
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {activeTab === "pie" && (
            <>
              <InteractiveLegend
                title="Pie chart legend"
                items={pieData.map((item) => ({
                  key: item.name,
                  label: item.name,
                  color: item.fill,
                }))}
                selectedKey={selectedPieSlice}
                onToggle={(key) =>
                  setSelectedPieSlice((current) =>
                    current === key ? null : key,
                  )
                }
              />
              <div className="h-[360px] w-full" aria-label="Pie chart demo">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={80}
                      outerRadius={122}
                      paddingAngle={1}
                      shape={(props, index) => (
                        <Sector
                          {...props}
                          style={{
                            transition:
                              "opacity 240ms ease, transform 240ms ease, d 240ms ease",
                          }}
                          outerRadius={
                            selectedPieSlice === pieData[index]?.name
                              ? 132
                              : props.outerRadius
                          }
                          fill={pieData[index]?.fill ?? props.fill}
                          opacity={
                            selectedPieSlice === null ||
                            selectedPieSlice === pieData[index]?.name
                              ? 1
                              : 0.28
                          }
                        />
                      )}
                    />
                    <Tooltip
                      content={(props) => <CustomTooltip {...props} />}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
