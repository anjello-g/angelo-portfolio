import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Download } from "lucide-react";
import { profile } from "../data/content";

/**
 * Downloads the resume PDF. On click the icon morphs into a check mark and the
 * button turns lime for a moment, so the visitor knows it worked.
 */
export function DownloadResume({ block = false }: { block?: boolean }) {
  const [done, setDone] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (!__HAS_RESUME__) return null;

  return (
    <a
      href={profile.resumeUrl}
      download="Angelo_Gaspe_Resume.pdf"
      onClick={() => {
        setDone(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setDone(false), 2400);
      }}
      className={`group flex items-center gap-2.5 rounded-full border border-ink px-5 py-2.5 text-sm font-medium transition-colors duration-300 ${
        done ? "bg-lime text-ink" : "bg-white/50 hover:bg-ink hover:text-white"
      } ${block ? "justify-center py-3.5" : ""}`}
    >
      Download Resume
      <span className="relative grid h-4 w-4 place-items-center" aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.span
              key="check"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Check size={16} />
            </motion.span>
          ) : (
            <motion.span
              key="download"
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="transition-transform duration-300 group-hover:translate-y-0.5"
            >
              <Download size={16} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span role="status" className="sr-only">
        {done ? "Resume download started" : ""}
      </span>
    </a>
  );
}
