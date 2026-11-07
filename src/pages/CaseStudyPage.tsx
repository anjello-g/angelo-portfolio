import type { MouseEvent, ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { profile, projects, type Project } from "../data/content";
import { canOpenCaseStudy, navigate } from "../lib/route";
import { ProjectPreview } from "../components/ProjectPreview";
import { Footer } from "../components/Footer";
import { Reveal } from "../components/Reveal";
import { ScrollProgress } from "../components/ScrollProgress";

const ease = [0.22, 1, 0.36, 1] as const;

/** The flow steps draw in one after another as the section scrolls into view. */
function FlowDiagram({ steps }: { steps: string[] }) {
  return (
    <ol className="flex flex-col items-start md:flex-row md:flex-wrap md:items-center md:gap-y-3">
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        const delay = i * 0.3;
        return (
          <li key={step} className="flex flex-col items-start md:flex-row md:items-center">
            <motion.span
              className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-medium text-ink shadow-tile ${
                last ? "border-ink bg-lime" : "border-line bg-white"
              }`}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay, ease }}
            >
              <span className="text-xs tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
              {step}
            </motion.span>
            {!last && (
              <>
                <span aria-hidden="true" className="relative mx-2 hidden h-px w-10 bg-line md:block">
                  <motion.span
                    className="absolute inset-0 origin-left bg-ink"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.35, delay: delay + 0.3, ease }}
                  />
                </span>
                <span aria-hidden="true" className="relative my-1 ml-5 h-6 w-px bg-line md:hidden">
                  <motion.span
                    className="absolute inset-0 origin-top bg-ink"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.35, delay: delay + 0.3, ease }}
                  />
                </span>
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** Previous / next case study, so a visitor can keep browsing without going back. */
function MoreProjects({ project }: { project: Project }) {
  const open = projects.filter(canOpenCaseStudy);
  const i = open.findIndex((p) => p.id === project.id);
  if (open.length < 2 || i < 0) return null;
  const prev = open[(i - 1 + open.length) % open.length];
  const next = open[(i + 1) % open.length];

  const go = (target: Project) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigate(`#/projects/${target.id}`, { from: project.id, to: target.id });
  };

  return (
    <nav aria-label="More case studies" className="mt-16 grid gap-4 border-t border-line pt-10 sm:grid-cols-2">
      {[
        { target: prev, dir: "Previous" as const },
        { target: next, dir: "Next" as const },
      ].map(({ target, dir }) => (
        <a
          key={dir}
          href={`#/projects/${target.id}`}
          onClick={go(target)}
          data-cursor="View"
          className={`group glass-card flex items-center justify-between gap-4 p-5 transition-colors hover:border-ink ${
            dir === "Next" ? "sm:flex-row-reverse sm:text-right" : ""
          }`}
        >
          <span>
            <span className="block text-xs uppercase tracking-[0.18em] text-muted">{dir}</span>
            <span className="mt-1.5 block text-base font-medium">{target.title}</span>
          </span>
          {dir === "Next" ? (
            <ArrowRight size={18} className="flex-none transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          ) : (
            <ArrowLeft size={18} className="flex-none transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
          )}
        </a>
      ))}
    </nav>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <Reveal className="grid gap-4 border-t border-line py-10 md:grid-cols-[180px_1fr] md:gap-10">
      <h2 className="flex items-baseline gap-3 text-sm font-medium uppercase tracking-[0.18em]">
        <span className="text-muted">{n}</span>
        {title}
      </h2>
      <div className="max-w-[680px] text-[17px] leading-[1.7] text-[#4A4A54]">{children}</div>
    </Reveal>
  );
}

export function CaseStudyPage({ project }: { project: Project }) {
  const cs = project.caseStudy;
  const tools = project.tools;

  const backToProjects = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigate("#projects", { from: project.id, to: project.id });
  };

  return (
    <>
      <ScrollProgress />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white"
      >
        Skip to content
      </a>

      <header className="border-b border-line bg-white/80">
        <div className="section-shell flex items-center justify-between py-5">
          <a href="#home" className="flex items-center gap-4" aria-label="Angelo Gaspe — home">
            <span className="text-[30px] font-normal leading-none tracking-[-0.04em]">AG</span>
            <span className="h-7 w-px bg-[#C9C9D1]" aria-hidden="true" />
            <span className="text-[15px] font-medium">Angelo Gaspe</span>
          </a>
          <a href="#projects" onClick={backToProjects} className="group inline-flex items-center gap-2 text-sm font-medium">
            <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden="true" />
            All projects
          </a>
        </div>
      </header>

      <main id="main" className="section-shell pb-10 pt-14 md:pt-20">
        {!cs.ready && (
          <div role="note" className="mb-10 rounded-2xl border border-ink bg-lime px-5 py-4 text-sm">
            <strong className="font-semibold">Draft — not published.</strong> Fill in every TODO in{" "}
            <code>src/data/content.ts</code>, confirm it is safe to share, then set <code>ready: true</code>. This
            banner and page are only visible in local development until then.
          </div>
        )}

        <Reveal>
          <p className="eyebrow">
            Case study <span className="h-px w-10 bg-[#C9C9D1]" aria-hidden="true" />
          </p>
          <h1 className="mt-7 max-w-[860px] text-[40px] font-medium leading-[1.05] tracking-[-0.04em] md:text-[64px]">
            {project.title}
          </h1>
          <p className="mt-6 max-w-[620px] text-lg leading-relaxed text-body">{project.description}</p>

          <dl className="mt-10 grid gap-6 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted">Role</dt>
              <dd className="mt-1.5 font-medium">{cs.role}</dd>
            </div>
            <div>
              <dt className="text-muted">Timeframe</dt>
              <dd className="mt-1.5 font-medium">{cs.timeframe}</dd>
            </div>
            <div>
              <dt className="text-muted">Tools</dt>
              <dd className="mt-1.5 flex flex-wrap gap-2">
                {tools.map((t) => (
                  <span key={t} className="rounded-full border border-line bg-white px-3 py-1 text-xs">
                    {t}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </Reveal>

        <div className="mt-12">
          <div className="glass-card overflow-hidden p-3 md:p-4">
            <div
              data-preview-frame={project.id}
              className="h-[260px] overflow-hidden rounded-xl border border-line/70 bg-mist md:h-[400px]"
            >
              {cs.image ? (
                <img src={cs.image} alt={cs.imageAlt ?? project.title} className="h-full w-full object-cover" />
              ) : (
                <ProjectPreview kind={project.preview} />
              )}
            </div>
            {!cs.image && (
              <p className="px-1 pb-1 pt-3 text-xs text-muted">
                Illustrative preview with made-up values, not real company data. Try clicking around.
              </p>
            )}
          </div>
        </div>

        <div className="mt-14">
          <Section n="01" title="Context">
            <p>{cs.problem}</p>
          </Section>
          <Section n="02" title="What I built">
            <p>{cs.approach}</p>
          </Section>
          <Section n="03" title="Flow">
            <FlowDiagram steps={cs.architecture} />
            <p className="mt-4 text-sm text-muted">A simplified view; internal systems and data are not shown.</p>
          </Section>
          <Section n="04" title="Tools">
            <p>{tools.join(", ")}.</p>
          </Section>
          <Section n="05" title="Impact">
            <p>{cs.outcome}</p>
          </Section>
        </div>

        <MoreProjects project={project} />

        <Reveal className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-[28px] border border-line bg-gradient-to-br from-[#F7F8F9] to-[#ECEEF0] px-8 py-10">
          <p className="text-2xl font-medium tracking-[-0.03em]">
            Want something like this? <span className="italic-serif">Let's talk.</span>
          </p>
          <a href={`mailto:${profile.email}`} className="btn-dark group">
            Get in Touch
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
