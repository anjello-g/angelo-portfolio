import { useState } from "react";
import { motion } from "motion/react";
import { Mic } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

/* ───────────── Hourly staffing heat grid ───────────── */

const ROWS = 5;
const COLS = 12;
const NOW_COL = 8;
// Illustrative intensity values only — not real data.
const level = (r: number, c: number) => [0.18, 0.38, 0.62, 0.9][(r * 7 + c * 5 + ((r * c) % 3)) % 4];

export function HourlyPreview() {
  const [hot, setHot] = useState<number | null>(null);

  return (
    <div
      className="flex h-full flex-col gap-3 bg-[#F4F6FB] p-5"
      role="img"
      aria-label="Illustrative heat grid of hourly staffing across sites"
      onMouseLeave={() => setHot(null)}
    >
      <div className="flex items-center justify-between text-[10px] font-medium text-muted">
        <span>Hourly view</span>
        <span className="rounded-full bg-lime px-2 py-0.5 text-ink">Updated hourly</span>
      </div>
      <div className="grid flex-1 grid-cols-12 gap-1.5">
        {Array.from({ length: COLS }).map((_, c) => (
          <div key={c} className="grid grid-rows-5 gap-1.5" onMouseEnter={() => setHot(c)}>
            {Array.from({ length: ROWS }).map((__, r) => {
              const isHot = hot === c;
              const isNow = c === NOW_COL && hot === null;
              return (
                <motion.div
                  key={r}
                  className="rounded-[4px] transition-colors duration-200"
                  style={{
                    background: isHot
                      ? "#15151A"
                      : isNow
                        ? `rgba(166,226,46,${0.35 + level(r, c) * 0.65})`
                        : `rgba(60,123,255,${level(r, c)})`,
                  }}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: (c * ROWS + r) * 0.008, ease }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────── Voice / conversation preview ───────────── */

const waveHeights = Array.from({ length: 26 }, (_, i) =>
  14 + Math.round(Math.abs(Math.sin(i * 0.8) + Math.sin(i * 0.33)) * 26),
);

export function VoicePreview() {
  return (
    <div
      className="flex h-full flex-col justify-between bg-gradient-to-br from-[#EEF3FF] to-[#F7F1FF] p-5"
      role="img"
      aria-label="Illustrative conversation with a voice waveform"
    >
      <div className="max-w-[70%] rounded-2xl rounded-bl-md bg-white p-3 shadow-tile">
        <div className="h-2 w-[90%] rounded-full bg-line" />
        <div className="mt-2 h-2 w-[60%] rounded-full bg-line" />
      </div>
      <div className="flex h-16 items-center justify-center gap-[3px]">
        {waveHeights.map((h, i) => (
          <span
            key={i}
            className="w-1 origin-center rounded-full bg-ink group-hover:animate-wave motion-reduce:animate-none"
            style={{ height: h, animationDelay: `${(i % 8) * 0.09}s`, opacity: 0.35 + (h / 50) * 0.65 }}
          />
        ))}
      </div>
      <div className="ml-auto flex max-w-[70%] items-center gap-2 rounded-2xl rounded-br-md bg-lime p-3">
        <Mic size={14} aria-hidden="true" />
        <div className="h-2 w-24 rounded-full bg-ink/30" />
      </div>
    </div>
  );
}

/* ───────────── Online bookstore preview ───────────── */

const covers = ["#C9D6F2", "#F2D6C9", "#D3EBC8", "#EADCF5", "#F5EBC2", "#C8E8EB"];

export function ShopPreview() {
  return (
    <div
      className="flex h-full flex-col gap-3 bg-[#FBFBFC] p-4"
      role="img"
      aria-label="Illustrative online bookstore grid"
    >
      <div className="flex items-center gap-2">
        <div className="h-7 flex-1 rounded-full border border-line bg-white" />
        <div className="h-7 w-7 rounded-full bg-ink" />
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2.5">
        {covers.map((c, i) => (
          <motion.div
            key={c}
            className="flex flex-col gap-1.5"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.06, ease }}
          >
            <div className="flex-1 rounded-md" style={{ background: c }} />
            <div className="h-1.5 w-4/5 rounded-full bg-ink/70" />
            <div className="h-1.5 w-1/2 rounded-full bg-line" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
