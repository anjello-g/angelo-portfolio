import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Mic, ShoppingBag } from "lucide-react";
import { useCoarsePointer } from "../lib/useCoarsePointer";
import { useHoverPin } from "../lib/useHoverPin";

const ease = [0.22, 1, 0.36, 1] as const;

/* ───────────── Hourly staffing heat grid: hover or tap an hour to read it ───────────── */

const ROWS = 5;
const COLS = 12;
const FIRST_HOUR = 8;
const NOW_COL = 8;
// Illustrative intensity values only — not real data.
const level = (r: number, c: number) => [0.18, 0.38, 0.62, 0.9][(r * 7 + c * 5 + ((r * c) % 3)) % 4];
const staffedAt = (c: number) => Math.round(Array.from({ length: ROWS }, (_, r) => level(r, c)).reduce((a, b) => a + b, 0) * 38);
const hourLabel = (c: number) => `${String(FIRST_HOUR + c).padStart(2, "0")}:00`;

export function HourlyPreview() {
  const coarse = useCoarsePointer();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const { active, pin, bind, clear } = useHoverPin<number>();
  const [sweep, setSweep] = useState(NOW_COL);

  // Touch screens have no hover, so the highlight sweeps across the day until the visitor taps an hour.
  useEffect(() => {
    if (!coarse || !inView || pin !== null) return;
    const id = window.setInterval(() => setSweep((s) => (s + 1) % COLS), 1100);
    return () => window.clearInterval(id);
  }, [coarse, inView, pin]);

  const hot = active ?? (coarse && pin === null ? sweep : null);
  const shown = hot ?? NOW_COL;

  return (
    <div
      ref={ref}
      className="flex h-full flex-col gap-3 bg-[#F4F6FB] p-5"
      role="group"
      aria-label="Illustrative heat grid of hourly staffing across sites. Select an hour to read it."
    >
      <div className="flex items-center justify-between text-[10px] font-medium text-muted">
        <span aria-live="polite" className="tabular-nums">
          {hot === null ? "Now" : "Hour"} · {hourLabel(shown)} · <span className="text-ink">{staffedAt(shown)} on shift</span>
        </span>
        {pin !== null ? (
          <button type="button" onClick={clear} className="rounded-full border border-line bg-surface px-2 py-0.5 text-ink">
            Clear
          </button>
        ) : (
          <span className="rounded-full bg-accent text-onaccent px-2 py-0.5">Updated hourly</span>
        )}
      </div>
      <div className="grid flex-1 grid-cols-12 gap-1.5">
        {Array.from({ length: COLS }).map((_, c) => (
          <button
            key={c}
            type="button"
            aria-pressed={pin === c}
            aria-label={`${hourLabel(c)}, ${staffedAt(c)} on shift`}
            className="grid grid-rows-5 gap-1.5 rounded-[4px]"
            {...bind(c)}
          >
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
          </button>
        ))}
      </div>
    </div>
  );
}

/* ───────────── Voice / conversation preview: tap the mic to "listen" ───────────── */

const waveHeights = Array.from({ length: 26 }, (_, i) =>
  14 + Math.round(Math.abs(Math.sin(i * 0.8) + Math.sin(i * 0.33)) * 26),
);

export function VoicePreview() {
  const [listening, setListening] = useState(false);

  return (
    <div
      className="flex h-full flex-col justify-between bg-gradient-to-br from-[#EEF3FF] to-[#F7F1FF] p-5"
      role="group"
      aria-label="Illustrative conversation with a voice waveform. Select the microphone to animate it."
    >
      <div className="max-w-[70%] rounded-2xl rounded-bl-md bg-surface p-3 shadow-tile">
        <div className="h-2 w-[90%] rounded-full bg-line" />
        <div className="mt-2 h-2 w-[60%] rounded-full bg-line" />
      </div>
      <div className="flex h-16 items-center justify-center gap-[3px]" aria-hidden="true">
        {waveHeights.map((h, i) => (
          <span
            key={i}
            className={`w-1 origin-center rounded-full bg-ink motion-reduce:animate-none ${
              listening ? "animate-wave" : "group-hover:animate-wave [@media(hover:none)]:animate-wave"
            }`}
            style={{ height: h, animationDelay: `${(i % 8) * 0.09}s`, opacity: 0.35 + (h / 50) * 0.65 }}
          />
        ))}
      </div>
      <button
        type="button"
        aria-pressed={listening}
        aria-label="Toggle voice demo"
        onClick={() => setListening((v) => !v)}
        className={`ml-auto flex max-w-[70%] items-center gap-2 rounded-2xl rounded-br-md p-3 text-[10px] font-medium transition-colors ${
          listening ? "bg-ink text-onink" : "bg-accent text-onaccent"
        }`}
      >
        <Mic size={14} aria-hidden="true" />
        {listening ? "Listening…" : <span className="h-2 w-24 rounded-full bg-ink/30" />}
      </button>
    </div>
  );
}

/* ───────────── Online bookstore preview: tap a book to add it to the bag ───────────── */

const covers = ["#C9D6F2", "#F2D6C9", "#D3EBC8", "#EADCF5", "#F5EBC2", "#C8E8EB"];

export function ShopPreview() {
  const [bag, setBag] = useState<number[]>([]);
  const toggle = (i: number) => setBag((b) => (b.includes(i) ? b.filter((x) => x !== i) : [...b, i]));

  return (
    <div
      className="flex h-full flex-col gap-3 bg-[#FBFBFC] p-4"
      role="group"
      aria-label="Illustrative online bookstore grid. Select a book to add it to the bag."
    >
      <div className="flex items-center gap-2">
        <div className="h-7 flex-1 rounded-full border border-line bg-surface" />
        <motion.div
          key={bag.length}
          initial={{ scale: bag.length ? 1.25 : 1 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 18 }}
          className="relative grid h-7 w-7 place-items-center rounded-full bg-ink text-onink"
          aria-live="polite"
        >
          <ShoppingBag size={13} aria-hidden="true" />
          {bag.length > 0 && (
            <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent text-onaccent px-1 text-[9px] font-semibold">
              {bag.length}
            </span>
          )}
          <span className="sr-only">{bag.length} in bag</span>
        </motion.div>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2.5">
        {covers.map((c, i) => {
          const inBag = bag.includes(i);
          return (
            <motion.button
              key={c}
              type="button"
              aria-pressed={inBag}
              aria-label={`Book ${i + 1}${inBag ? ", in bag" : ""}`}
              onClick={() => toggle(i)}
              className="flex min-h-0 flex-col gap-1.5 text-left"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.96 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06, ease }}
            >
              <div
                className={`relative flex-1 rounded-md ring-2 transition-shadow ${inBag ? "ring-ink" : "ring-transparent"}`}
                style={{ background: c }}
              >
                {inBag && (
                  <span className="absolute right-1 top-1 rounded-full bg-ink px-1.5 py-0.5 text-[8px] font-medium text-onink">
                    Added
                  </span>
                )}
              </div>
              <div className="h-1.5 w-4/5 rounded-full bg-ink/70" />
              <div className="h-1.5 w-1/2 rounded-full bg-line" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
