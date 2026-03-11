"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Set initial state: blurred, shifted down, invisible
    gsap.set(el, {
      opacity: 0,
      y: 80,
      filter: "blur(18px)",
    });

    // ENTER from bottom: blur → clear, slide up, fade in
    // Also plays in reverse when scrolling back down past the trigger
    const enterTl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 92%",
        end: "top 30%",
        scrub: 1.5,
      },
    });

    enterTl.fromTo(
      el,
      { opacity: 0, y: 80, filter: "blur(18px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.out" }
    );

    // EXIT toward top: clear → blur when section scrolls past center
    // Also plays in reverse when scrolling back into view from above
    const exitTl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "bottom 30%",
        end: "bottom -10%",
        scrub: 1.5,
      },
    });

    exitTl.fromTo(
      el,
      { opacity: 1, filter: "blur(0px)" },
      { opacity: 0.7, filter: "blur(6px)" }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
