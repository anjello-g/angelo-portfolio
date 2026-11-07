import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  CornerDownLeft,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Hash,
  Moon,
  Search,
  SlidersHorizontal,
  Sun,
} from "lucide-react";
import { navItems, profile, projects, skills, type SkillId } from "../data/content";
import { canOpenCaseStudy } from "../lib/route";
import { useTheme } from "../lib/useTheme";

interface Command {
  id: string;
  group: "Go to" | "Projects" | "Filter projects" | "Actions";
  label: string;
  hint?: string;
  icon: ReactNode;
  run: () => void;
}

interface PaletteProps {
  open: boolean;
  onClose: () => void;
  onSelectSkill: (id: SkillId | null) => void;
}

const groupOrder: Command["group"][] = ["Go to", "Projects", "Filter projects", "Actions"];

/**
 * A ⌘K / Ctrl+K command palette: jump to a section, open a case study, filter projects
 * by skill, grab the resume or copy the email, all without touching the mouse.
 */
export function CommandPalette({ open, onClose, onSelectSkill }: PaletteProps) {
  const reduced = useReducedMotion();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [toast, setToast] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const { theme, toggle: toggleTheme } = useTheme();

  const commands = useMemo<Command[]>(() => {
    const go = (id: string) => () => {
      window.history.replaceState(null, "", `#${id}`);
      document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    };
    const list: Command[] = navItems.map((n) => ({
      id: `nav-${n.id}`,
      group: "Go to",
      label: n.label,
      icon: <Hash size={16} aria-hidden="true" />,
      run: go(n.id),
    }));
    projects.filter(canOpenCaseStudy).forEach((p) =>
      list.push({
        id: `project-${p.id}`,
        group: "Projects",
        label: p.title,
        hint: "Case study",
        icon: <FileText size={16} aria-hidden="true" />,
        run: () => {
          window.location.hash = `#/projects/${p.id}`;
        },
      }),
    );
    skills.forEach((s) =>
      list.push({
        id: `skill-${s.id}`,
        group: "Filter projects",
        label: s.label,
        hint: "Show matching work",
        icon: <SlidersHorizontal size={16} aria-hidden="true" />,
        run: () => {
          onSelectSkill(s.id);
          go("projects")();
        },
      }),
    );
    if (__HAS_RESUME__) {
      list.push({
        id: "resume",
        group: "Actions",
        label: "Download resume",
        hint: "PDF",
        icon: <Download size={16} aria-hidden="true" />,
        run: () => {
          const a = document.createElement("a");
          a.href = profile.resumeUrl;
          a.download = "Angelo_Gaspe_Resume.pdf";
          a.click();
        },
      });
    }
    list.push(
      {
        id: "theme",
        group: "Actions",
        label: theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
        hint: "Theme",
        icon: theme === "dark" ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />,
        run: () => toggleTheme(),
      },
      {
        id: "email",
        group: "Actions",
        label: "Copy email address",
        hint: profile.email,
        icon: <Copy size={16} aria-hidden="true" />,
        run: async () => {
          try {
            await navigator.clipboard.writeText(profile.email);
            setToast("Email copied");
          } catch {
            window.location.href = `mailto:${profile.email}`;
          }
        },
      },
      {
        id: "linkedin",
        group: "Actions",
        label: "Open LinkedIn",
        icon: <ExternalLink size={16} aria-hidden="true" />,
        run: () => window.open(profile.linkedin, "_blank", "noopener,noreferrer"),
      },
      {
        id: "github",
        group: "Actions",
        label: "Open GitHub",
        icon: <ExternalLink size={16} aria-hidden="true" />,
        run: () => window.open(profile.github, "_blank", "noopener,noreferrer"),
      },
    );
    return list;
  }, [onSelectSkill, reduced, theme, toggleTheme]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? commands.filter((c) => `${c.group} ${c.label} ${c.hint ?? ""}`.toLowerCase().includes(q))
      : commands;
    return groupOrder.flatMap((g) => filtered.filter((c) => c.group === g));
  }, [commands, query]);

  useEffect(() => setIndex(0), [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [index, results]);

  const choose = (c: Command | undefined) => {
    if (!c) return;
    onClose();
    // Let the palette start closing before the page moves.
    window.setTimeout(() => void c.run(), 60);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[index]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "Tab") {
      e.preventDefault(); // keep focus inside the dialog
    }
  };

  let lastGroup = "";

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[14vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <button
              type="button"
              aria-label="Close command palette"
              tabIndex={-1}
              onClick={onClose}
              className="absolute inset-0 cursor-default bg-ink/30 backdrop-blur-sm"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              onKeyDown={onKeyDown}
              className="relative w-full max-w-[580px] overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_40px_80px_-30px_rgb(var(--shadow)/0.45)]"
              initial={reduced ? false : { opacity: 0, y: -14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
            >
              <div className="flex items-center gap-3 border-b border-line px-5">
                <Search size={18} className="flex-none text-muted" aria-hidden="true" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="palette-list"
                  aria-activedescendant={results[index] ? `cmd-${results[index].id}` : undefined}
                  aria-label="Search sections, projects and actions"
                  placeholder="Jump to a section, project or skill…"
                  className="h-14 w-full bg-transparent text-[15px] outline-none placeholder:text-faint"
                />
                <kbd className="hidden flex-none rounded-md border border-line px-1.5 py-0.5 text-[11px] text-muted sm:block">
                  Esc
                </kbd>
              </div>

              <ul
                id="palette-list"
                ref={listRef}
                role="listbox"
                className="max-h-[min(52vh,380px)] overflow-y-auto p-2"
              >
                {results.length === 0 && (
                  <li className="px-4 py-10 text-center text-sm text-muted">Nothing matches “{query}”.</li>
                )}
                {results.map((c, i) => {
                  const showGroup = c.group !== lastGroup;
                  lastGroup = c.group;
                  const active = i === index;
                  return (
                    <li key={c.id} role="presentation">
                      {showGroup && (
                        <p className="px-3 pb-1 pt-3 text-xs font-medium text-muted">{c.group}</p>
                      )}
                      <div
                        id={`cmd-${c.id}`}
                        role="option"
                        aria-selected={active}
                        data-active={active}
                        onMouseMove={() => setIndex(i)}
                        onClick={() => choose(c)}
                        className="relative flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[15px]"
                      >
                        {active && (
                          <motion.span
                            layoutId="palette-active"
                            className="absolute inset-0 rounded-xl bg-mist"
                            transition={{ type: "spring", stiffness: 500, damping: 40 }}
                          />
                        )}
                        <span
                          className={`relative grid h-7 w-7 flex-none place-items-center rounded-lg transition-colors ${
                            active ? "bg-accent text-onaccent" : "bg-mist"
                          }`}
                        >
                          {c.icon}
                        </span>
                        <span className="relative flex-1 truncate">{c.label}</span>
                        {c.hint && <span className="relative hidden truncate text-xs text-muted sm:block">{c.hint}</span>}
                        {active && (
                          <CornerDownLeft size={14} className="relative flex-none text-muted" aria-hidden="true" />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-center gap-4 border-t border-line px-5 py-2.5 text-xs text-muted">
                <span>↑↓ to move</span>
                <span>Enter to select</span>
                <span className="ml-auto hidden sm:block">Ctrl/⌘ K to toggle</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center">
        <AnimatePresence>
          {toast && (
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-onink shadow-cta"
            >
              {toast}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
