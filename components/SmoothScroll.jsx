"use client";
import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Buttery smooth scroll, replacing the browser's default step-scroll feel.
 * This is one of the single highest-leverage changes for making a site
 * feel "expensive" — most award-site studios (Unseen, Locomotive, etc.)
 * use exactly this technique (Lenis is the modern standard, built by the
 * same ecosystem as GSAP's ScrollSmoother).
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    document.documentElement.classList.add("lenis");

    // Respect anchor-link navigation (#hero, #about, etc.) used throughout
    // the nav/side-dots — Lenis intercepts wheel/touch, not hash clicks,
    // but this keeps offset consistent with the fixed navbar height.
    function onAnchorClick(e) {
      const link = e.target.closest('a[href^="#"], a[href^="/#"]');
      if (!link) return;
      const id = link.getAttribute("href").split("#")[1];
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -70, duration: 1.2 });
    }
    document.addEventListener("click", onAnchorClick);

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", onAnchorClick);
      document.documentElement.classList.remove("lenis");
      lenis.destroy();
    };
  }, []);

  return children;
}
