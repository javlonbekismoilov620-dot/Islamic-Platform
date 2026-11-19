import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size = 24): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
});

/** Mehrob ravogʻi — ibodat boʻlimi belgisi. */
export function MihrabIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M5 21V10.5C5 6.9 8.1 4 12 2.5c3.9 1.5 7 4.4 7 8V21" />
      <path d="M9 21v-6.2c0-1.7 1.3-3.1 3-3.8 1.7.7 3 2.1 3 3.8V21" />
      <path d="M3 21h18" />
    </svg>
  );
}

/** Tasbeh — zikr boʻlimi belgisi. */
export function TasbihIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="4.5" r="1.6" />
      <circle cx="17.2" cy="6.6" r="1.6" />
      <circle cx="19.3" cy="11.8" r="1.6" />
      <circle cx="17.2" cy="17" r="1.6" />
      <circle cx="6.8" cy="6.6" r="1.6" />
      <circle cx="4.7" cy="11.8" r="1.6" />
      <circle cx="6.8" cy="17" r="1.6" />
      <path d="M12 18.6v2.9M10.6 22h2.8" />
    </svg>
  );
}

/** Duo qilayotgan kaftlar — minimal chiziqli shakl. */
export function DuaIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M11 20.5c-3.6-.6-6-3.4-6-7.3V7.6c0-.9.7-1.6 1.6-1.6S8.2 6.7 8.2 7.6V12" />
      <path d="M13 20.5c3.6-.6 6-3.4 6-7.3V7.6c0-.9-.7-1.6-1.6-1.6s-1.6.7-1.6 1.6V12" />
      <path d="M8.2 12c0-1.9.9-3.1 2.2-3.1.6 0 .6.6.6 1.3v10.3M15.8 12c0-1.9-.9-3.1-2.2-3.1-.6 0-.6.6-.6 1.3v10.3" />
    </svg>
  );
}

/** Rehal ustidagi ochiq kitob — Qurʼon belgisi. */
export function QuranIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M12 6.5C10.2 5 7.6 4.3 4 4.5v11.2c3.5-.2 6.1.5 8 2 1.9-1.5 4.5-2.2 8-2V4.5c-3.6-.2-6.2.5-8 2Z" />
      <path d="M12 6.5v11.2" />
      <path d="m6 18.5 6 3 6-3" />
    </svg>
  );
}
