import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../lib/useTheme";

/** Light/dark switch. The page blooms outward from this button; the icon spins over. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      data-cursor={dark ? "Light" : "Dark"}
      className={`grid h-10 w-10 flex-none place-items-center overflow-hidden rounded-full border border-line bg-surface text-ink transition-colors hover:border-ink active:scale-95 sm:h-11 sm:w-11 ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          className="grid place-items-center"
          initial={{ rotate: -120, scale: 0.3, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 120, scale: 0.3, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
