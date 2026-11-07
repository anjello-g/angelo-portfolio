import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { ChevronDown, X } from "lucide-react";
import { roles, skills, type SkillId } from "../data/content";
import { projectsForSkill, roleUsesSkill, skillIdForTool, skillsForRole } from "../lib/skillMap";
import { Reveal } from "./Reveal";

const ease = [0.22, 1, 0.36, 1] as const;

interface ExperienceProps {
  selected: SkillId | null;
  onSelect: (id: SkillId | null) => void;
}

export function Experience({ selected, onSelect }: ExperienceProps) {
  const [openId, setOpenId] = useState<string | null>(roles[0].id);
  const selectedLabel = skills.find((s) => s.id === selected)?.label;
  const matchCount = selected ? roles.filter((r) => roleUsesSkill(r, selected)).length : 0;
  const focusing = selected !== null && matchCount > 0;

  // Picking a tool elsewhere opens the first role that used it, so the highlight is visible.
  useEffect(() => {
    if (!selected) return;
    const first = roles.find((r) => roleUsesSkill(r, selected));
    if (first) setOpenId((cur) => (cur && roleUsesSkill(roles.find((r) => r.id === cur)!, selected) ? cur : first.id));
  }, [selected]);

  const listRef = useRef<HTMLOListElement>(null);
  // The timeline line fills in as the visitor scrolls down through it.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.65", "end 0.55"] });
  const fill = useSpring(scrollYProgress, { stiffness: 110, damping: 28 });

  return (
    <section id="experience" className="section-shell py-16 md:py-20">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_2.2fr] lg:gap-16">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">
            Experience <span className="h-px w-[60px] bg-line2" aria-hidden="true" />
          </p>
          <h2 className="mt-7 text-[34px] font-medium leading-[1.1] tracking-[-0.035em] md:text-[46px]">
            From code to <span className="italic-serif">clarity.</span>
          </h2>
          <p className="mt-6 max-w-[340px] text-base leading-relaxed text-body">
            Web and software development, healthcare operations, and now workforce analytics and business
            intelligence. Select a role to see what I did.
          </p>

          <div className="mt-8 min-h-[72px] max-w-[340px] text-sm" aria-live="polite">
            {selected && selectedLabel ? (
              <>
                <button
                  type="button"
                  onClick={() => onSelect(null)}
                  className="inline-flex items-center gap-2 rounded-full border border-ink bg-accent text-onaccent px-4 py-2 font-medium"
                >
                  Highlighting {selectedLabel}
                  <X size={14} aria-hidden="true" />
                  <span className="sr-only">Clear highlight</span>
                </button>
                <p className="mt-3 leading-relaxed text-muted">
                  {matchCount > 0 ? (
                    <>
                      Used in {matchCount} of {roles.length} roles and {projectsForSkill(selected).length} featured{" "}
                      {projectsForSkill(selected).length === 1 ? "project" : "projects"}.{" "}
                      <a href="#projects" className="font-medium text-ink underline underline-offset-4">
                        See the projects
                      </a>
                    </>
                  ) : (
                    <>No role lists {selectedLabel} directly. It's in the toolkit under Skills.</>
                  )}
                </p>
              </>
            ) : (
              <p className="leading-relaxed text-muted">
                Tip: select a tool inside a role and the whole site lights up where I used it.
              </p>
            )}
          </div>
        </Reveal>

        <ol ref={listRef} className="relative">
          <span aria-hidden="true" className="absolute bottom-3 left-[11px] top-3 w-px bg-line" />
          <motion.span
            aria-hidden="true"
            className="absolute bottom-3 left-[11px] top-3 w-px origin-top bg-ink"
            style={{ scaleY: fill }}
          />

          {roles.map((role) => {
            const open = openId === role.id;
            const uses = selected ? roleUsesSkill(role, selected) : false;
            const used = skillsForRole(role);
            return (
              <li
                key={role.id}
                className={`relative pb-5 pl-12 transition-opacity duration-300 ${focusing && !uses ? "opacity-40" : ""}`}
              >
                <motion.span
                  aria-hidden="true"
                  className="absolute left-0 top-6 grid h-6 w-6 place-items-center rounded-full border border-ink bg-surface"
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1.1 }}
                  viewport={{ margin: "-40% 0px -40% 0px" }}
                  transition={{ duration: 0.3 }}
                >
                  <span className={`h-2 w-2 rounded-full ${role.current ? "bg-accent-deep" : "bg-ink"}`} />
                </motion.span>

                <div
                  className={`glass-card transition-colors duration-300 ${
                    focusing && uses ? "border-ink ring-1 ring-accent" : open ? "border-ink/30" : ""
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`role-${role.id}`}
                    onClick={() => setOpenId(open ? null : role.id)}
                    className="flex w-full items-start justify-between gap-4 rounded-2xl p-5 text-left md:p-6"
                  >
                    <span className="min-w-0">
                      <span className="block text-lg font-medium tracking-[-0.02em]">{role.title}</span>
                      <span className="mt-1 block text-sm text-muted">
                        {role.org} · {role.location}
                      </span>
                      <span className="mt-1 block text-sm text-muted sm:hidden">{role.period}</span>
                      <span className="mt-3 flex flex-wrap items-center gap-1" aria-hidden="true">
                        {skills.map((sk) => {
                          const on = used.includes(sk.id);
                          const sel = selected === sk.id;
                          return (
                            <span
                              key={sk.id}
                              title={`${sk.label}${on ? "" : " (not used)"}`}
                              className={`h-1.5 w-3 rounded-full transition-colors sm:w-5 duration-300 ${
                                sel && on ? "bg-accent-deep" : on ? "bg-ink/80" : "bg-line"
                              }`}
                            />
                          );
                        })}
                      </span>
                    </span>
                    <span className="flex flex-none items-center gap-3">
                      {role.current && (
                        <span className="rounded-full bg-accent text-onaccent px-2.5 py-1 text-[11px] font-medium">Current</span>
                      )}
                      <span className="hidden text-sm text-muted sm:block">{role.period}</span>
                      <ChevronDown
                        size={18}
                        aria-hidden="true"
                        className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                      />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={`role-${role.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-6 md:px-6">
                          <ul className="space-y-3 text-[15px] leading-relaxed text-body">
                            {role.bullets.map((b) => (
                              <li key={b} className="flex gap-3">
                                <span className="mt-2.5 h-1 w-1 flex-none rounded-full bg-ink" aria-hidden="true" />
                                {b}
                              </li>
                            ))}
                          </ul>
                          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tools used">
                            {role.tools.map((t) => {
                              const sid = skillIdForTool(t);
                              if (!sid) {
                                return (
                                  <li key={t} className="rounded-full border border-line bg-surface px-3 py-1 text-xs">
                                    {t}
                                  </li>
                                );
                              }
                              const on = selected === sid;
                              return (
                                <li key={t}>
                                  <button
                                    type="button"
                                    aria-pressed={on}
                                    data-cursor={on ? "Clear" : "Highlight"}
                                    onClick={() => onSelect(on ? null : sid)}
                                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                                      on ? "border-ink bg-accent text-onaccent font-medium" : "border-line bg-surface hover:border-ink"
                                    }`}
                                  >
                                    {t}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
