"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;
    if (!dot || !ring || !glow) return;

    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      dot.style.display = "none";
      ring.style.display = "none";
      glow.style.display = "none";
      return;
    }

    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: "power2.out",
      });

      gsap.to(ring, {
        x: mouseX,
        y: mouseY,
        duration: 0.35,
        ease: "power3.out",
      });

      gsap.to(glow, {
        x: mouseX,
        y: mouseY,
        duration: 0.6,
        ease: "power3.out",
      });
    };

    const interactiveSelectors =
      "a, button, [role='button'], input, textarea, .glass-hover, .skill-category, .project-card, .edu-card, .contact-card, .about-stat, .btn-primary, .btn-outline";

    const onEnterInteractive = () => {
      gsap.to(ring, {
        scale: 1.8,
        borderColor: "rgba(var(--color-primary-rgb), 0.6)",
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(dot, {
        scale: 0.5,
        backgroundColor: "var(--color-primary)",
        duration: 0.3,
      });
      gsap.to(glow, {
        scale: 2,
        opacity: 0.15,
        duration: 0.4,
      });
    };

    const onLeaveInteractive = () => {
      gsap.to(ring, {
        scale: 1,
        borderColor: "rgba(var(--color-primary-rgb), 0.3)",
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(dot, {
        scale: 1,
        backgroundColor: "var(--color-primary)",
        duration: 0.3,
      });
      gsap.to(glow, {
        scale: 1,
        opacity: 0.08,
        duration: 0.4,
      });
    };

    const onMouseDown = () => {
      gsap.to(ring, { scale: 0.8, duration: 0.15 });
      gsap.to(dot, { scale: 1.5, duration: 0.15 });
    };

    const onMouseUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.15 });
      gsap.to(dot, { scale: 1, duration: 0.15 });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    const attachListeners = () => {
      document.querySelectorAll(interactiveSelectors).forEach((el) => {
        el.addEventListener("mouseenter", onEnterInteractive);
        el.addEventListener("mouseleave", onLeaveInteractive);
      });
    };

    attachListeners();
    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      observer.disconnect();
      document.querySelectorAll(interactiveSelectors).forEach((el) => {
        el.removeEventListener("mouseenter", onEnterInteractive);
        el.removeEventListener("mouseleave", onLeaveInteractive);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={glowRef}
        className="custom-cursor-glow pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full opacity-[0.08]"
        style={{
          background:
            "radial-gradient(circle, rgba(var(--color-primary-rgb),0.5) 0%, transparent 70%)",
        }}
      />
      <div
        ref={ringRef}
        className="custom-cursor-ring pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-[1.5px] border-primary/30"
        style={{ mixBlendMode: "difference" }}
      />
      <div
        ref={dotRef}
        className="custom-cursor-dot pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"
      />
    </>
  );
}
