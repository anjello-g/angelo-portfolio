import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp } from "lucide-react";

export function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <footer className="section-shell pb-10 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E0E0E6] pt-7 text-[13px] text-muted">
        <span>© {new Date().getFullYear()} Angelo Gaspe. All rights reserved.</span>
        <span>Built with care using modern web technologies.</span>
      </div>

      <AnimatePresence>
        {showTop && (
          <motion.a
            href="#home"
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-40 grid h-11 w-11 place-items-center rounded-full border border-[#D4D4DB] bg-white shadow-tile transition-colors hover:bg-ink hover:text-white"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
          >
            <ArrowUp size={16} aria-hidden="true" />
          </motion.a>
        )}
      </AnimatePresence>
    </footer>
  );
}
