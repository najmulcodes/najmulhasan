"use client";
import { useEffect, useRef } from "react";

/**
 * Thin mission-control style scroll-progress bar, fixed to the top of the
 * viewport. Built with GSAP + ScrollTrigger's scrub — this is the one
 * GSAP-appropriate use case here (a value that should track scroll
 * position exactly, frame-accurate), rather than reaching for GSAP on
 * things framer-motion's whileInView already handles well.
 */
export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    let ctx;
    let cancelled = false;

    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.to(barRef.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
          },
        });
      });
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <div className="p-scrollbar-track" aria-hidden="true">
      <div ref={barRef} className="p-scrollbar-fill" />
    </div>
  );
}
