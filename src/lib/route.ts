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

/** Frame element that morphs between a project card and its case-study header. */
const frameOf = (id?: string) =>
  id ? document.querySelector<HTMLElement>(`[data-preview-frame="${id}"]`) : null;

interface NavigateOptions {
  /** Project whose preview frame is on screen now (the element to morph from). */
  from?: string;
  /** Project whose preview frame will be on screen next (the element to morph to). */
  to?: string;
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<unknown> };
};

/**
 * Client-side navigation between the home page and case studies. Where the browser supports
 * View Transitions, the project preview morphs into place; elsewhere (or with reduced motion)
 * it simply switches pages. Falls back to a normal hash change if anything is missing.
 */
export function navigate(hash: string, { from, to }: NavigateOptions = {}) {
  const doc = document as ViewTransitionDocument;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const swap = () => {
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
    frameOf(to)?.style.setProperty("view-transition-name", "project-preview");
  };

  if (!doc.startViewTransition || reduced) {
    swap();
    return;
  }

  const oldFrame = frameOf(from);
  oldFrame?.style.setProperty("view-transition-name", "project-preview");
  const transition = doc.startViewTransition(swap);
  const cleanup = () => {
    oldFrame?.style.removeProperty("view-transition-name");
    frameOf(to)?.style.removeProperty("view-transition-name");
  };
  transition.finished.then(cleanup, cleanup);
}
