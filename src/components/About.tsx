"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

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
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { value: "1+", label: "Years Experience" },
    { value: "5+", label: "Projects Delivered" },
    { value: "3+", label: "Technologies" },
    { value: "100%", label: "Commitment" },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-padding relative"
    >
      <div className="max-w-6xl mx-auto">
        <div className="about-title mb-16">
          <p className="text-primary font-mono text-sm mb-3 tracking-wider">
            {"// ABOUT ME"}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Get to know <span className="gradient-text">me</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          <div className="about-card lg:col-span-3 glass hover-glow rounded-2xl p-8 md:p-10">
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Associate Software Engineer with experience in developing scalable
              web applications using{" "}
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>React.js</span>,{" "}
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Next.js</span>,{" "}
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>TypeScript</span>, and{" "}
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Tailwind CSS</span>.
            </p>
            <p className="text-lg leading-relaxed mt-4" style={{ color: 'var(--text-muted)' }}>
              Experienced in migrating legacy systems, building reusable
              components, integrating REST APIs, and delivering high-performance
              applications in agile environments.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              {["React.js", "Next.js", "TypeScript", "Tailwind CSS"].map(
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
