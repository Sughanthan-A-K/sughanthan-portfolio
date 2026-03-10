"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  responsibilities: string[];
}

const experiences: ExperienceItem[] = [
  {
    role: "Associate Software Engineer",
    company: "Tender Software India Pvt Ltd",
    period: "2025 – Present",
    location: "Pondicherry, India",
    responsibilities: [
      "Developed scalable applications using React.js, Next.js, TypeScript, Tailwind",
      "Migrated iFrame modules to modern Next.js architecture",
      "Implemented SSR and SSG for performance optimization",
      "Built reusable components with clean architecture",
      "Integrated REST APIs for dynamic data fetching",
      "Participated in peer code reviews and best-practice discussions",
    ],
  },
  {
    role: "Trainee Developer",
    company: "HEPL Pvt Ltd",
    period: "2024 – 2025",
    location: "Cuddalore, India",
    responsibilities: [
      "Developed enterprise web modules using React.js, TypeScript, Redux",
      "Built reusable UI components for consistent design systems",
      "Integrated REST APIs for seamless data flow",
      "Worked on LMS, Project Management, and Recruitment systems",
    ],
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".exp-title",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: { trigger: ".exp-title", start: "top 85%" },
        }
      );

      gsap.fromTo(
        ".timeline-item",
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.3,
          scrollTrigger: { trigger: ".timeline", start: "top 80%" },
        }
      );

      gsap.fromTo(
        ".timeline-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: { trigger: ".timeline", start: "top 80%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="section-padding relative"
    >
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[140px]" />

      <div className="max-w-4xl mx-auto relative">
        <div className="exp-title mb-16">
          <p className="text-primary font-mono text-sm mb-3 tracking-wider">
            {"// EXPERIENCE"}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Work <span className="gradient-text">Experience</span>
          </h2>
        </div>

        <div className="timeline relative">
          {/* Vertical line */}
          <div className="timeline-line absolute left-[18px] md:left-[22px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-primary via-accent to-primary/20 origin-top" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div key={index} className="timeline-item relative pl-14 md:pl-16">
                {/* Dot */}
                <div className="absolute left-2.5 md:left-3.5 top-2 w-4 h-4 rounded-full bg-dark border-2 border-primary z-10">
                  <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                </div>

                <div className="glass glass-hover hover-glow rounded-2xl p-8">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {exp.role}
                      </h3>
                      <p className="text-primary font-medium">{exp.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
                        {exp.period}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-dimmed)' }}>{exp.location}</p>
                    </div>
                  </div>

                  <ul className="space-y-2.5 mt-4">
                    {exp.responsibilities.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
