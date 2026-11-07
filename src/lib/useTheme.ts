import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
const META_COLORS: Record<Theme, string> = { light: "#F2F6FB", dark: "#0A1B2E" };

function read(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function subscribe(cb: () => void) {
  // The attribute is the single source of truth (index.html sets it before first paint).
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  return () => obs.disconnect();
}

function apply(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", META_COLORS[theme]);
}

export interface Origin {
  x: number;
  y: number;
}

const PAPER: Record<Theme, string> = { light: "#F2F6FB", dark: "#0A1B2E" };
let running = false;

/**
 * Switch with a "bloom": a disc in the new theme's background colour swells out from the toggle
 * (transform only, so it runs on the GPU and stays smooth), the theme is swapped underneath it,
 * then it fades away. Reduced-motion visitors get an instant switch.
 */
function applyAnimated(next: Theme, origin?: Origin) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || typeof Element.prototype.animate !== "function") {
    apply(next);
    return;
  }
  // A switch is already in progress: ignore extra clicks rather than jumping straight to the new colours.
  if (running) return;

  const x = origin?.x ?? window.innerWidth - 60;
  const y = origin?.y ?? 40;
  const r = Math.ceil(Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) * 1.15) + 8;

  const disc = document.createElement("div");
  disc.setAttribute("aria-hidden", "true");
  Object.assign(disc.style, {
    position: "fixed",
    left: `${x - r}px`,
    top: `${y - r}px`,
    width: `${r * 2}px`,
    height: `${r * 2}px`,
    borderRadius: "50%",
    background: PAPER[next],
    border: "3px solid rgb(var(--accent))",
    boxShadow: "0 0 60px 8px rgb(var(--accent) / 0.55), inset 0 0 80px rgb(var(--accent) / 0.12)",
    pointerEvents: "none",
    zIndex: "9999",
    willChange: "transform, opacity",
    transform: "scale(0)",
  } satisfies Partial<CSSStyleDeclaration>);
  document.body.appendChild(disc);
  running = true;

  const GROW = 520;
  const SWAP_AT = 400; // swap just before the disc finishes growing, while it still covers the page
  const FADE = 560;

  disc.animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], {
    duration: GROW,
    easing: "cubic-bezier(0.65, 0, 0.35, 1)",
    fill: "forwards",
  });

  window.setTimeout(() => {
    apply(next);
    // The disc is the new background colour, so fading it out is the text fading in.
    requestAnimationFrame(() => {
      const out = disc.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: FADE,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        fill: "forwards",
      });
      out.onfinish = () => {
        disc.remove();
        running = false;
      };
    });
  }, SWAP_AT);
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => "light" as Theme);

  const setTheme = useCallback((next: Theme, origin?: Origin) => {
    applyAnimated(next, origin);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage blocked: the choice lasts for this visit only */
    }
  }, []);

  const toggle = useCallback(
    (origin?: Origin) => setTheme(read() === "dark" ? "light" : "dark", origin),
    [setTheme],
  );

  return { theme, setTheme, toggle };
}
