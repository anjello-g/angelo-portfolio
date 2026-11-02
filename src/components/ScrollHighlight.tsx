import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

function Word({
  word,
  range,
  progress,
  reduced,
}: {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const opacity = useTransform(progress, range, [0.25, 1]);
  return (
    <motion.span style={{ opacity: reduced ? 1 : opacity }} className="mr-[0.28em] inline-block">
      {word}
    </motion.span>
  );
}

/** A paragraph whose words light up one by one as it scrolls through the viewport. */
export function ScrollHighlight({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.55"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={`text-ink ${className}`}>
      {words.map((w, i) => (
        <Word
          key={`${w}-${i}`}
          word={w}
          progress={scrollYProgress}
          reduced={reduced}
          range={[i / words.length, (i + 1) / words.length]}
        />
      ))}
    </p>
  );
}
