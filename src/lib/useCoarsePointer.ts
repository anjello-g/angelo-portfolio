import { useEffect, useState } from "react";

/**
 * True on touch-first devices (no hover). Hover-driven effects use this to switch to
 * scroll- or tap-driven equivalents so phones get the same feeling as desktop.
 */
export function useCoarsePointer(): boolean {
  const query = "(hover: none)";
  const [coarse, setCoarse] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setCoarse(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return coarse;
}
