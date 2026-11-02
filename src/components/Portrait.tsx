import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { profile } from "../data/content";
import { FloatingChips } from "./FloatingChips";

interface PortraitProps {
  /** Cursor position over the hero, normalised to -0.5 … 0.5. */
  nx: MotionValue<number>;
  ny: MotionValue<number>;
}

/**
 * The hero portrait: a cut-out photo standing on white, with a soft halo behind it.
 * The photo leans toward the cursor and the halo drifts the other way, so the two
 * layers separate a little like a stage set.
 */
export function Portrait({ nx, ny }: PortraitProps) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const spring = { stiffness: 120, damping: 20, mass: 0.6 };

  const rotateY = useSpring(useTransform(nx, [-0.5, 0.5], [-5, 5]), spring);
  const rotateX = useSpring(useTransform(ny, [-0.5, 0.5], [3, -3]), spring);
  const photoX = useSpring(useTransform(nx, [-0.5, 0.5], [-10, 10]), spring);
  const haloX = useSpring(useTransform(nx, [-0.5, 0.5], [22, -22]), spring);
  const haloY = useSpring(useTransform(ny, [-0.5, 0.5], [14, -14]), spring);
  const lift = useTransform(scrollY, [0, 600], [0, reduced ? 0 : -50]);

  return (
    <motion.div className="relative mx-auto w-full max-w-[460px] lg:ml-auto lg:mr-0 lg:max-w-[500px]" style={{ y: lift }}>
      {/* halo */}
      <motion.div aria-hidden="true" className="absolute inset-0" style={{ x: haloX, y: haloY }}>
        <div
          className="absolute left-1/2 top-[14%] aspect-square w-[88%] -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(circle at 35% 30%, #FFFFFF 0%, #F1F3F5 55%, #E6E9EC 100%)" }}
        />
        <div
          className="absolute left-1/2 top-[14%] aspect-square w-[88%] -translate-x-1/2 rounded-full border border-line"
        />
        <div
          className="absolute -bottom-3 left-1/2 h-8 w-[56%] -translate-x-1/2 rounded-full bg-lime/50 blur-2xl"
        />
      </motion.div>

      {/* photo */}
      <motion.div
        className="relative"
        style={{ rotateX, rotateY, x: photoX, transformPerspective: 1100 }}
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src="/angelo.webp"
          width={570}
          height={816}
          alt={`Portrait of ${profile.name}`}
          fetchPriority="high"
          className="relative block h-auto w-full select-none"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, #000 80%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, #000 80%, transparent 100%)",
          }}
          draggable={false}
        />
      </motion.div>

      <FloatingChips nx={nx} ny={ny} />
    </motion.div>
  );
}
