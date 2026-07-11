"use client";
import { useEffect, useRef } from "react";

/**
 * Counts up from 0 to a target number when scrolled into view, using
 * GSAP. Only used for genuinely count-like stats (12+, 2 ventures) —
 * not applied to every stat, since counting up a year or an
 * abbreviation ("BD") doesn't read as a real "counter."
 */
export default function StatCounter({ value }) {
  const ref = useRef(null);

  useEffect(() => {
    const match = String(value).match(/^(\d+)(.*)$/);
    if (!match) return; // not a countable numeric value — render as static text
    const target = parseInt(match[1], 10);
    const suffix = match[2] || "";
    const el = ref.current;
    if (!el) return;

    let ctx;
    let cancelled = false;
    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const counter = { n: 0 };
      ctx = gsap.context(() => {
        gsap.to(counter, {
          n: target,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = Math.round(counter.n) + suffix;
          },
        });
      });
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [value]);

  return <span ref={ref}>{value}</span>;
}
