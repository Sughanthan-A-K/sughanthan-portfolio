"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function isMobile() {
  return typeof window !== "undefined" && window.innerWidth < 768;
}

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

    const mobile = isMobile();

    gsap.set(el, {
      opacity: 0,
      y: mobile ? 40 : 80,
      ...(mobile ? {} : { filter: "blur(18px)" }),
    });

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
      { opacity: 0, y: mobile ? 40 : 80, ...(mobile ? {} : { filter: "blur(18px)" }) },
      { opacity: 1, y: 0, ...(mobile ? {} : { filter: "blur(0px)" }), ease: "power2.out" }
    );

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
      { opacity: 1, ...(mobile ? {} : { filter: "blur(0px)" }) },
      { opacity: 0.7, ...(mobile ? {} : { filter: "blur(6px)" }) }
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
