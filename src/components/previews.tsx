import { useState } from "react";
import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

/* ───────────── Dashboard preview (interactive bars + donut) ───────────── */

// Illustrative values for the preview only — not real company data.
const bars = [30, 55, 42, 78, 65, 92, 70];

export function DashboardPreview() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      className="grid h-full grid-cols-[1.1fr_1fr] gap-2.5 bg-gradient-to-br from-[#0C1224] to-[#101A36] p-3.5"
      role="img"
      aria-label="Illustrative dark analytics dashboard with a bar chart and a donut chart"
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-8 flex-1 rounded-md bg-white/[0.07]" />
          ))}
        </div>

        <div className="relative flex flex-1 items-end gap-1.5 rounded-lg bg-white/5 p-3">
          {hovered !== null && (
            <div
              className="pointer-events-none absolute left-3 top-2 rounded-md bg-white px-2 py-1 text-[10px] font-medium text-ink shadow"
              role="status"
            >
              Week {hovered + 1} · {bars[hovered]}
            </div>
          )}
          {bars.map((h, i) => (
            <motion.div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={`flex-1 rounded-t-[3px] ${
                hovered === i
                  ? "bg-gradient-to-b from-[#9CCBFF] to-[#4A7BEA]"
                  : "bg-gradient-to-b from-[#3C7BFF] to-[#1B3E9A]"
              }`}
              style={{ height: `${h}%`, originY: 1 }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.07, ease }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex flex-1 items-center justify-center rounded-lg bg-white/5">
          <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden="true">
            <circle cx="42" cy="42" r="28" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" />
            <g transform="rotate(-90 42 42)">
              <motion.circle
                cx="42"
                cy="42"
                r="28"
                fill="none"
                stroke="#35C2FF"
                strokeWidth="10"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 0.68 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3, ease }}
              />
            </g>
          </svg>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-2 rounded-lg bg-white/5 p-3">
          {[88, 62, 40].map((w, i) => (
            <motion.div
              key={w}
              className="h-1.5 rounded-full bg-[#3C7BFF]"
              style={{ opacity: 1 - i * 0.2, originX: 0 }}
              initial={{ scaleX: 0, width: `${w}%` }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 + i * 0.1, ease }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────── Workflow preview (lines draw in) ───────────── */

const links = [
  "M60 60H150",
  "M150 60H250",
  "M250 60H340",
  "M150 60V125",
  "M250 60V125",
  "M150 125H250",
  "M150 125V190",
  "M250 125V190",
  "M150 190H250",
];

const nodes = [
  { x: 30, y: 46, fill: "#E3F6E3", stroke: "#59B85A" },
  { x: 120, y: 46, fill: "#4F86E8" },
  { x: 220, y: 46, fill: "#4F86E8" },
  { x: 120, y: 111, fill: "#4F86E8" },
  { x: 220, y: 111, fill: "#4F86E8" },
  { x: 120, y: 176, fill: "#4F86E8" },
  { x: 220, y: 176, fill: "#59B85A" },
];

export function WorkflowPreview() {
  return (
    <div className="h-full bg-[#FBFBFC]">
      <svg
        viewBox="12 28 370 196"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Illustrative workflow diagram: attendance data flows through validation steps to an incentive calculation"
      >
        <g stroke="#B9BEC9" strokeWidth="1.5" fill="none">
          {links.map((d, i) => (
            <motion.path
              key={d}
              d={d}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.07, ease }}
            />
          ))}
        </g>
        {nodes.map((n, i) => (
          <motion.rect
            key={i}
            x={n.x}
            y={n.y}
            width="60"
            height="28"
            rx="6"
            fill={n.fill}
            stroke={n.stroke}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
          />
        ))}
        <circle cx="340" cy="60" r="13" fill="#FFE27A" stroke="#E0B800" />
        <rect x="318" y="176" width="46" height="28" rx="14" fill="#DDE3F3" />
      </svg>
    </div>
  );
}

/* ───────────── KPI preview (tiles + sparklines) ───────────── */

const tiles = [
  { points: "0,26 12,20 24,22 36,12 48,14 60,4", accent: false },
  { points: "0,22 12,24 24,16 36,18 48,8 60,10", accent: true },
  { points: "0,10 12,14 24,12 36,20 48,16 60,22", accent: false },
  { points: "0,24 12,18 24,20 36,10 48,12 60,6", accent: false },
];

export function KpiPreview() {
  return (
    <div
      className="grid h-full grid-cols-2 gap-2.5 bg-[#F4F4F7] p-4"
      role="img"
      aria-label="Illustrative grid of four KPI tiles with trend lines"
    >
      {tiles.map((t, i) => (
        <motion.div
          key={i}
          className={`flex flex-col justify-between rounded-[10px] border p-3 ${
            t.accent ? "border-ink bg-lime" : "border-line bg-white"
          }`}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: i * 0.08, ease }}
        >
          <div className="space-y-1.5">
            <div className={`h-1.5 w-1/2 rounded-full ${t.accent ? "bg-ink/35" : "bg-line"}`} />
            <div className="h-3.5 w-2/3 rounded bg-ink" />
          </div>
          <svg viewBox="0 0 60 30" className="h-8 w-full" aria-hidden="true">
            <motion.polyline
              points={t.points}
              fill="none"
              stroke="#15151A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease }}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
