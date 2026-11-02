import type { MouseEvent, ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { ArrowRight, Mail } from "lucide-react";
import { profile } from "../data/content";
import { GlassShape } from "./GlassShape";
import { FloatingChips } from "./FloatingChips";
import { Magnetic } from "./Magnetic";

const ease = [0.22, 1, 0.36, 1] as const;

/** One headline line, revealed upward from behind a mask. */
function MaskedLine({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <span className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
      <motion.span
        className="block"
        initial={{ y: "105%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const reduced = useReducedMotion();
  // Cursor position in px (for the spotlight) and normalised -0.5…0.5 (for parallax).
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(460px circle at ${mx}px ${my}px, rgba(197,232,108,0.32), rgba(197,232,108,0) 65%)`;

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
    <section id="home" className="relative overflow-hidden" onMouseMove={onMove} onMouseLeave={onLeave}>
      {/* soft arc */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-64 top-36 hidden h-[1100px] w-[1100px] rounded-full md:block"
        style={{
          background: "radial-gradient(circle at 30% 30%, #FFFFFF 0%, #EDEDF1 55%, #E4E4EA 100%)",
          boxShadow: "inset 0 2px 0 rgba(255,255,255,0.9), 0 -20px 80px rgba(160,160,180,0.18)",
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
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white"
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
          className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white/75 px-4 py-2 text-[13px] text-body"
        >
          <span className="h-2 w-2 rounded-full bg-lime-deep" />
          {profile.role}
          <span className="text-[#9A9AA4]">·</span>
          {profile.tagline}
        </motion.div>

        <h1 className="mt-8 max-w-[820px] text-[48px] font-medium leading-none tracking-[-0.045em] sm:text-[68px] md:text-[84px]">
          <MaskedLine delay={0.1}>Turning Data</MaskedLine>
          <MaskedLine delay={0.2}>
            into Better{" "}
            <span className="italic-serif relative inline-block tracking-[-0.02em]">
              Decisions.
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
                  stroke="#A6E22E"
                  strokeWidth="5"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: 1.0, ease }}
                />
              </svg>
            </span>
          </MaskedLine>
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
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-deep opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime-deep" />
          </span>
          Currently Business Intelligence Developer at {profile.employer}
        </motion.p>
      </div>
    </section>
  );
}
