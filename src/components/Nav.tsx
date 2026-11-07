import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, Search, X } from "lucide-react";
import { navItems } from "../data/content";
import { DownloadResume } from "./DownloadResume";
import { Magnetic } from "./Magnetic";
import { ThemeToggle } from "./ThemeToggle";

export function Nav({ active, onOpenPalette }: { active: string; onOpenPalette: () => void }) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Slide away while reading downward, return on any upward scroll.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 12);
    if (y < 120) setHidden(false);
    else if (y > prev + 2) setHidden(true);
    else if (y < prev - 2) setHidden(false);
  });

  return (
    <motion.header
      className={`sticky top-0 z-40 border-b bg-paper/80 backdrop-blur-md transition-colors duration-300 ${
        scrolled ? "border-line" : "border-transparent"
      }`}
      animate={{ y: hidden && !open ? "-100%" : 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onFocusCapture={() => setHidden(false)}
    >
      <div className="section-shell flex items-center justify-between py-5">
        <a href="#home" className="flex min-w-0 items-center gap-3 sm:gap-4" aria-label="Angelo Gaspe — home">
          <span className="text-[30px] font-normal leading-none tracking-[-0.04em]">AG</span>
          <span className="hidden h-7 w-px bg-line2 min-[380px]:block" aria-hidden="true" />
          <span className="hidden text-[15px] font-medium min-[380px]:inline">Angelo Gaspe</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-9 text-sm lg:flex">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`relative pb-2.5 transition-colors ${
                  isActive ? "font-medium text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-ink"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label="Open command palette"
            className="group flex items-center gap-2.5 rounded-full border border-line bg-surface px-3.5 py-2.5 text-sm text-muted transition-colors hover:border-ink hover:text-ink"
          >
            <Search size={15} aria-hidden="true" />
            Quick jump
            <kbd className="rounded-md border border-line px-1.5 text-[11px] leading-5 text-muted">⌘K</kbd>
          </button>
          <ThemeToggle />
          <Magnetic strength={0.22}>
            <DownloadResume />
          </Magnetic>
        </div>

        <button
          type="button"
          className="ml-auto mr-2 grid h-10 w-10 flex-none place-items-center rounded-full border border-line bg-surface sm:h-11 sm:w-11 lg:hidden"
          aria-label="Open command palette"
          onClick={onOpenPalette}
        >
          <Search size={18} />
        </button>

        <ThemeToggle className="mr-2 lg:hidden" />

        <button
          type="button"
          className="grid h-10 w-10 flex-none place-items-center rounded-full border border-line bg-surface/70 sm:h-11 sm:w-11 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="section-shell flex flex-col gap-1 pb-5 lg:hidden"
        >
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              className={`rounded-xl px-4 py-3 text-base ${
                active === item.id ? "bg-surface font-medium" : "text-muted"
              }`}
            >
              {item.label}
            </a>
          ))}
          <div className="mt-3">
            <DownloadResume block />
          </div>
        </nav>
      )}
    </motion.header>
  );
}
