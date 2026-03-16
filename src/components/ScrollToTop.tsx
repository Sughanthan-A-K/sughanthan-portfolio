"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollToTop() {
  const containerRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const arrow = arrowRef.current;
    const container = containerRef.current;
    if (!arrow || !container) return;

    const aboutEl = document.getElementById("about");
    if (!aboutEl) return;

    gsap.set(container, { opacity: 0, y: -20, visibility: 'hidden' });

    const blink = gsap.to(arrow, {
      opacity: 0.3,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const bob = gsap.to(arrow, {
      y: -4,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const showArrow = () => {
      if (window.scrollY < window.innerHeight * 0.5) return;
      gsap.killTweensOf(container);
      gsap.to(container, { opacity: 1, y: 0, visibility: 'visible', duration: 0.6, ease: "power2.out" });
    };

    const hideArrow = () => {
      gsap.killTweensOf(container);
      gsap.to(container, { opacity: 0, y: -20, duration: 0.4, ease: "power2.in", onComplete: () => { gsap.set(container, { visibility: 'hidden' }); } });
    };

    const hideInstant = () => {
      gsap.killTweensOf(container);
      gsap.set(container, { opacity: 0, y: -20, visibility: 'hidden' });
    };

    const handleNavClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a[href^="#"]');
      if (link && link.getAttribute("href") !== "#about") {
        hideInstant();
      }
    };
    document.addEventListener("click", handleNavClick);

    const heroEl = document.getElementById("hero");
    let inHero = true;

    if (heroEl) {
      ScrollTrigger.create({
        trigger: heroEl,
        start: "top top",
        end: "bottom top",
        onEnter: () => { inHero = true; hideInstant(); },
        onEnterBack: () => { inHero = true; hideInstant(); },
        onLeave: () => { inHero = false; },
        onLeaveBack: () => { inHero = false; },
      });
    }

    const aboutTitle = aboutEl.querySelector(".about-title") || aboutEl;

    ScrollTrigger.create({
      trigger: aboutTitle,
      start: "top 85%",
      end: "top 80px",
      onEnter: () => {
        if (!inHero) showArrow();
      },
      onLeave: hideArrow,
      onEnterBack: () => {
        if (!inHero) showArrow();
      },
      onLeaveBack: hideInstant,
    });

    return () => {
      document.removeEventListener("click", handleNavClick);
      blink.kill();
      bob.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === aboutEl || st.trigger === heroEl || st.trigger === aboutTitle) st.kill();
      });
    };
  }, []);

  const handleClick = () => {
    const container = containerRef.current;
    if (container) {
      gsap.killTweensOf(container);
      gsap.set(container, { opacity: 0, y: -20 });
    }
    window.dispatchEvent(new CustomEvent("rope-click"));
  };

  return (
    <div
      ref={containerRef}
      className="fixed left-1/2 -translate-x-1/2 z-[60] pointer-events-none opacity-0"
      style={{ top: 78 }}
    >
      <div
        ref={arrowRef}
        onClick={handleClick}
        className="pointer-events-auto cursor-pointer flex flex-col items-center gap-0.5"
        aria-label="Back to top"
      >
        <div className="flex flex-col items-center -space-y-2">
          <svg className="w-5 h-5" style={{ color: 'var(--color-primary)', opacity: 0.3 }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
          <svg className="w-5 h-5" style={{ color: 'var(--color-primary)', opacity: 0.6 }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
          <svg className="w-5 h-5" style={{ color: 'var(--color-accent)', opacity: 0.9 }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
