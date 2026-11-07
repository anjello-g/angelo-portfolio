import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * A small bubble that follows the mouse and names what a click will do ("View", "Copy", "Explore").
 * Any element can opt in with a `data-cursor="Label"` attribute. Mouse and fine pointers only;
 * it never appears on touch screens or with reduced motion.
 */
export function CursorLabel() {
  const [enabled, setEnabled] = useState(false);
  const [text, setText] = useState("");
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 520, damping: 42, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 520, damping: 42, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;
    setEnabled(true);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX + 16);
      y.set(e.clientY + 16);
      const label = (e.target as Element | null)?.closest?.("[data-cursor]")?.getAttribute("data-cursor");
      if (label) setText(label);
      setVisible(Boolean(label));
    };
    const onLeave = () => setVisible(false);

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[60]" style={{ x: sx, y: sy }}>
      <motion.span
        className="block origin-top-left whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-white shadow-cta"
        initial={false}
        animate={{ scale: visible ? 1 : 0.4, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
}
