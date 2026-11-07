import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { useCoarsePointer } from "../lib/useCoarsePointer";

/**
 * 3D tilt toward the cursor, with a soft light glare that follows the pointer.
 * On touch screens (no cursor) the same tilt and glare are driven by the card's scroll position instead.
 */
export function Tilt({ children, className = "", max = 9 }: { children: ReactNode; className?: string; max?: number }) {
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glareOpacity = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 22 });
  const sry = useSpring(ry, { stiffness: 220, damping: 22 });
  const glare = useMotionTemplate`radial-gradient(280px circle at ${gx}% ${gy}%, rgba(255,255,255,0.4), transparent 60%)`;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!coarse || reduced) return;
    rx.set((0.5 - p) * max * 1.2);
    ry.set((p - 0.5) * max * 0.5);
    gx.set(15 + p * 70);
    gy.set(25 + p * 30);
    glareOpacity.set(0.7);
  });

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      onMouseMove={(e) => {
        if (reduced) return;
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * max * 2);
        rx.set((0.5 - py) * max * 2);
        gx.set(px * 100);
        gy.set(py * 100);
        glareOpacity.set(1);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
        glareOpacity.set(0);
      }}
    >
      {children}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{ background: glare, opacity: glareOpacity }}
      />
    </motion.div>
  );
}
