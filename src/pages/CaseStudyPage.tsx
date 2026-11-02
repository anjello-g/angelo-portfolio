import type { ReactNode } from "react";
import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { profile, type Project } from "../data/content";
import { ProjectPreview } from "../components/ProjectPreview";
import { Footer } from "../components/Footer";
import { Reveal } from "../components/Reveal";

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

  return (
    <>
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
          <a href="#projects" className="group inline-flex items-center gap-2 text-sm font-medium">
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

        <Reveal delay={0.1} className="mt-12">
          <div className="glass-card overflow-hidden p-3 md:p-4">
            <div className="h-[260px] overflow-hidden rounded-xl border border-line/70 md:h-[400px]">
              {cs.image ? (
                <img src={cs.image} alt={cs.imageAlt ?? project.title} className="h-full w-full object-cover" />
              ) : (
                <ProjectPreview kind={project.preview} />
              )}
            </div>
            {!cs.image && (
              <p className="px-1 pb-1 pt-3 text-xs text-muted">
                Illustrative preview. Replace with a safe, non-confidential screenshot via <code>image</code> in
                content.ts.
              </p>
            )}
          </div>
        </Reveal>

        <div className="mt-14">
          <Section n="01" title="Context">
            <p>{cs.problem}</p>
          </Section>
          <Section n="02" title="What I built">
            <p>{cs.approach}</p>
          </Section>
          <Section n="03" title="Flow">
            <ol className="flex flex-col items-start gap-3 md:flex-row md:flex-wrap md:items-center">
              {cs.architecture.map((step, i) => (
                <li key={step} className="flex flex-col items-start gap-3 md:flex-row md:items-center">
                  <span className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink shadow-tile">
                    {step}
                  </span>
                  {i < cs.architecture.length - 1 && (
                    <>
                      <ArrowRight size={16} className="hidden text-muted md:block" aria-hidden="true" />
                      <ArrowDown size={16} className="ml-4 text-muted md:hidden" aria-hidden="true" />
                    </>
                  )}
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-muted">A simplified view; internal systems and data are not shown.</p>
          </Section>
          <Section n="04" title="Tools">
            <p>{tools.join(", ")}.</p>
          </Section>
          <Section n="05" title="Impact">
            <p>{cs.outcome}</p>
          </Section>
        </div>

        <Reveal className="mt-6 flex flex-wrap items-center justify-between gap-6 rounded-[28px] border border-line bg-gradient-to-br from-[#F7F8F9] to-[#ECEEF0] px-8 py-10">
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
