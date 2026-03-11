"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.45,
      touchMultiplier: 1.2,
    });

    lenisRef.current = lenis;

    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname);
    }
    window.scrollTo(0, 0);
    lenis.scrollTo(0, { immediate: true });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    // Intercept anchor clicks for smooth Lenis scrolling
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href || href === '#') return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -80, duration: 4, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    };

    document.addEventListener('click', handleAnchorClick);

    // Listen for rope click to scroll to top
    const handleRopeClick = () => {
      lenis.scrollTo(0, { duration: 4, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    };
    window.addEventListener('rope-click', handleRopeClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('rope-click', handleRopeClick);
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
