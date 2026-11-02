import { useEffect, useState, type ReactNode } from "react";
import { motion, useSpring, useTransform, type MotionValue } from "motion/react";
import { BarChart3, Clock, Workflow, type LucideIcon } from "lucide-react";

function secondsToNextHour() {
  const n = new Date();
  return 3600 - (n.getMinutes() * 60 + n.getSeconds());
}

/** A countdown to the top of the hour, a nod to the hourly executive updates. */
function HourlyLabel() {
  const [left, setLeft] = useState(secondsToNextHour);
  useEffect(() => {
    const id = window.setInterval(() => setLeft(secondsToNextHour()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <>
      Hourly report in <span className="tabular-nums">{mm}:{ss}</span>
    </>
  );
}

interface ChipDef {
  key: string;
  Icon: LucideIcon;
  content: ReactNode;
  pos: string;
  /** Parallax travel in px; negative values move opposite the cursor. */
  depth: number;
  delay: number;
}

const chips: ChipDef[] = [
  { key: "bi", Icon: BarChart3, content: "Power BI & DOMO", pos: "left-[2%] top-[17%]", depth: 30, delay: 0 },
  { key: "py", Icon: Workflow, content: "Python automation", pos: "right-[3%] top-[46%]", depth: -24, delay: 1.2 },
  { key: "hr", Icon: Clock, content: <HourlyLabel />, pos: "left-[6%] bottom-[15%]", depth: 40, delay: 2.1 },
];

function Chip({ chip, nx, ny }: { chip: ChipDef; nx: MotionValue<number>; ny: MotionValue<number> }) {
  const spring = { stiffness: 90, damping: 16 };
  const x = useSpring(useTransform(nx, [-0.5, 0.5], [-chip.depth, chip.depth]), spring);
  const y = useSpring(useTransform(ny, [-0.5, 0.5], [-chip.depth, chip.depth]), spring);

  return (
    <motion.div
      className={`absolute ${chip.pos}`}
      style={{ x, y }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.9 + chip.delay * 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="flex animate-float items-center gap-2 whitespace-nowrap rounded-full border border-white/80 bg-white/70 px-4 py-2.5 text-[13px] font-medium shadow-tile backdrop-blur-md motion-reduce:animate-none"
        style={{ animationDelay: `${chip.delay}s` }}
      >
        <chip.Icon size={15} aria-hidden="true" />
        {chip.content}
      </div>
    </motion.div>
  );
}

/** Decorative glass chips orbiting the hero shape. Wide screens only. */
export function FloatingChips({ nx, ny }: { nx: MotionValue<number>; ny: MotionValue<number> }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-10 top-6 hidden h-[640px] w-[640px] xl:block"
    >
      {chips.map((c) => (
        <Chip key={c.key} chip={c} nx={nx} ny={ny} />
      ))}
    </div>
  );
}
