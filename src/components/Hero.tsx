"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const techRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroEls = [
        ".hero-badge",
        titleRef.current,
        roleRef.current,
        subtitleRef.current,
        techRef.current,
        ctaRef.current,
      ];

      /* ── 1. Entrance timeline (plays once on load) ── */
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
          techRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.3"
        )
        .fromTo(
          ctaRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.3"
        );

      /* ── 2. After entrance finishes, set up 3D scroll-driven hide/show ── */
      tl.eventCallback("onComplete", () => {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "70% top",
          onEnter: () => {
            gsap.to(heroEls, {
              y: -60,
              opacity: 0,
              rotateX: -15,
              scale: 0.9,
              filter: "blur(8px)",
              transformOrigin: "center top",
              duration: 0.6,
              stagger: 0.04,
              ease: "power2.in",
              overwrite: true,
            });
          },
          onLeaveBack: () => {
            gsap.fromTo(
              heroEls,
              {
                y: 80,
                opacity: 0,
                rotateX: 25,
                scale: 0.85,
                filter: "blur(10px)",
                transformOrigin: "center bottom",
              },
              {
                y: 0,
                opacity: 1,
                rotateX: 0,
                scale: 1,
                skewY: 0,
                filter: "blur(0px)",
                duration: 0.7,
                delay: 0.35,
                stagger: 0.05,
                ease: "back.out(1.4)",
                overwrite: true,
              }
            );
          },
        });
      });

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

      <div className="relative z-10 text-center max-w-5xl mx-auto px-6" style={{ perspective: "1200px" }}>
        <div className="hero-badge opacity-0 inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Available for opportunities
        </div>

        <h1
          ref={titleRef}
          className="opacity-0 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <span style={{ color: 'var(--text-primary)' }}>Hi, I&apos;m </span>
          <span className="gradient-text">Sughanthan</span>
        </h1>

        <p
          ref={roleRef}
          className="opacity-0 text-xl sm:text-2xl md:text-3xl font-medium mb-4"
          style={{ color: 'var(--text-secondary)' }}
        >
          Associate Software Engineer
        </p>

        <p
          ref={subtitleRef}
          className="opacity-0 text-base sm:text-lg mb-6 max-w-2xl mx-auto leading-relaxed"
          style={{ color: 'var(--text-muted)' }}
        >
          I build scalable, high-performance web applications and modernize
          legacy systems using modern frontend technologies.
        </p>

        <p
          ref={techRef}
          className="opacity-0 text-sm font-mono mb-10"
          style={{ color: 'var(--text-dimmed)' }}
        >
          React.js &nbsp;|&nbsp; Next.js &nbsp;|&nbsp; TypeScript
        </p>

        <div ref={ctaRef} className="opacity-0 flex flex-col items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
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
            <a
              href="/sughanthan-portfolio/resume.html"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Resume
            </a>
            <a href="#contact" className="btn-outline">
              Contact Me
            </a>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/sughanthan-a-k"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 hover:bg-primary/10 transition-all duration-300"
              style={{ color: 'var(--text-muted)' }}
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/sughanthan-a-k"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 hover:bg-primary/10 transition-all duration-300"
              style={{ color: 'var(--text-muted)' }}
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href="mailto:a.k.sughanthan@gmail.com"
              className="w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 hover:bg-primary/10 transition-all duration-300"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Email"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
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
