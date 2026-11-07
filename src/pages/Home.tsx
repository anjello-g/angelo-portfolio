import { useEffect, useState } from "react";
import { navItems, type SkillId } from "../data/content";
import { useActiveSection } from "../lib/useActiveSection";
import { Nav } from "../components/Nav";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Experience } from "../components/Experience";
import { Skills } from "../components/Skills";
import { Projects } from "../components/Projects";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { ScrollProgress } from "../components/ScrollProgress";
import { CommandPalette } from "../components/CommandPalette";

const sectionIds = navItems.map((n) => n.id);

interface HomeProps {
  selectedSkill: SkillId | null;
  onSelectSkill: (id: SkillId | null) => void;
}

export function Home({ selectedSkill, onSelectSkill }: HomeProps) {
  const active = useActiveSection(sectionIds);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName ?? "");
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <ScrollProgress />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-onink"
      >
        Skip to content
      </a>
      <Nav active={active} onOpenPalette={() => setPaletteOpen(true)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onSelectSkill={onSelectSkill} />
      <main id="main">
        <Hero />
        <About />
        <Experience selected={selectedSkill} onSelect={onSelectSkill} />
        <Skills selected={selectedSkill} onSelect={onSelectSkill} />
        <Projects selected={selectedSkill} onClear={() => onSelectSkill(null)} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
