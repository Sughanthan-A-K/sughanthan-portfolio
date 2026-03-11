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

    gsap.set(container, { opacity: 0, y: -20 });

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
      gsap.killTweensOf(container);
      gsap.to(container, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
    };

    const hideArrow = () => {
      gsap.killTweensOf(container);
      gsap.to(container, { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" });
    };

    const hideInstant = () => {
      gsap.killTweensOf(container);
      gsap.set(container, { opacity: 0, y: -20 });
    };

    const handleNavClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a[href^="#"]');
      if (link && link.getAttribute("href") !== "#about") {
        hideInstant();
      }
    };
    document.addEventListener("click", handleNavClick);

    ScrollTrigger.create({
      trigger: aboutEl,
      start: "top 20%",
      end: "top -0%",
      onEnter: showArrow,
      onLeave: hideArrow,
      onEnterBack: showArrow,
      onLeaveBack: hideArrow,
    });

    return () => {
      document.removeEventListener("click", handleNavClick);
      blink.kill();
      bob.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === aboutEl) st.kill();
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
        {/* Glowing up arrow */}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path
            d="M14 22V6M14 6L7 13M14 6L21 13"
            stroke="#6C63FF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {/* Glow dot below arrow */}
        <div
          className="w-1.5 h-1.5 rounded-full bg-primary"
          style={{
            boxShadow: "0 0 6px rgba(108,99,255,0.6), 0 0 12px rgba(108,99,255,0.3)",
          }}
        />
      </div>
    </div>
  );
}
