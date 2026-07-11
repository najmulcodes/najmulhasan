"use client";
import { useRef, useEffect } from "react";

/**
 * Lightweight circular "globe" background theme for the hero — pure SVG
 * + CSS, no WebGL/Three.js/R3F. This replaces a full R3F holographic
 * globe scene that field data (Vercel Speed Insights) showed was
 * causing a severe INP regression (3,100ms+) even after pausing its
 * render loop when off-screen — the ~1.1MB R3F/drei/postprocessing
 * bundle and WebGL context setup itself was the cost, not just the
 * continuous rendering. This achieves the same "network globe" feel
 * using the classic flat-SVG trick (concentric ellipses simulate
 * latitude lines on a sphere) — effectively free on the main thread,
 * since it's compositor-only CSS animation with no JS render loop.
 */
export default function HeroOrbit() {
  const groupRef = useRef(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFinePointer) return;

    const el = groupRef.current;
    if (!el) return;
    let raf = null;

    function onMove(e) {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 14;
        const y = (e.clientY / window.innerHeight - 0.5) * 8;
        el.style.transform = `translateY(-50%) translate(${x}px, ${y}px)`;
        raf = null;
      });
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div ref={groupRef} className="p-orbit-wrap" aria-hidden="true">
      <svg viewBox="0 0 600 600" className="p-orbit-svg">
        <defs>
          <radialGradient id="orbit-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00E5C3" stopOpacity="0.16" />
            <stop offset="60%" stopColor="#00E5C3" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#00E5C3" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="orbit-arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4A843" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#00E5C3" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        <circle cx="300" cy="300" r="290" fill="url(#orbit-glow)" />

        <g className="p-orbit-spin">
          {/* Outer sphere outline */}
          <circle cx="300" cy="300" r="200" fill="none" stroke="#00E5C3" strokeWidth="1" opacity="0.35" />

          {/* Latitude lines — flattening ellipses simulate a sphere viewed at an angle */}
          {[0.98, 0.82, 0.55, 0.2, -0.2, -0.55, -0.82, -0.98].map((f, i) => (
            <ellipse
              key={i}
              cx="300" cy="300"
              rx={200 * Math.sqrt(1 - f * f)}
              ry={200 * Math.sqrt(1 - f * f) * 0.32}
              transform={`translate(0, ${f * 200})`}
              fill="none" stroke="#00E5C3" strokeWidth="0.7" opacity={0.16 + (1 - Math.abs(f)) * 0.14}
            />
          ))}

          {/* Longitude arcs */}
          {[0, 45, 90, 135].map((deg, i) => (
            <ellipse
              key={`lon-${i}`}
              cx="300" cy="300" rx="70" ry="200"
              transform={`rotate(${deg} 300 300)`}
              fill="none" stroke="#00E5C3" strokeWidth="0.6" opacity="0.14"
            />
          ))}

          {/* Route arcs between markers */}
          <path d="M 300 175 Q 420 200 430 300" fill="none" stroke="url(#orbit-arc-grad)" strokeWidth="1.2" opacity="0.6" />
          <path d="M 300 175 Q 220 240 195 340" fill="none" stroke="url(#orbit-arc-grad)" strokeWidth="1.2" opacity="0.5" />
          <path d="M 300 175 Q 340 280 390 380" fill="none" stroke="url(#orbit-arc-grad)" strokeWidth="1" opacity="0.4" />

          {/* Bangladesh marker (gold) */}
          <circle cx="300" cy="175" r="5" fill="#D4A843" className="p-orbit-node-pulse" />
          <circle cx="300" cy="175" r="10" fill="none" stroke="#D4A843" strokeWidth="1" opacity="0.5" />

          {/* Hub markers (cyan) */}
          <circle cx="430" cy="300" r="3.5" fill="#00E5C3" opacity="0.85" />
          <circle cx="195" cy="340" r="3.5" fill="#00E5C3" opacity="0.85" />
          <circle cx="390" cy="380" r="3" fill="#00E5C3" opacity="0.7" />

          {/* Ambient scatter dots */}
          {[[120,140],[480,160],[150,460],[460,440],[300,80],[80,300],[520,300],[300,520]].map(([x,y],i) => (
            <circle key={`dot-${i}`} cx={x} cy={y} r="1.4" fill="#00E5C3" opacity="0.35" />
          ))}
        </g>
      </svg>
    </div>
  );
}
