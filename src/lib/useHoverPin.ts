import { useState, type PointerEvent } from "react";

/**
 * Hover previews a value on a mouse; a click (or tap) pins it. Keyboard focus previews too.
 * Used by the interactive project previews so they work with mouse, touch and keyboard.
 */
export function useHoverPin<T extends string | number>() {
  const [hover, setHover] = useState<T | null>(null);
  const [pin, setPin] = useState<T | null>(null);

  const bind = (value: T) => ({
    onPointerEnter: (e: PointerEvent) => {
      if (e.pointerType === "mouse") setHover(value);
    },
    onPointerLeave: (e: PointerEvent) => {
      if (e.pointerType === "mouse") setHover(null);
    },
    onFocus: () => setHover(value),
    onBlur: () => setHover(null),
    onClick: () => setPin((p) => (p === value ? null : value)),
  });

  return {
    active: hover ?? pin,
    pin,
    bind,
    clear: () => {
      setHover(null);
      setPin(null);
    },
  };
}
