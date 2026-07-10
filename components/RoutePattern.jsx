"use client";

/**
 * NAVICORE's signature background texture — ported directly from
 * navicore.co's hero (components/hero.tsx there). Using the exact same
 * pattern here is the single highest-fidelity way to make this portfolio
 * and the company site read as one brand, since it's a genuinely unique
 * visual asset (not a generic gradient-blob background).
 */
export default function RoutePattern({ patternId = "route-grid", glowId = "route-glow" }) {
  return (
    <svg
      aria-hidden="true"
      className="p-route-pattern"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={glowId} cx="30%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#0A1420" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#040911" stopOpacity="0" />
        </radialGradient>
        <pattern id={patternId} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <line x1="0" y1="40" x2="80" y2="40" stroke="#00E5C3" strokeWidth="0.4" />
          <line x1="40" y1="0" x2="40" y2="80" stroke="#00E5C3" strokeWidth="0.4" />
          <circle cx="40" cy="40" r="1.5" fill="none" stroke="#00E5C3" strokeWidth="0.4" />
          <circle cx="0" cy="40" r="1" fill="#00E5C3" />
          <circle cx="80" cy="40" r="1" fill="#00E5C3" />
          <circle cx="40" cy="0" r="1" fill="#00E5C3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} opacity="0.06" />
      <rect width="100%" height="100%" fill={`url(#${glowId})`} />
    </svg>
  );
}
