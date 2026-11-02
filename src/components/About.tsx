import { motion } from "motion/react";
import { ArrowRight, Award, BadgeCheck, GraduationCap } from "lucide-react";
import { certifications, education, profile, stats } from "../data/content";
import { CountUp } from "./CountUp";
import { Reveal } from "./Reveal";
import { ScrollHighlight } from "./ScrollHighlight";

const ease = [0.22, 1, 0.36, 1] as const;

function Credentials() {
  return (
    <Reveal className="mt-16 grid gap-6 lg:grid-cols-2">
      <div className="glass-card p-7">
        <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em]">
          <GraduationCap size={18} aria-hidden="true" />
          Education
        </div>
        <h3 className="mt-5 text-xl font-medium tracking-[-0.02em]">{education.degree}</h3>
        <p className="mt-1.5 text-sm text-muted">
          {education.school} · {education.location} · {education.year}
        </p>
        <ul className="mt-6 flex flex-col gap-2.5">
          {education.honors.map((h, i) => (
            <motion.li
              key={h}
              className="group flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 text-sm transition-colors hover:border-ink"
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.1, ease }}
            >
              <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-lime transition-transform duration-300 group-hover:rotate-[-12deg] group-hover:scale-110">
                <Award size={14} aria-hidden="true" />
              </span>
              {h}
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="glass-card p-7">
        <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em]">
          <BadgeCheck size={18} aria-hidden="true" />
          Certifications
        </div>
        <ul className="mt-5 divide-y divide-line">
          {certifications.map((c, i) => (
            <motion.li
              key={c.title}
              className="group flex items-baseline justify-between gap-4 py-3.5 transition-transform duration-300 hover:translate-x-1"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08, ease }}
            >
              <span>
                <span className="block text-[15px] font-medium">{c.title}</span>
                <span className="block text-[13px] text-muted">{c.issuer}</span>
              </span>
              <span className="flex-none rounded-full border border-line px-2.5 py-0.5 text-xs text-muted transition-colors group-hover:border-ink group-hover:text-ink">
                {c.year}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

export function About() {
  return (
    <section id="about" className="section-shell py-16 md:py-20">
      <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] lg:grid-cols-[1fr_0.9fr_1.35fr] lg:gap-10">
        <Reveal>
          <p className="eyebrow">
            About me <span className="h-px w-[60px] bg-[#C9C9D1]" aria-hidden="true" />
          </p>
          <h2 className="mt-7 text-[34px] font-medium leading-[1.1] tracking-[-0.035em] md:text-[46px]">
            A Developer who turns ideas into <span className="italic-serif">impact.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.08} className="lg:pt-12">
          <ScrollHighlight text={profile.about} className="text-base leading-[1.7]" />
          <a
            href="#experience"
            className="group mt-7 inline-flex items-center gap-2.5 border-b border-ink pb-1 text-[15px] font-medium"
          >
            See my experience
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        </Reveal>

        <Reveal
          delay={0.16}
          className="md:col-span-2 lg:col-span-1 lg:border-l lg:border-[#DCDCE2] lg:pl-10 lg:pt-12"
        >
          <ul className="flex flex-wrap gap-x-10 gap-y-8">
            {stats.map((s) => (
              <li key={s.label}>
                <div className="text-5xl font-medium leading-none tracking-[-0.04em]">
                  <CountUp to={s.value} suffix={s.suffix} />
                </div>
                <p className="mt-3 max-w-[130px] text-sm leading-snug text-muted">{s.label}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Credentials />
    </section>
  );
}
