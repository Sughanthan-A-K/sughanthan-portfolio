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
    const isMobile = window.innerWidth < 768 || ("ontouchstart" in window && window.innerWidth < 1024);

    if (isMobile) {
      // Force scroll to top on page load/refresh
      if (window.location.hash) {
        history.replaceState(null, "", window.location.pathname);
      }
      window.scrollTo(0, 0);

      // On mobile, skip Lenis entirely — use native scrolling for performance
      // Still handle anchor clicks with native smooth scroll
      const handleAnchorClick = (e: MouseEvent) => {
        const target = (e.target as HTMLElement).closest('a[href^="#"]');
        if (!target) return;
        const href = target.getAttribute('href');
        if (!href || href === '#') return;
        const el = document.querySelector(href);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      document.addEventListener('click', handleAnchorClick);

      const handleRopeClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
      window.addEventListener('rope-click', handleRopeClick);

      // Fire hero-ready immediately on mobile
      setTimeout(() => window.dispatchEvent(new CustomEvent("hero-ready")), 100);

      return () => {
        document.removeEventListener('click', handleAnchorClick);
        window.removeEventListener('rope-click', handleRopeClick);
      };
    }

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

    lenis.stop();
    const unlockScroll = () => {
      lenis.start();
      window.removeEventListener("hero-ready", unlockScroll);
    };
    window.addEventListener("hero-ready", unlockScroll);
    const fallbackTimer = setTimeout(() => {
      lenis.start();
      window.removeEventListener("hero-ready", unlockScroll);
    }, 7000);

    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname);
    }

    window.scrollTo(0, 0);

    lenis.on("scroll", ScrollTrigger.update);

    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href || href === '#') return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -160, duration: 4, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    };

    document.addEventListener('click', handleAnchorClick);

    const handleRopeClick = () => {
      lenis.scrollTo(0, { duration: 4, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    };
    window.addEventListener('rope-click', handleRopeClick);

    const sections = ["hero", "about", "skills", "ai-dev", "experience", "projects", "dev-approach", "education", "contact"];
    const smoothEase = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));
    let sHeld = false;
    let sComboUsed = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (e.target as HTMLElement).isContentEditable) return;

      const key = e.key;

      if (key === "s" || key === "S") {
        if (!sHeld) {
          sHeld = true;
          sComboUsed = false;
        }
        e.preventDefault();
        return;
      }

      if (sHeld && (key === "c" || key === "C")) {
        sComboUsed = true;
        window.dispatchEvent(new CustomEvent("kb-color-open"));
        e.preventDefault();
        return;
      }

      if (sHeld && (key === "t" || key === "T")) {
        sComboUsed = true;
        window.dispatchEvent(new CustomEvent("kb-theme-toggle"));
        e.preventDefault();
        return;
      }

      if (sHeld) {
        sHeld = false;
        sComboUsed = false;
      }

      if (key === "ArrowLeft" || key === "ArrowRight") {
        window.dispatchEvent(new CustomEvent("kb-settings-nav", { detail: key }));
        e.preventDefault();
        return;
      }
      if (key === "ArrowUp" || key === "ArrowDown" || key === "Enter") {
        window.dispatchEvent(new CustomEvent("kb-color-nav", { detail: key }));
        e.preventDefault();
        return;
      }
      if (key === "Escape") {
        window.dispatchEvent(new CustomEvent("kb-settings-close"));
        return;
      }

      if (key === "Home") {
        e.preventDefault();
        lenis.scrollTo(0, { duration: 2.5, easing: smoothEase });
        return;
      }

      if (key === "End") {
        e.preventDefault();
        lenis.scrollTo(document.body.scrollHeight, { duration: 2.5, easing: smoothEase });
        return;
      }

      if (key === "PageUp") {
        e.preventDefault();
        lenis.scrollTo(Math.max(0, window.scrollY - window.innerHeight * 0.85), { duration: 1.5, easing: smoothEase });
        return;
      }

      if (key === "PageDown") {
        e.preventDefault();
        lenis.scrollTo(window.scrollY + window.innerHeight * 0.85, { duration: 1.5, easing: smoothEase });
        return;
      }

      if (key === "Tab") {
        e.preventDefault();
        const scrollY = window.scrollY;
        const threshold = 80;
        if (e.shiftKey) {
          for (let i = sections.length - 1; i >= 0; i--) {
            const el = document.getElementById(sections[i]);
            if (el && el.getBoundingClientRect().top + window.scrollY < scrollY - threshold) {
              lenis.scrollTo(el, { offset: -80, duration: 2, easing: smoothEase });
              return;
            }
          }
          lenis.scrollTo(0, { duration: 2, easing: smoothEase });
        } else {
          for (let i = 0; i < sections.length; i++) {
            const el = document.getElementById(sections[i]);
            if (el && el.getBoundingClientRect().top + window.scrollY > scrollY + threshold) {
              lenis.scrollTo(el, { offset: -80, duration: 2, easing: smoothEase });
              return;
            }
          }
        }
        return;
      }

    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "s" || e.key === "S") {
        if (sHeld && !sComboUsed) {
          window.dispatchEvent(new CustomEvent("kb-settings-toggle"));
        }
        sHeld = false;
        sComboUsed = false;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    const handleMenuOpen = () => lenis.stop();
    const handleMenuClose = () => lenis.start();
    window.addEventListener("mobile-menu-open", handleMenuOpen);
    window.addEventListener("mobile-menu-close", handleMenuClose);

    return () => {
      clearTimeout(fallbackTimer);
      window.removeEventListener("hero-ready", unlockScroll);
      document.removeEventListener('click', handleAnchorClick);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('rope-click', handleRopeClick);
      window.removeEventListener("mobile-menu-open", handleMenuOpen);
      window.removeEventListener("mobile-menu-close", handleMenuClose);
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
