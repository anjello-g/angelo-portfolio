import { useEffect, useState } from "react";
import { projects, type Project } from "../data/content";

/** A case study is reachable when it is marked ready, or while developing locally. */
export function canOpenCaseStudy(project: Project): boolean {
  return project.caseStudy.ready || import.meta.env.DEV;
}

/** Returns the project id from a `#/projects/<id>` hash, or null on the home page. */
export function useCaseStudyRoute(): { projectId: string | null; project: Project | undefined } {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const match = /^#\/projects\/([\w-]+)$/.exec(hash);
  const projectId = match ? match[1] : null;
  const project = projectId ? projects.find((p) => p.id === projectId) : undefined;
  return { projectId, project };
}
