"use client";
import { useEffect, useRef } from "react";

/**
 * Custom cursor: a small dot that leads, and a trailing ring that eases
 * behind it and scales up over anything clickable. Classic Awwwards-tier
 * touch, desktop-only (fine pointer + hover capable) since it makes no
 * sense on touch devices.
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
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    function onMove(e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    }

    function onOver(e) {
      const hovering = !!e.target.closest('a, button, .p-tilt, input, textarea, [role="button"]');
      ring.style.width = hovering ? "52px" : "32px";
      ring.style.height = hovering ? "52px" : "32px";
      ring.style.borderColor = hovering ? "var(--teal, #D4A843)" : "rgba(212,168,67,.5)";
      ring.style.opacity = hovering ? "1" : ".6";
    }

    function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    const raf = requestAnimationFrame(loop);

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
          border-radius:50%; will-change:transform;
        }
        .p-cursor-dot{
          width:6px; height:6px; background:var(--teal, #D4A843);
          transform:translate3d(-100px,-100px,0) translate(-50%,-50%);
        }
        .p-cursor-ring{
          width:32px; height:32px; border:1.5px solid rgba(212,168,67,.5);
          transform:translate3d(-100px,-100px,0) translate(-50%,-50%);
          transition:width .25s cubic-bezier(.22,1,.36,1),height .25s cubic-bezier(.22,1,.36,1),
                     border-color .25s ease, opacity .25s ease;
          opacity:.6;
        }
        @media (hover:none), (pointer:coarse){
          .p-cursor-dot, .p-cursor-ring{display:none}
        }
      `}</style>
    </>
  );
}
