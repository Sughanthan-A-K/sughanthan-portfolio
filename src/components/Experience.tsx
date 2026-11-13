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
    period: "July 2025 – Nov 2026",
    location: "Pondicherry, India",
    responsibilities: [
      "Delivered 6+ production web modules across Next.js, React, Angular 19, and Vue.js for global enterprise healthcare and CRM clients",
      "Modernized legacy iFrame architecture into Next.js App Router, slashing initial load times by 35% and elevating Core Web Vitals",
      "Engineered SSR/SSG rendering strategies and Turborepo monorepo setups, cutting pipeline bundle sizes by 25%",
      "Built 30+ reusable UI components across Tailwind and Mantine, accelerating cross-functional sprint velocity by 40%",
      "Connected 20+ secure REST endpoints, Meta Graph API webhooks, and SignalR WebSockets for live clinical/user notifications",
      "Authored comprehensive unit/integration test suites via Jest & RTL, maintaining 85%+ branch coverage across core components",
      "Embedded AI coding assistants (Copilot, ChatGPT, Claude) into daily CI/sprint workflows, boosting on-time delivery to 92%+",
    ],
  },
  {
    role: "Frontend Developer Trainee",
    company: "HEPL Pvt Ltd",
    period: "Feb 2024 – Mar 2025",
    location: "Cuddalore, India",
    responsibilities: [
      "Constructed interactive React.js/TypeScript frontend features with Redux and Material UI for B2B LMS and Recruitment systems serving 500+ users",
      "Engineered shared component libraries and modular form systems, decreasing UI inconsistencies and recurring bugs by 40%",
      "Connected RESTful endpoints for real-time task pipelines, reducing manual candidate profile data entry effort by 50%",
      "Structured mobile-first responsive layouts, verifying 100% cross-browser compatibility across desktop and mobile devices",
      "Spearheaded debugging sessions and peer code reviews across 15+ sprints to enforce clean code and strict typing standards",
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
          scrollTrigger: { trigger: ".exp-title", start: "top 85%", toggleActions: "play reverse play reverse" },
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
          scrollTrigger: { trigger: ".timeline", start: "top 80%", toggleActions: "play reverse play reverse" },
        }
      );

      gsap.fromTo(
        ".timeline-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: { trigger: ".timeline", start: "top 80%", toggleActions: "play reverse play reverse" },
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Work <span className="gradient-text">Experience</span>
          </h2>
        </div>

        <div className="timeline relative">
          <div className="timeline-line absolute left-[15px] sm:left-[19px] md:left-[23px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-primary via-accent to-primary/20 origin-top" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div key={index} className="timeline-item relative pl-10 sm:pl-12 md:pl-16">
                <div className="absolute left-[7px] sm:left-[11px] md:left-[15px] top-2 w-4 h-4 rounded-full bg-dark border-2 border-primary z-10">
                  <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                </div>

                <div className="glass glass-hover hover-glow rounded-2xl p-5 sm:p-6 md:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
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
