"use client";
import { useRef } from "react";

/**
 * Lightweight 3D tilt-on-hover wrapper.
 *
 * Fix: the previous version called getBoundingClientRect() (forces a
 * synchronous layout reflow) on every single mousemove event, with zero
 * throttling, immediately followed by 4 style writes — classic
 * layout-thrashing. This is used on 8 elements on the homepage (hero
 * card, 4 venture cards, 3 testimonials), so a user moving their mouse
 * over any of them was forcing dozens of layout recalculations per
 * second. This is very likely a real contributor to the site's INP
 * problem — independent of the WebGL globe that was already removed.
 *
 * Fix: cache the bounding rect once on mouseenter (it doesn't change
 * mid-hover) instead of reading it on every move, and rAF-throttle the
 * actual style writes so they're capped at once per paint frame.
 */
export default function TiltCard({ children, className = "", maxTilt = 7, glow = true, style, ...props }) {
  const ref = useRef(null);
  const rectRef = useRef(null);
  const rafRef = useRef(null);
  const pendingRef = useRef(null);

  function handleEnter() {
    const el = ref.current;
    if (!el) return;
    // Read once per hover session, not per pixel of movement.
    rectRef.current = el.getBoundingClientRect();
  }

  function applyTilt() {
    const el = ref.current;
    const pending = pendingRef.current;
    rafRef.current = null;
    if (!el || !pending) return;
    const { rx, ry, mx, my } = pending;
    el.style.setProperty("--tilt-rx", `${rx}deg`);
    el.style.setProperty("--tilt-ry", `${ry}deg`);
    el.style.setProperty("--tilt-mx", `${mx}%`);
    el.style.setProperty("--tilt-my", `${my}%`);
  }

  function handleMove(e) {
    const rect = rectRef.current;
    if (!rect || !rect.width || !rect.height) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - y) * maxTilt * 2;
    const ry = (x - 0.5) * maxTilt * 2;
    pendingRef.current = { rx, ry, mx: x * 100, my: y * 100 };
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(applyTilt);
    }
  }

  function handleLeave() {
    const el = ref.current;
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    pendingRef.current = null;
    rectRef.current = null;
    if (!el) return;
    el.style.setProperty("--tilt-rx", "0deg");
    el.style.setProperty("--tilt-ry", "0deg");
  }

  return (
    <div
      ref={ref}
      className={`p-tilt${glow ? " p-tilt-glow" : ""} ${className}`}
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={style}
      {...props}
    >
      <div className="p-tilt-inner">{children}</div>
    </div>
  );
}
