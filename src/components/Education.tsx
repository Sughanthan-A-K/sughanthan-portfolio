"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const education = [
  {
    degree: "Master of Computer Applications",
    institution: "Rajiv Gandhi College of Engineering and Technology",
    period: "2021 – 2023",
    cgpa: "8.13",
  },
  {
    degree: "Bachelor of Computer Applications",
    institution: "Achariya Arts and Science College",
    period: "2018 – 2021",
    cgpa: "6.85",
  },
];

export default function Education() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".edu-title",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: { trigger: ".edu-title", start: "top 85%", toggleActions: "play reverse play reverse" },
        }
      );

      gsap.fromTo(
        ".edu-card",
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.2,
          scrollTrigger: { trigger: ".edu-grid", start: "top 85%", toggleActions: "play reverse play reverse" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="education"
      ref={sectionRef}
      className="section-padding relative"
    >
      <div className="max-w-4xl mx-auto relative">
        <div className="edu-title mb-16">
          <p className="text-primary font-mono text-sm mb-3 tracking-wider">
            {"// EDUCATION"}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
            My <span className="gradient-text">Education</span>
          </h2>
        </div>

        <div className="edu-grid grid md:grid-cols-2 gap-6">
          {education.map((edu, index) => (
            <div
              key={index}
              className="edu-card glass glass-hover hover-glow rounded-2xl p-8 relative overflow-hidden"
            >
              {/* Decorative corner gradient */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent" />

              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                    />
                  </svg>
                </div>

                <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {edu.degree}
                </h3>
                <p className="text-primary text-sm font-medium mb-3">
                  {edu.institution}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <span className="font-mono" style={{ color: 'var(--text-dimmed)' }}>{edu.period}</span>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs">
                    CGPA: {edu.cgpa}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
