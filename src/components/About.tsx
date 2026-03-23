"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-title",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: ".about-title",
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      gsap.fromTo(
        ".about-card",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: ".about-card",
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      gsap.fromTo(
        ".about-stat",
        { y: 40, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".about-stats",
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    }, sectionRef);

    const titleEl = sectionRef.current?.querySelector(".about-title");
    const arrowEl = arrowRef.current;
    let updateArrow: (() => void) | null = null;

    if (titleEl && arrowEl) {
      arrowEl.style.opacity = '0';
      arrowEl.style.visibility = 'hidden';

      updateArrow = () => {
        const hero = document.getElementById("hero");
        if (!hero) return;
        const heroRect = hero.getBoundingClientRect();
        const titleRect = titleEl.getBoundingClientRect();
        // Show only when hero is fully gone AND about title hasn't reached the top yet
        if (heroRect.bottom <= 0 && titleRect.top > 64) {
          arrowEl.style.opacity = '1';
          arrowEl.style.visibility = 'visible';
        } else {
          arrowEl.style.opacity = '0';
          arrowEl.style.visibility = 'hidden';
        }
      };

      window.addEventListener('scroll', updateArrow, { passive: true });
      updateArrow();
    }

    return () => {
      if (updateArrow) window.removeEventListener('scroll', updateArrow);
      ctx.revert();
    };
  }, []);

  const stats = [
    { value: "1+", label: "Years Experience" },
    { value: "5+", label: "Production Modules" },
    { value: "8+", label: "Technologies" },
    { value: "100%", label: "Commitment" },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-padding relative pt-8 sm:pt-12"
    >
      <div className="max-w-6xl mx-auto">
        <div
          ref={arrowRef}
          className="hidden sm:flex justify-center mb-4 cursor-pointer"
          style={{ opacity: 0, visibility: 'hidden' }}
          onClick={() => window.dispatchEvent(new CustomEvent("rope-click"))}
        >
          <div className="flex flex-col items-center -space-y-2">
            <svg className="w-5 h-5 animate-bounce" style={{ color: 'var(--color-primary)', opacity: 0.3, animationDelay: '0s' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
            <svg className="w-5 h-5 animate-bounce" style={{ color: 'var(--color-primary)', opacity: 0.6, animationDelay: '0.1s' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
            <svg className="w-5 h-5 animate-bounce" style={{ color: 'var(--color-accent)', opacity: 0.9, animationDelay: '0.2s' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </div>
        </div>

        <div className="about-title mb-16">
          <p className="text-primary font-mono text-sm mb-3 tracking-wider">
            {"// ABOUT ME"}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Get to know <span className="gradient-text">me</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 md:gap-8 lg:gap-10 items-start">
          <div className="about-card lg:col-span-3 glass hover-glow rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10">
            <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Associate Software Engineer with hands-on experience in planning,
              developing, testing, configuring, and maintaining web applications
              in dynamic client-driven environments. Strong proficiency in{" "}
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>React.js</span>,{" "}
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Next.js</span>,{" "}
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>TypeScript</span>, and{" "}
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>JavaScript</span>{" "}
              with the ability to translate business requirements into scalable
              technical solutions.
            </p>
            <p className="text-base sm:text-lg leading-relaxed mt-4" style={{ color: 'var(--text-muted)' }}>
              Experienced in building modern web applications, migrating legacy
              systems, developing reusable components, integrating REST APIs, and
              delivering production-ready applications. Strong analytical thinking,
              communication skills, and ability to quickly adopt new technologies
              including AI-assisted development tools.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              {["React.js", "Next.js", "TypeScript", "Tailwind CSS", "Redux"].map(
                (tech) => (
                  <span
                    key={tech}
                    className="px-4 py-1.5 rounded-full text-sm font-mono glass text-primary"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="about-stats lg:col-span-2 grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="about-stat glass glass-hover rounded-2xl p-6 text-center"
              >
                <p className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-dimmed)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
