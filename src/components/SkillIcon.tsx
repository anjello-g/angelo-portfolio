import type { SkillId } from "../data/content";

/**
 * Simple stand-in glyphs in similar colors — NOT official brand logos.
 * Swap in the official logo assets before launch if you want exact marks.
 */
export function SkillIcon({ id }: { id: SkillId }) {
  const common = { width: 34, height: 34, viewBox: "0 0 34 34", "aria-hidden": true, focusable: false } as const;

  switch (id) {
    case "powerbi":
      return (
        <svg {...common}>
          <rect x="4" y="16" width="7" height="14" rx="2" fill="#F2C811" />
          <rect x="13" y="9" width="7" height="21" rx="2" fill="#E8A900" />
          <rect x="22" y="3" width="7" height="27" rx="2" fill="#C98400" />
        </svg>
      );
    case "domo":
      return (
        <svg {...common}>
          <rect x="2" y="6" width="30" height="22" rx="4" fill="#4FA3E3" />
          <circle cx="12" cy="17" r="4" fill="none" stroke="#fff" strokeWidth="2" />
          <circle cx="22" cy="17" r="4" fill="none" stroke="#fff" strokeWidth="2" />
        </svg>
      );
    case "excel":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="28" height="28" rx="5" fill="#1F7A4A" />
          <path d="M11 11l12 12M23 11L11 23" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "sql":
      return (
        <svg {...common}>
          <ellipse cx="17" cy="8" rx="11" ry="4.5" fill="#3B82C4" />
          <path d="M6 8v7c0 2.5 5 4.5 11 4.5s11-2 11-4.5V8c0 2.5-5 4.5-11 4.5S6 10.5 6 8z" fill="#2E6DA8" />
          <path d="M6 15v8c0 2.5 5 4.5 11 4.5s11-2 11-4.5v-8c0 2.5-5 4.5-11 4.5S6 17.5 6 15z" fill="#245A8E" />
        </svg>
      );
    case "python":
      return (
        <svg {...common}>
          <path d="M17 3c-6 0-6 3-6 5v3h6v2H8c-3 0-5 2-5 6s2 6 5 6h2v-4c0-3 2-5 5-5h6c3 0 4-2 4-4V8c0-3-3-5-9-5z" fill="#3E7CB8" />
          <path d="M17 31c6 0 6-3 6-5v-3h-6v-2h9c3 0 5-2 5-6s-2-6-5-6h-2v4c0 3-2 5-5 5h-6c-3 0-4 2-4 4v5c0 3 3 4 8 4z" fill="#F4C842" />
        </svg>
      );
    case "javascript":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="28" height="28" rx="5" fill="#F4D03F" />
          <path d="M14 14v8c0 2-1 3-3 3-1 0-2-.4-2.700-1.300M19 24.500c.8.800 1.800 1.200 3 1.200 1.800 0 3-.9 3-2.300 0-3.200-6-1.900-6-5.300 0-1.400 1.100-2.400 2.900-2.400 1.100 0 2 .3 2.800 1" fill="none" stroke="#15151A" strokeWidth="2.200" strokeLinecap="round" />
        </svg>
      );
    case "git":
      return (
        <svg {...common}>
          <rect x="5" y="5" width="24" height="24" rx="4" transform="rotate(45 17 17)" fill="#E8503A" />
          <circle cx="14" cy="21" r="2.6" fill="#fff" />
          <circle cx="14" cy="11" r="2.6" fill="#fff" />
          <circle cx="21" cy="16" r="2.6" fill="#fff" />
          <path d="M14 13.5v5M14 13l7 3" stroke="#fff" strokeWidth="1.8" fill="none" />
        </svg>
      );
    case "api":
      return (
        <svg {...common}>
          <path d="M17 8L8 24h18z" fill="none" stroke="#3A5BD9" strokeWidth="2" />
          <circle cx="17" cy="7" r="4" fill="#3A5BD9" />
          <circle cx="7" cy="25" r="4" fill="#3A5BD9" />
          <circle cx="27" cy="25" r="4" fill="#3A5BD9" />
        </svg>
      );
  }
}
