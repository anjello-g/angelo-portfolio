import { useEffect, useState } from "react";
import type { SkillId } from "./data/content";
import { canOpenCaseStudy, useCaseStudyRoute } from "./lib/route";
import { Home } from "./pages/Home";
import { CaseStudyPage } from "./pages/CaseStudyPage";

export default function App() {
  const { projectId, project } = useCaseStudyRoute();
  const [selectedSkill, setSelectedSkill] = useState<SkillId | null>(null);

  const openProject = project && canOpenCaseStudy(project) ? project : null;

  useEffect(() => {
    if (openProject) {
      window.scrollTo(0, 0);
      return;
    }
    // A case-study URL that is unknown or not published falls back to the projects section.
    if (projectId) window.history.replaceState(null, "", "#projects");
    // Back on the home page: restore the section the URL points to.
    const id = window.location.hash.slice(1);
    if (id) {
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    } else {
      window.scrollTo(0, 0);
    }
  }, [openProject, projectId]);

  return openProject ? (
    <CaseStudyPage project={openProject} />
  ) : (
    <Home selectedSkill={selectedSkill} onSelectSkill={setSelectedSkill} />
  );
}
