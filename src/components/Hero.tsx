import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { ArrowRight, Mail } from "lucide-react";
import { profile, taglines, type Tagline } from "../data/content";
import { GlassShape } from "./GlassShape";
import { FloatingChips } from "./FloatingChips";
import { Magnetic } from "./Magnetic";
import { useCoarsePointer } from "../lib/useCoarsePointer";

const ease = [0.22, 1, 0.36, 1] as const;

/** One headline line. It slides up into view from behind a mask and slides out the top when replaced. */
function MaskedLine({ children, index, first }: { children: ReactNode; index: number; first: boolean }) {
  return (
    <span className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
      <motion.span
        className="block"
        variants={{
          enter: { y: "105%" },
          center: { y: 0, transition: { duration: 0.7, delay: first ? 0.1 + index * 0.1 : 0.05 + index * 0.1, ease } },
          exit: { y: "-105%", transition: { duration: 0.45, delay: index * 0.06, ease } },
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** The italic last word(s), with the hand-drawn underline that redraws each time. */
function Accent({ children, first }: { children: ReactNode; first: boolean }) {
  return (
    <span className="italic-serif relative inline-block tracking-[-0.02em]">
      {children}
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 300 14"
        preserveAspectRatio="none"
        className="absolute -bottom-0.5 left-0 h-[0.12em] w-full overflow-visible"
      >
        <motion.path
          d="M3 9 C 70 2, 150 13, 297 5"
          fill="none"
          style={{ stroke: "rgb(var(--accent-deep))" }}
          strokeWidth="5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, delay: first ? 1.0 : 0.8, ease }}
        />
      </svg>
    </span>
  );
}

/** Static copy of a tagline, used invisibly to reserve the height of the tallest one. */
function GhostTagline({ t }: { t: Tagline }) {
  return (
    <span aria-hidden="true" className="invisible block [grid-area:1/1]">
      <span className="block">{t.line1}</span>
      <span className="block">
        {t.lead}
        <span className="italic-serif tracking-[-0.02em]">{t.accent}</span>
      </span>
    </span>
  );
}

/** Picks the next headline at a random moment, 6 to 15 seconds apart, never the same one twice in a row. */
function useRotatingTagline(count: number, paused: boolean) {
  const [index, setIndex] = useState(0);
  const [rotated, setRotated] = useState(false);

  useEffect(() => {
    if (paused || count < 2) return;
    let timer = 0;
    let current = 0;
    let bag: number[] = [];

    const schedule = () => {
      timer = window.setTimeout(tick, 6000 + Math.random() * 9000);
    };
    const tick = () => {
      if (document.hidden) return schedule(); // don't change while the tab is in the background
      if (bag.length === 0) {
        // Shuffle bag: every headline appears once before any repeats.
        bag = Array.from({ length: count }, (_, i) => i).filter((i) => i !== current);
        for (let i = bag.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [bag[i], bag[j]] = [bag[j], bag[i]];
        }
      }
      current = bag.pop() as number;
      setIndex(current);
      setRotated(true);
      schedule();
    };

    schedule();
    return () => window.clearTimeout(timer);
  }, [count, paused]);

  return { index, rotated };
}

export function Hero() {
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const { index: taglineIndex, rotated } = useRotatingTagline(taglines.length, Boolean(reduced));
  const first = taglineIndex === 0 && !rotated;
  const tagline = taglines[taglineIndex];
  const sectionRef = useRef<HTMLElement>(null);
  // Cursor position in px (for the spotlight) and normalised -0.5…0.5 (for parallax).
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(460px circle at ${mx}px ${my}px, rgb(var(--accent) / 0.3), rgb(var(--accent) / 0) 65%)`;

  // No cursor on touch screens: the glass shape and chips sway with scroll instead.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!coarse || reduced) return;
    nx.set(Math.sin(p * Math.PI * 1.5) * 0.4);
    ny.set((p - 0.4) * 0.7);
  });

  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    mx.set(x);
    my.set(y);
    nx.set(x / r.width - 0.5);
    ny.set(y / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(-1000);
    my.set(-1000);
    nx.set(0);
    ny.set(0);
  };

  return (
    <section ref={sectionRef} id="home" className="relative overflow-hidden" onMouseMove={onMove} onMouseLeave={onLeave}>
      {/* soft arc */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-64 top-36 hidden h-[1100px] w-[1100px] rounded-full md:block"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgb(var(--arc-1)) 0%, rgb(var(--arc-2)) 55%, rgb(var(--arc-3)) 100%)",
          boxShadow: "inset 0 2px 0 rgb(var(--arc-1) / 0.9), 0 -20px 80px rgb(var(--faint) / 0.18)",
        }}
      />
      {/* cursor spotlight */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{ background: spotlight }}
      />
      {/* soft fade so the arc blends into the next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-paper"
      />
      {/* glass shape */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-4 h-[420px] w-[420px] opacity-60 sm:right-0 md:right-10 md:top-6 md:h-[640px] md:w-[640px] md:opacity-100"
      >
        <GlassShape nx={nx} ny={ny} />
      </div>
      <FloatingChips nx={nx} ny={ny} />

      <div className="section-shell relative pb-24 pt-14 md:pb-32 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/75 px-4 py-2 text-[13px] text-body"
        >
          <span className="h-2 w-2 rounded-full bg-accent-deep" />
          {profile.role}
          <span className="text-faint">·</span>
          {profile.tagline}
        </motion.div>

        <h1 className="mt-8 max-w-[820px] text-[48px] font-medium leading-none tracking-[-0.045em] sm:text-[68px] md:text-[84px]">
          {/* Screen readers get one stable headline instead of a changing one. */}
          <span className="sr-only">{taglines[0].line1} {taglines[0].lead}{taglines[0].accent}</span>
          <span aria-hidden="true" className="grid">
            {taglines.map((t) => (
              <GhostTagline key={t.line1} t={t} />
            ))}
            <AnimatePresence mode="wait">
              <motion.span
                key={taglineIndex}
                className="block [grid-area:1/1]"
                initial="enter"
                animate="center"
                exit="exit"
              >
                <MaskedLine index={0} first={first}>
                  {tagline.line1}
                </MaskedLine>
                <MaskedLine index={1} first={first}>
                  {tagline.lead}
                  <Accent first={first}>{tagline.accent}</Accent>
                </MaskedLine>
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease }}
          className="mt-8 max-w-[500px] text-[17px] leading-relaxed text-body md:text-[19px]"
        >
          {profile.intro}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease }}
          className="mt-10 flex flex-wrap items-center gap-7"
        >
          <Magnetic>
            <a href="#projects" className="btn-dark group">
              View My Projects
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
          </Magnetic>
          <a href="#contact" className="group inline-flex items-center gap-2.5 text-[15px] hover:text-muted">
            Get in touch
            <Mail
              size={16}
              className="transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
              aria-hidden="true"
            />
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-12 flex items-center gap-3 text-sm text-muted"
        >
          <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-deep opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-deep" />
          </span>
          Currently Business Intelligence Developer at {profile.employer}
        </motion.p>
      </div>
    </section>
  );
}
