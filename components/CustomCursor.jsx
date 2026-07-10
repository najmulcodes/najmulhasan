"use client";
import { useEffect, useRef } from "react";

/**
 * Custom cursor: a small dot that leads exactly, and a trailing ring that
 * eases behind it and scales over anything clickable. Desktop-only
 * (fine pointer + hover capable).
 *
 * Stays hidden (opacity 0) until the very first real mousemove, then
 * snaps both dot and ring to that exact position with no lag — avoids
 * animating in from a guessed starting point (e.g. screen center), which
 * looked like a visible jump/glitch on load if the mouse wasn't already there.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFinePointer) return;

    document.documentElement.classList.add("has-custom-cursor");

    const dot = dotRef.current;
    const ring = ringRef.current;
    let mx = 0, my = 0;
    let rx = 0, ry = 0;
    let ready = false;

    function setTransform(el, x, y) {
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    }

    function onMove(e) {
      mx = e.clientX;
      my = e.clientY;
      if (!ready) {
        rx = mx;
        ry = my;
        dot.style.opacity = "1";
        ring.style.opacity = ".6";
        ready = true;
      }
      setTransform(dot, mx, my);
    }

    function onOver(e) {
      const hovering = !!e.target.closest('a, button, .p-tilt, input, textarea, [role="button"]');
      ring.style.width = hovering ? "48px" : "28px";
      ring.style.height = hovering ? "48px" : "28px";
      ring.style.borderColor = hovering ? "var(--teal, #C8A24B)" : "rgba(200,162,75,.55)";
      ring.style.opacity = hovering ? "1" : ".6";
    }

    function loop() {
      if (ready) {
        rx += (mx - rx) * 0.28;
        ry += (my - ry) * 0.28;
        setTransform(ring, rx, ry);
      }
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver);
    let raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="p-cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="p-cursor-ring" aria-hidden="true" />
      <style>{`
        .p-cursor-dot, .p-cursor-ring{
          position:fixed; top:0; left:0; pointer-events:none; z-index:9999;
          border-radius:50%; will-change:transform; opacity:0;
        }
        .p-cursor-dot{
          width:6px; height:6px; background:var(--teal, #C8A24B);
          transition:opacity .3s ease;
        }
        .p-cursor-ring{
          width:28px; height:28px; border:1.5px solid rgba(200,162,75,.55);
          transition:width .25s cubic-bezier(.22,1,.36,1),height .25s cubic-bezier(.22,1,.36,1),
                     border-color .25s ease, opacity .3s ease;
        }
        @media (hover:none), (pointer:coarse){
          .p-cursor-dot, .p-cursor-ring{display:none}
        }
      `}</style>
    </>
  );
}
