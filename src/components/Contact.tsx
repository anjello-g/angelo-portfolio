import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Code2, Copy, ExternalLink, Mail, MapPin } from "lucide-react";
import { profile } from "../data/content";
import { Magnetic } from "./Magnetic";
import { Reveal } from "./Reveal";

/** Copies the email address; falls back to opening the mail app if the clipboard is blocked. */
function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy email address"
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        copied ? "border-ink bg-lime" : "border-[#CFCFD7] bg-white/60 hover:border-ink"
      }`}
    >
      {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
      {copied ? "Copied" : "Copy"}
      <span role="status" className="sr-only">
        {copied ? "Email address copied" : ""}
      </span>
    </button>
  );
}

export function Contact() {
  return (
    <section id="contact" className="section-shell py-10">
      <Reveal>
        <div className="relative overflow-hidden rounded-[28px] border border-line bg-gradient-to-br from-[#F7F8F9] to-[#ECEEF0] px-8 py-12 md:px-16 md:py-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-28 -top-16 h-[420px] w-[420px] rounded-full opacity-80"
            style={{ background: "radial-gradient(circle at 30% 30%, #FFFFFF, #E3E6E9)" }}
          />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_auto_1.3fr]">
            <div>
              <h2 className="text-[30px] font-medium tracking-[-0.03em] md:text-4xl">Let's Work Together</h2>
              <p className="mt-4 max-w-[340px] text-base leading-relaxed text-[#4A4A54]">
                Have a project in mind, a collaboration idea, or just want to connect? I'd love to hear from you.
              </p>
            </div>

            <Magnetic className="w-fit">
              <a href={`mailto:${profile.email}`} className="btn-dark group">
                Get in Touch
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
            </Magnetic>

            <ul className="flex flex-col gap-5 text-[15px] lg:border-l lg:border-[#CFCFD7] lg:pl-10">
              <li className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <a href={`mailto:${profile.email}`} className="flex items-center gap-4 hover:text-muted">
                  <Mail size={18} aria-hidden="true" />
                  {profile.email}
                </a>
                <CopyEmail />
              </li>
              <li>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 hover:text-muted"
                >
                  <ExternalLink size={18} aria-hidden="true" />
                  {profile.linkedinLabel}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 hover:text-muted"
                >
                  <Code2 size={18} aria-hidden="true" />
                  {profile.githubLabel}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
              <li className="flex items-center gap-4">
                <MapPin size={18} aria-hidden="true" />
                {profile.location}
              </li>
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
