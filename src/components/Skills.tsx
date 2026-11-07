import { useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { skillGroups, skills, type SkillId } from "../data/content";
import { projectsForSkill, rolesForSkill } from "../lib/skillMap";
import { SkillIcon } from "./SkillIcon";
import { Reveal } from "./Reveal";

const ease = [0.22, 1, 0.36, 1] as const;

/** Tabbed list of the full toolkit, grouped the way the resume groups it. */
function Toolkit() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const group = skillGroups[active];

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + skillGroups.length) % skillGroups.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <Reveal className="mt-14">
      <div role="tablist" aria-label="Full toolkit" className="flex flex-wrap gap-2">
        {skillGroups.map((g, i) => {
          const selected = active === i;
          return (
            <button
              key={g.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${g.id}`}
              aria-selected={selected}
              aria-controls={`panel-${g.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className="relative rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-white/50 hover:text-white"
            >
              {selected && (
                <motion.span
                  layoutId="toolkit-pill"
                  className="absolute inset-0 rounded-full border border-accent bg-accent text-onaccent"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className={`relative ${selected ? "text-onaccent" : ""}`}>{g.short}</span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`panel-${group.id}`} aria-labelledby={`tab-${group.id}`} className="min-h-[120px]">
        <AnimatePresence mode="wait">
          <motion.ul
            key={group.id}
            className="mt-6 flex flex-wrap gap-2.5"
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            variants={{ show: { transition: { staggerChildren: 0.035 } } }}
          >
            {group.items.map((item) => (
              <motion.li
                key={item}
                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.3, ease }}
                className="rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-sm text-white/85 transition-colors hover:border-accent hover:text-white"
              >
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

interface SkillsProps {
  selected: SkillId | null;
  onSelect: (id: SkillId | null) => void;
}

export function Skills({ selected, onSelect }: SkillsProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // The dark band starts as an inset rounded card and opens out to full width as it scrolls into view.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.25"] });
  const inset = useTransform(scrollYProgress, [0, 1], [32, 0]);
  const radius = useTransform(scrollYProgress, [0, 1], [48, 0]);

  // Soft accent spotlight that follows the cursor.
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgb(var(--accent) / 0.16), rgb(var(--accent) / 0) 65%)`;
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  const label = skills.find((sk) => sk.id === selected)?.label;
  const roleCount = selected ? rolesForSkill(selected).length : 0;
  const projectCount = selected ? projectsForSkill(selected).length : 0;

  return (
    <motion.section
      ref={ref}
      id="skills"
      className="dark-surface relative my-10 overflow-hidden bg-band text-white"
      style={reduced ? undefined : { marginLeft: inset, marginRight: inset, borderRadius: radius }}
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(-1000);
        my.set(-1000);
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, rgb(var(--accent)), rgb(var(--accent) / 0) 70%)" }}
      />
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: spotlight }} />

      <div className="section-shell relative py-16 md:py-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_3fr] lg:gap-12">
          <Reveal>
            <p className="eyebrow">
              Skills <span className="h-px w-[60px] bg-white/30" aria-hidden="true" />
            </p>
            <h2 className="mt-7 text-[30px] font-medium leading-[1.15] tracking-[-0.03em] md:text-4xl">
              Tools &amp; Technologies <span className="italic-serif !text-accent whitespace-nowrap">I Work With.</span>
            </h2>
            <p className="mt-4 min-h-[60px] text-sm leading-relaxed text-white/60" aria-live="polite">
              {selected && label ? (
                <>
                  {label}: {roleCount} {roleCount === 1 ? "role" : "roles"} and {projectCount} featured{" "}
                  {projectCount === 1 ? "project" : "projects"}.{" "}
                  <a href="#experience" className="font-medium text-white underline underline-offset-4">
                    Roles
                  </a>
                  {" · "}
                  <a href="#projects" className="font-medium text-white underline underline-offset-4">
                    Projects
                  </a>
                </>
              ) : (
                <>Select a tool to light up where I've used it, in Experience and Projects.</>
              )}
            </p>
          </Reveal>

          <ul className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 xl:grid-cols-8">
            {skills.map((skill, i) => {
              const isOn = selected === skill.id;
              return (
                <motion.li
                  key={skill.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: i * 0.06, ease }}
                >
                  <button
                    type="button"
                    aria-pressed={isOn}
                    data-cursor={isOn ? "Clear" : "Highlight"}
                    onClick={() => onSelect(isOn ? null : skill.id)}
                    className={`group flex h-28 w-full flex-col items-center justify-center gap-3 rounded-[14px] border px-1 transition-all duration-300 hover:-translate-y-1 ${
                      isOn
                        ? "border-accent bg-white/10 ring-2 ring-accent/40"
                        : "border-white/10 bg-white/[0.05] hover:border-white/30 hover:bg-white/[0.09]"
                    }`}
                  >
                    <span className="transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-125 motion-reduce:transform-none">
                      <SkillIcon id={skill.id} />
                    </span>
                    <span className="text-center text-xs leading-tight text-white/80">{skill.label}</span>
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </div>

        <Toolkit />
      </div>
    </motion.section>
  );
}
