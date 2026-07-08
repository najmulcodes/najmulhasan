"use client";
import { useRef } from "react";

/**
 * Lightweight 3D tilt-on-hover wrapper.
 *
 * Deliberately CSS-transform based rather than a WebGL/three.js scene —
 * a full 3D engine adds real weight to the JS bundle and can hurt LCP/TBT,
 * which works against the SEO goal this site also cares about. This gets
 * a genuine "premium SaaS" 3D feel (see Linear, Vercel, Stripe marketing
 * pages) for effectively zero bundle cost, since it's just a mousemove
 * listener mutating CSS custom properties directly via ref — no React
 * re-render per frame.
 */
export default function TiltCard({ children, className = "", maxTilt = 7, glow = true, style, ...props }) {
  const ref = useRef(null);

  function handleMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - y) * maxTilt * 2;
    const ry = (x - 0.5) * maxTilt * 2;
    el.style.setProperty("--tilt-rx", `${rx}deg`);
    el.style.setProperty("--tilt-ry", `${ry}deg`);
    el.style.setProperty("--tilt-mx", `${x * 100}%`);
    el.style.setProperty("--tilt-my", `${y * 100}%`);
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-rx", "0deg");
    el.style.setProperty("--tilt-ry", "0deg");
  }

  return (
    <div
      ref={ref}
      className={`p-tilt${glow ? " p-tilt-glow" : ""} ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={style}
      {...props}
    >
      <div className="p-tilt-inner">{children}</div>
    </div>
  );
}
