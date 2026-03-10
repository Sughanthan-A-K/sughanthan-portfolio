"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        ".hero-badge",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.8 }
      )
        .fromTo(
          titleRef.current,
          { y: 80, opacity: 0, skewY: 3 },
          { y: 0, opacity: 1, skewY: 0, duration: 1 },
          "-=0.4"
        )
        .fromTo(
          roleRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.5"
        )
        .fromTo(
          subtitleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.4"
        )
        .fromTo(
          ctaRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.3"
        );

      // Floating orbs animation
      gsap.to(".orb-1", {
        y: -30,
        x: 20,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".orb-2", {
        y: 25,
        x: -15,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".orb-3", {
        y: -20,
        x: -25,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="orb-1 absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="orb-2 absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[100px]" />
        <div className="orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[140px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Available for opportunities
        </div>

        <h1
          ref={titleRef}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <span style={{ color: 'var(--text-primary)' }}>Hi, I&apos;m </span>
          <span className="gradient-text">Sughanthan</span>
        </h1>

        <p
          ref={roleRef}
          className="text-xl sm:text-2xl md:text-3xl font-medium mb-4"
          style={{ color: 'var(--text-secondary)' }}
        >
          Associate Software Engineer
        </p>

        <p
          ref={subtitleRef}
          className="text-base sm:text-lg font-mono mb-10 max-w-2xl mx-auto"
          style={{ color: 'var(--text-dimmed)' }}
        >
          React.js &nbsp;|&nbsp; Next.js &nbsp;|&nbsp; TypeScript Developer
        </p>

        <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-4">
          <a href="#projects" className="btn-primary">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            View Projects
          </a>
          <a href="#contact" className="btn-outline">
            Contact Me
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ color: 'var(--text-dimmed)' }}>
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-5 h-8 rounded-full border flex justify-center pt-2" style={{ borderColor: 'var(--border-card)' }}>
          <div className="w-1 h-2 rounded-full animate-bounce" style={{ background: 'var(--text-dimmed)' }} />
        </div>
      </div>
    </section>
  );
}
