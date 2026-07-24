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
    period: "July 2025 – Present",
    location: "Pondicherry, India",
    responsibilities: [
      "Delivered 5+ production-grade frontend modules using React.js, Next.js, TypeScript, and Tailwind CSS across multiple client-facing platforms",
      "Architected and executed migration of legacy iFrame-based modules to Next.js, reducing technical debt and improving page load performance",
      "Implemented SSR and SSG rendering strategies, achieving measurable improvements in Lighthouse performance scores, SEO rankings, and time-to-interactive",
      "Engineered a reusable, configurable UI component library adopted across all platform modules, reducing development time and enforcing design consistency",
      "Integrated REST APIs for dynamic data fetching, real-time UI updates, and seamless frontend-backend communication",
      "Enforced WCAG 2.1 accessibility standards across critical user flows using semantic HTML, ARIA attributes, and colour-contrast compliance",
      "Authored unit and integration tests using Jest and React Testing Library; participated in code reviews, sprint planning, and retrospectives within Agile/Scrum cycles",
      "Accelerated feature delivery by integrating GitHub Copilot and AI-assisted development tools, improving team velocity",
    ],
  },
  {
    role: "Trainee Developer",
    company: "HEPL Pvt Ltd",
    period: "Feb 2024 – Mar 2025",
    location: "Cuddalore, India",
    responsibilities: [
      "Built enterprise-grade React.js and TypeScript frontend modules using Redux and Material UI across 3 large-scale B2B enterprise platforms",
      "Designed and published a shared reusable component library adopted across cross-functional teams, reducing UI duplication and ensuring consistency",
      "Integrated REST APIs for real-time data processing, workflow automation, and cross-module communication across all enterprise projects",
      "Contributed to 3 major enterprise platforms: LMS (learner and course management), Project Management System (multi-level task hierarchy with Kanban), and Recruitment Management System",
      "Implemented frontend performance optimization, responsive layouts, cross-browser compatibility, and WCAG-aligned accessibility across all delivered modules",
      "Participated in functional testing and code reviews to validate component behaviour and maintain consistent production quality standards",
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
