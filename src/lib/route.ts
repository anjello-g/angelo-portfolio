import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { projects, type Project } from "../data/content";

const ROUTE_EVENT = "app:routechange";

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
    window.addEventListener(ROUTE_EVENT, onChange);
    return () => {
      window.removeEventListener("hashchange", onChange);
      window.removeEventListener(ROUTE_EVENT, onChange);
    };
  }, []);

  const match = /^#\/projects\/([\w-]+)$/.exec(hash);
  const projectId = match ? match[1] : null;
  const project = projectId ? projects.find((p) => p.id === projectId) : undefined;
  return { projectId, project };
}

interface NavigateOptions {
  /** Kept for call-site compatibility; the page transition no longer morphs between frames. */
  from?: string;
  to?: string;
}

/**
 * Client-side navigation between the home page and case studies. The page swaps immediately and the
 * incoming page fades in (see `.page-enter` in index.css). That is a compositor-only animation, so it
 * stays smooth, unlike a full-page View Transition which snapshots and recomposites the whole document.
 */
export function navigate(hash: string, _options: NavigateOptions = {}) {
  flushSync(() => {
    window.history.pushState(null, "", hash);
    window.dispatchEvent(new Event(ROUTE_EVENT));
  });
  const id = hash.slice(1);
  if (hash.startsWith("#/")) {
    window.scrollTo({ top: 0, behavior: "instant" });
  } else if (id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
  } else {
    window.scrollTo({ top: 0, behavior: "instant" });
  }
}
