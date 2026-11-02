import { useRef } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { ArrowRight, X } from "lucide-react";
import { projects, skills, type Project, type SkillId } from "../data/content";
import { canOpenCaseStudy } from "../lib/route";
import { ProjectPreview } from "./ProjectPreview";
import { Reveal } from "./Reveal";
import { Tilt } from "./Tilt";

function ProjectCard({ project }: { project: Project }) {
  const canOpen = canOpenCaseStudy(project);
  const showDraft = import.meta.env.DEV && !project.caseStudy.ready;

  const inner = (
    <>
      <div className="relative h-[250px] overflow-hidden rounded-xl border border-line/70">
        <div className="h-full transition-transform duration-500 ease-out group-hover:scale-[1.03]">
          {project.caseStudy.image ? (
            <img
              src={project.caseStudy.image}
              alt={project.caseStudy.imageAlt ?? project.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <ProjectPreview kind={project.preview} />
          )}
        </div>
        {showDraft && (
          <span className="absolute left-3 top-3 rounded-full bg-lime px-2.5 py-1 text-[11px] font-medium text-ink">
            Draft (dev only)
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-4 px-1.5 pb-1.5">
        <div>
          <h3 className="text-base font-medium">{project.title}</h3>
          <p className="mt-2 text-[13px] leading-normal text-muted">{project.description}</p>
        </div>
        <span
          className={`grid h-9 w-9 flex-none place-items-center rounded-full border border-[#D4D4DB] transition-colors duration-300 ${
            canOpen ? "group-hover:border-ink group-hover:bg-ink group-hover:text-white" : "opacity-60"
          }`}
          aria-hidden="true"
        >
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </>
  );

  const cardClass =
    "group glass-card flex h-full flex-col gap-5 p-4 transition-colors duration-300 hover:border-[#C9C9D1]";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Tilt className="h-full">
        {canOpen ? (
          <a href={`#/projects/${project.id}`} className={cardClass} aria-label={`${project.title} — read the case study`}>
            {inner}
          </a>
        ) : (
          <div className={cardClass}>{inner}</div>
        )}
      </Tilt>
    </motion.article>
  );
}

interface ProjectsProps {
  selected: SkillId | null;
  onClear: () => void;
}

export function Projects({ selected, onClear }: ProjectsProps) {
  const visible = selected ? projects.filter((p) => p.tags.includes(selected)) : projects;
  const selectedLabel = skills.find((s) => s.id === selected)?.label;
  const gridRef = useRef<HTMLDivElement>(null);
  // Same idea as the Experience timeline: a line fills as the visitor moves through the grid.
  const { scrollYProgress } = useScroll({ target: gridRef, offset: ["start 0.7", "end 0.6"] });
  const fill = useSpring(scrollYProgress, { stiffness: 110, damping: 28 });

  return (
    <section id="projects" className="section-shell py-14">
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_3fr] lg:gap-12">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">
            Featured projects <span className="h-px w-10 bg-[#C9C9D1]" aria-hidden="true" />
          </p>
          <h2 className="mt-7 text-[30px] font-medium leading-[1.15] tracking-[-0.03em] md:text-[40px]">
            Building solutions{" "}
            <span className="font-serif font-normal italic">across data, automation, and intelligence.</span>
          </h2>

          <div className="mt-8 min-h-[44px]" aria-live="polite">
            {selectedLabel ? (
              <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center gap-2 rounded-full border border-ink bg-lime px-4 py-2 text-sm font-medium"
              >
                Filtered by {selectedLabel}
                <X size={14} aria-hidden="true" />
                <span className="sr-only">Clear filter</span>
              </button>
            ) : (
              <span className="text-sm text-muted">Showing all projects</span>
            )}
          </div>

          <div className="mt-6 hidden items-center gap-4 lg:flex" aria-hidden="true">
            <span className="relative h-px w-full max-w-[200px] bg-line">
              <motion.span className="absolute inset-0 origin-left bg-ink" style={{ scaleX: fill }} />
            </span>
            <span className="text-xs tabular-nums text-muted">{visible.length} shown</span>
          </div>
        </Reveal>

        <div>
          {visible.length === 0 && (
            <p className="glass-card p-7 text-[15px] text-[#4A4A54]">
              No featured project is tagged with {selectedLabel} yet. You can find where I've used it in the
              Experience section.{" "}
              <button type="button" onClick={onClear} className="font-medium underline underline-offset-4">
                Show all projects
              </button>
            </p>
          )}
          <div ref={gridRef} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
