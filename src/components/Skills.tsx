import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { skillGroups, skills, type SkillId } from "../data/content";
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
              className="relative rounded-full border border-line bg-white/80 px-5 py-2.5 text-sm font-medium transition-colors hover:border-ink"
            >
              {selected && (
                <motion.span
                  layoutId="toolkit-pill"
                  className="absolute inset-0 rounded-full border border-ink bg-lime"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">{g.short}</span>
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
                className="rounded-full border border-line bg-white px-4 py-2 text-sm transition-colors hover:border-ink"
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
  return (
    <section id="skills" className="section-shell py-14">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_3fr] lg:gap-12">
        <Reveal>
          <p className="eyebrow">
            Skills <span className="h-px w-[60px] bg-[#C9C9D1]" aria-hidden="true" />
          </p>
          <h2 className="mt-7 text-[30px] font-medium leading-[1.15] tracking-[-0.03em] md:text-4xl">
            Tools &amp; Technologies <span className="italic-serif whitespace-nowrap">I Work With.</span>
          </h2>
          <p className="mt-4 text-sm text-muted">Select a tool to see the featured projects that use it.</p>
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
                  onClick={() => onSelect(isOn ? null : skill.id)}
                  className={`group flex h-28 w-full flex-col items-center justify-center gap-3 rounded-[14px] border bg-white/85 px-1 shadow-tile transition-all duration-300 hover:-translate-y-1 hover:shadow-card ${
                    isOn ? "border-ink ring-2 ring-lime" : "border-line hover:border-[#C9C9D1]"
                  }`}
                >
                  <span className="transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-125 motion-reduce:transform-none">
                    <SkillIcon id={skill.id} />
                  </span>
                  <span className="text-center text-xs leading-tight text-body">{skill.label}</span>
                </button>
              </motion.li>
            );
          })}
        </ul>
      </div>

      <Toolkit />
    </section>
  );
}
