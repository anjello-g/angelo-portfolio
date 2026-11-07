import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

interface GlassShapeProps {
  /** Cursor position over the hero, normalised to -0.5 … 0.5. */
  nx: MotionValue<number>;
  ny: MotionValue<number>;
}

/** Decorative frosted-glass composition. Tilts with the cursor and drifts on scroll. */
export function GlassShape({ nx, ny }: GlassShapeProps) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const spring = { stiffness: 120, damping: 18, mass: 0.6 };

  const rotateY = useSpring(useTransform(nx, [-0.5, 0.5], [-14, 14]), spring);
  const rotateX = useSpring(useTransform(ny, [-0.5, 0.5], [10, -10]), spring);
  const shiftX = useSpring(useTransform(nx, [-0.5, 0.5], [-16, 16]), spring);
  const driftY = useTransform(scrollY, [0, 700], [0, reduced ? 0 : -110]);
  const driftRotate = useTransform(scrollY, [0, 700], [0, reduced ? 0 : 8]);

  return (
    <motion.div
      className="h-full w-full"
      style={{ rotateX, rotateY, x: shiftX, y: driftY, rotate: driftRotate, transformPerspective: 1000 }}
    >
      <motion.svg
        viewBox="0 -70 640 720"
        aria-hidden="true"
        focusable="false"
        className="h-full w-full overflow-visible"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <defs>
          <linearGradient id="gs-g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: "rgb(var(--glass-1))" }} />
            <stop offset="0.45" style={{ stopColor: "rgb(var(--glass-2))" }} />
            <stop offset="1" style={{ stopColor: "rgb(var(--glass-3))" }} />
          </linearGradient>
          <linearGradient id="gs-g2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: "rgb(var(--glass-1))" }} stopOpacity="0.95" />
            <stop offset="0.5" style={{ stopColor: "rgb(var(--arc-2))" }} stopOpacity="0.85" />
            <stop offset="1" style={{ stopColor: "rgb(var(--glass-2))" }} stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="gs-edge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" style={{ stopColor: "rgb(var(--glass-1))" }} stopOpacity="0" />
            <stop offset="0.5" style={{ stopColor: "rgb(var(--glass-1))" }} stopOpacity="0.95" />
            <stop offset="1" style={{ stopColor: "rgb(var(--glass-1))" }} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="gs-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" style={{ stopColor: "rgb(var(--accent))" }} stopOpacity="0.9" />
            <stop offset="1" style={{ stopColor: "rgb(var(--accent))" }} stopOpacity="0" />
          </radialGradient>
          <filter id="gs-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>

        <ellipse cx="330" cy="545" rx="210" ry="34" fill="url(#gs-glow)" filter="url(#gs-soft)" />

        <g transform="translate(300 300) rotate(-8)">
          <rect x="-35" y="-285" width="330" height="360" rx="40" style={{ fill: "rgb(var(--faint))" }} opacity="0.35" transform="translate(18 26)" filter="url(#gs-soft)" />
          <rect x="-35" y="-285" width="330" height="360" rx="40" fill="url(#gs-g1)" />
          <rect x="-35" y="-285" width="330" height="360" rx="40" fill="none" style={{ stroke: "rgb(var(--glass-1))" }} strokeWidth="2" opacity="0.8" />
          <path d="M-35 -60 L295 -170" stroke="url(#gs-edge)" strokeWidth="3" />
        </g>

        <g transform="translate(300 330) rotate(-8)">
          <rect x="-160" y="-110" width="440" height="330" rx="40" fill="url(#gs-g2)" />
          <rect x="-160" y="-110" width="440" height="330" rx="40" fill="none" style={{ stroke: "rgb(var(--glass-1))" }} strokeWidth="2" opacity="0.9" />
          <path d="M-160 40 L280 -20" stroke="url(#gs-edge)" strokeWidth="2.5" />
          <path d="M-120 205 L240 205" style={{ stroke: "rgb(var(--accent))" }} strokeWidth="5" strokeLinecap="round" opacity="0.9" filter="url(#gs-soft)" />
        </g>

        <g style={{ stroke: "rgb(var(--ink))" }} strokeWidth="1.2" strokeLinecap="round" opacity="0.7">
          <path d="M120 120 V170 M95 145 H145" />
        </g>
      </motion.svg>
    </motion.div>
  );
}
