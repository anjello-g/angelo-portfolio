import { useState } from "react";
import { motion } from "motion/react";
import { useHoverPin } from "../lib/useHoverPin";

const ease = [0.22, 1, 0.36, 1] as const;

/* ───────────── Headcount dashboard: click a bar or segment and everything re-filters ───────────── */

// Illustrative values for the preview only — not real company data.
const PROGRAMS = [
  { name: "Program A", short: "A", color: "#3C7BFF" },
  { name: "Program B", short: "B", color: "#35C2FF" },
  { name: "Program C", short: "C", color: "#A7D2FF" },
];
const HEADCOUNT = [
  [22, 14, 9],
  [26, 17, 12],
  [24, 20, 13],
  [31, 22, 15],
  [29, 25, 18],
  [36, 27, 19],
  [34, 30, 23],
];
const ATTENDANCE = [
  [93, 90, 95],
  [94, 91, 94],
  [92, 92, 96],
  [95, 90, 95],
  [94, 93, 97],
  [96, 92, 96],
  [95, 94, 97],
];
const LAST = HEADCOUNT.length - 1;
const MAX_TOTAL = Math.max(...HEADCOUNT.map((r) => r.reduce((a, b) => a + b, 0)));
const CIRC = 2 * Math.PI * 28;
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

export function DashboardPreview() {
  const [week, setWeek] = useState<number | null>(null);
  const [prog, setProg] = useState<number | null>(null);
  const filtered = week !== null || prog !== null;

  const progs = prog === null ? [0, 1, 2] : [prog];
  const w = week ?? LAST;
  const headcount = sum(progs.map((p) => HEADCOUNT[w][p]));
  const billable = Math.round(headcount * 7.4);
  const attendance = sum(progs.map((p) => ATTENDANCE[w][p] * HEADCOUNT[w][p])) / headcount;

  // Donut: programme share for the chosen week, or across all weeks.
  const shareValues = PROGRAMS.map((_, p) =>
    week === null ? sum(HEADCOUNT.map((r) => r[p])) : HEADCOUNT[week][p],
  );
  const shareTotal = sum(shareValues);
  let offset = 0;
  const arcs = shareValues.map((v) => {
    const frac = v / shareTotal;
    const arc = { frac, start: offset };
    offset += frac;
    return arc;
  });

  const tiles = [
    { label: "Headcount", value: String(headcount) },
    { label: "Billable hrs", value: billable.toLocaleString() },
    { label: "Attendance", value: `${attendance.toFixed(1)}%` },
  ];

  return (
    <div
      className="grid h-full grid-cols-[1.25fr_1fr] gap-2.5 bg-gradient-to-br from-[#0C1224] to-[#101A36] p-3.5"
      role="group"
      aria-label="Illustrative headcount dashboard. Select a week or a program to filter the other charts."
    >
      <div className="flex min-h-0 flex-col gap-2">
        <div className="flex h-4 items-center justify-between text-[9px] text-white/55">
          <span aria-live="polite">
            Week {w + 1} · {prog === null ? "All programs" : PROGRAMS[prog].name}
          </span>
          {filtered && (
            <button
              type="button"
              onClick={() => {
                setWeek(null);
                setProg(null);
              }}
              className="rounded-full bg-white/15 px-2 py-0.5 font-medium text-white hover:bg-white/25"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex gap-1.5">
          {tiles.map((t) => (
            <div key={t.label} className="min-w-0 flex-1 rounded-md bg-white/[0.07] px-2 py-1.5">
              <div className="truncate text-[8px] uppercase tracking-wider text-white/50">{t.label}</div>
              <motion.div
                key={t.value}
                initial={{ opacity: 0.4, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="text-[13px] font-medium tabular-nums text-white"
              >
                {t.value}
              </motion.div>
            </div>
          ))}
        </div>

        <div className="flex min-h-0 flex-1 flex-col rounded-lg bg-white/5 px-2.5 pb-1.5 pt-2.5">
          <div className="flex min-h-0 flex-1 items-stretch gap-1.5">
            {HEADCOUNT.map((row, i) => {
              const visible = sum(progs.map((p) => row[p]));
              const dim = week !== null && week !== i;
              return (
                <button
                  key={i}
                  type="button"
                  aria-pressed={week === i}
                  aria-label={`Week ${i + 1}, headcount ${visible}`}
                  onClick={() => setWeek(week === i ? null : i)}
                  className="group/bar relative flex-1 rounded-sm focus-visible:outline-white"
                >
                  <motion.div
                    className="absolute inset-x-0 bottom-0 flex flex-col overflow-hidden rounded-t-[3px] transition-[height,opacity,filter] duration-500 group-hover/bar:brightness-125"
                    style={{ height: `${(visible / MAX_TOTAL) * 100}%`, opacity: dim ? 0.3 : 1, originY: 1 }}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, delay: 0.1 + i * 0.07, ease }}
                  >
                    {[2, 1, 0].map((p) => (
                      <div
                        key={p}
                        className="min-h-0 transition-[flex-grow] duration-500"
                        style={{ flexGrow: progs.includes(p) ? row[p] : 0, flexBasis: 0, background: PROGRAMS[p].color }}
                      />
                    ))}
                  </motion.div>
                </button>
              );
            })}
          </div>
          <div className="mt-1 flex gap-1.5 text-center text-[8px] text-white/40" aria-hidden="true">
            {HEADCOUNT.map((_, i) => (
              <span key={i} className={`flex-1 ${week === i ? "font-medium text-white" : ""}`}>
                W{i + 1}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-col gap-2">
        <div className="flex flex-1 items-center justify-center rounded-lg bg-white/5">
          <div className="relative">
            <svg width="92" height="92" viewBox="0 0 84 84" aria-hidden="true">
              <circle cx="42" cy="42" r="28" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
              <g transform="rotate(-90 42 42)">
                {arcs.map((a, p) => (
                  <circle
                    key={p}
                    cx="42"
                    cy="42"
                    r="28"
                    fill="none"
                    stroke={PROGRAMS[p].color}
                    strokeWidth={prog === p ? 13 : 10}
                    strokeDasharray={`${Math.max(a.frac * CIRC - 1.5, 0)} ${CIRC}`}
                    strokeDashoffset={-a.start * CIRC}
                    opacity={prog === null || prog === p ? 1 : 0.2}
                    className="cursor-pointer transition-all duration-500"
                    onClick={() => setProg(prog === p ? null : p)}
                  />
                ))}
              </g>
            </svg>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-[11px] font-medium tabular-nums text-white">
              {prog === null ? "All" : `${Math.round(arcs[prog].frac * 100)}%`}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 rounded-lg bg-white/5 p-1.5" role="group" aria-label="Filter by program">
          {PROGRAMS.map((p, i) => (
            <button
              key={p.name}
              type="button"
              aria-pressed={prog === i}
              onClick={() => setProg(prog === i ? null : i)}
              className={`flex items-center gap-2 rounded px-1.5 py-1 text-left text-[9px] transition-colors ${
                prog === i ? "bg-white text-ink" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────── Workflow preview: click a step to trace where its data came from ───────────── */

const NODES = [
  { x: 30, y: 46, label: "Raw", fill: "#E3F6E3", stroke: "#59B85A", text: "#1F5E20" },
  { x: 120, y: 46, label: "Clean", fill: "#4F86E8" },
  { x: 220, y: 46, label: "Check", fill: "#4F86E8" },
  { x: 120, y: 111, label: "Join", fill: "#4F86E8" },
  { x: 220, y: 111, label: "Rules", fill: "#4F86E8" },
  { x: 120, y: 176, label: "Calc", fill: "#4F86E8" },
  { x: 220, y: 176, label: "Report", fill: "#59B85A" },
] as const;

// [from node, to node, path]. Node 7 is the alert bubble.
const EDGES: [number, number, string][] = [
  [0, 1, "M60 60H120"],
  [1, 2, "M180 60H220"],
  [2, 7, "M280 60H327"],
  [1, 3, "M150 74V111"],
  [2, 4, "M250 74V111"],
  [3, 4, "M180 125H220"],
  [3, 5, "M150 139V176"],
  [4, 6, "M250 139V176"],
  [5, 6, "M180 190H220"],
];

/** Every node and edge on any path from the source to `target`. */
function lineage(target: number) {
  const nodes = new Set<number>([target]);
  const edges = new Set<number>();
  let grew = true;
  while (grew) {
    grew = false;
    EDGES.forEach(([from, to], i) => {
      if (nodes.has(to) && !edges.has(i)) {
        edges.add(i);
        nodes.add(from);
        grew = true;
      }
    });
  }
  return { nodes, edges };
}

export function WorkflowPreview() {
  const { active, bind, pin, clear } = useHoverPin<number>();
  const trace = active !== null ? lineage(active) : null;

  return (
    <div className="relative h-full bg-[#FBFBFC]">
      <svg
        viewBox="12 28 370 196"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role="group"
        aria-label="Illustrative workflow diagram. Select a step to trace where its data came from."
      >
        <g fill="none" strokeLinecap="round">
          {EDGES.map(([, , d], i) => {
            const on = trace?.edges.has(i);
            return (
              <motion.path
                key={d}
                d={d}
                stroke={on ? "#14161A" : "#B9BEC9"}
                strokeWidth={on ? 2.5 : 1.5}
                opacity={trace && !on ? 0.35 : 1}
                className="transition-[stroke,opacity] duration-300"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.07, ease }}
              />
            );
          })}
        </g>

        {NODES.map((n, i) => {
          const on = trace?.nodes.has(i);
          return (
            <g
              key={n.label}
              role="button"
              tabIndex={0}
              aria-pressed={pin === i}
              aria-label={`${n.label} step`}
              className="cursor-pointer outline-none focus-visible:[&>rect]:stroke-ink"
              opacity={trace && !on ? 0.4 : 1}
              style={{ transition: "opacity 0.3s" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  bind(i).onClick();
                }
              }}
              {...bind(i)}
            >
              <rect
                x={n.x}
                y={n.y}
                width="60"
                height="28"
                rx="6"
                fill={n.fill}
                stroke={on ? "#A6E22E" : "stroke" in n ? n.stroke : "none"}
                strokeWidth={on ? 3 : 1}
              />
              <text
                x={n.x + 30}
                y={n.y + 18}
                textAnchor="middle"
                fontSize="11"
                fontWeight="500"
                fill={"text" in n ? n.text : "#fff"}
                style={{ pointerEvents: "none" }}
              >
                {n.label}
              </text>
            </g>
          );
        })}
        <circle
          cx="340"
          cy="60"
          r="13"
          fill="#FFE27A"
          stroke="#E0B800"
          opacity={trace && !trace.nodes.has(7) ? 0.4 : 1}
          style={{ transition: "opacity 0.3s" }}
        />
        <rect x="318" y="176" width="46" height="28" rx="14" fill="#DDE3F3" />
      </svg>

      <p className="pointer-events-none absolute inset-x-3 bottom-2 flex items-center justify-between text-[10px] text-muted" aria-live="polite">
        <span>
          {trace && active !== null
            ? `${NODES[active].label}: ${trace.nodes.size - 1} upstream step${trace.nodes.size === 2 ? "" : "s"}`
            : "Select a step to trace its data lineage"}
        </span>
        {pin !== null && (
          <button
            type="button"
            onClick={clear}
            className="pointer-events-auto rounded-full border border-line bg-white px-2 py-0.5 font-medium text-ink"
          >
            Clear
          </button>
        )}
      </p>
    </div>
  );
}

/* ───────────── KPI preview: Daily / Weekly switch and a focus tile ───────────── */

type Mode = "daily" | "weekly";

// Illustrative values only.
const KPIS = [
  {
    label: "Adherence",
    daily: { value: "94.2%", delta: "+0.8", pts: [48, 56, 52, 64, 60, 76] },
    weekly: { value: "93.6%", delta: "+1.4", pts: [34, 42, 54, 52, 66, 74] },
  },
  {
    label: "Occupancy",
    daily: { value: "81.5%", delta: "+2.1", pts: [60, 52, 66, 58, 74, 70] },
    weekly: { value: "79.9%", delta: "+0.6", pts: [50, 58, 54, 62, 60, 68] },
  },
  {
    label: "Attendance",
    daily: { value: "96.1%", delta: "-0.3", pts: [72, 70, 76, 68, 66, 64] },
    weekly: { value: "95.4%", delta: "+0.5", pts: [58, 62, 60, 68, 72, 78] },
  },
  {
    label: "Quality",
    daily: { value: "91.7%", delta: "+1.2", pts: [40, 46, 58, 54, 66, 72] },
    weekly: { value: "90.8%", delta: "+2.0", pts: [30, 40, 44, 56, 62, 80] },
  },
];

const sparkPath = (pts: number[]) =>
  pts.map((v, i) => `${i === 0 ? "M" : "L"}${(i * 60) / (pts.length - 1)} ${(28 - (v / 100) * 26).toFixed(1)}`).join(" ");

export function KpiPreview() {
  const [mode, setMode] = useState<Mode>("daily");
  const [focus, setFocus] = useState(1);

  return (
    <div
      className="flex h-full flex-col gap-2.5 bg-[#F4F4F7] p-4"
      role="group"
      aria-label="Illustrative KPI tiles. Switch between daily and weekly, or select a tile."
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-muted">Program KPIs</span>
        <div className="flex rounded-full border border-line bg-white p-0.5 text-[10px] font-medium" role="group" aria-label="Period">
          {(["daily", "weekly"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-full px-2.5 py-0.5 capitalize transition-colors ${
                mode === m ? "bg-ink text-white" : "text-muted hover:text-ink"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-2.5">
        {KPIS.map((k, i) => {
          const d = k[mode];
          const on = focus === i;
          const d0 = sparkPath(d.pts);
          return (
            <motion.button
              key={k.label}
              type="button"
              aria-pressed={on}
              onClick={() => setFocus(i)}
              className={`flex min-h-0 flex-col justify-between rounded-[10px] border p-2.5 text-left transition-colors duration-300 ${
                on ? "border-ink bg-lime" : "border-line bg-white hover:border-[#C9C9D1]"
              }`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
            >
              <div className="flex items-start justify-between">
                <span className={`text-[9px] ${on ? "text-ink/70" : "text-muted"}`}>{k.label}</span>
                <span
                  className={`text-[9px] font-medium tabular-nums ${
                    d.delta.startsWith("-") ? "text-[#B3402F]" : on ? "text-ink" : "text-[#3E8A1F]"
                  }`}
                >
                  {d.delta.startsWith("-") ? "▼" : "▲"} {d.delta.replace(/^[+-]/, "")}
                </span>
              </div>
              <motion.div
                key={d.value}
                initial={{ opacity: 0.3, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="text-[15px] font-semibold tabular-nums leading-none text-ink"
              >
                {d.value}
              </motion.div>
              <svg viewBox="0 0 60 30" className="h-6 w-full" preserveAspectRatio="none" aria-hidden="true">
                <motion.path
                  initial={{ d: d0 }}
                  animate={{ d: d0 }}
                  transition={{ duration: 0.5, ease }}
                  fill="none"
                  stroke="#15151A"
                  strokeWidth={on ? 2.4 : 1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
