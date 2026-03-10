"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  title: string;
  description: string;
  tech: string[];
  features: string[];
}

const projects: Project[] = [
  {
    title: "Event Management Platform & Child Activity Monitoring System",
    description:
      "A comprehensive platform for managing events with real-time scheduling and child activity monitoring with responsive dashboards.",
    tech: ["Next.js", "React.js", "TypeScript", "Tailwind CSS"],
    features: [
      "Responsive dashboards with real-time data",
      "Event scheduling & calendar integration",
      "Push notifications system",
      "Child activity monitoring module",
      "SSR and SSG optimization",
    ],
  },
  {
    title: "Project Management System, LMS & Recruitment System",
    description:
      "Enterprise-grade suite of applications for project tracking, learning management, and recruitment workflows.",
    tech: ["React.js", "TypeScript", "Redux", "Material UI"],
    features: [
      "Task tracking dashboards",
      "Learning modules with progress tracking",
      "Recruitment workflows & pipelines",
      "Data tables and form-driven modules",
    ],
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".projects-title",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: { trigger: ".projects-title", start: "top 85%" },
        }
      );

      gsap.fromTo(
        ".project-card",
        { y: 80, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.25,
          scrollTrigger: { trigger: ".projects-grid", start: "top 85%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="section-padding relative"
    >
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px]" />

      <div className="max-w-6xl mx-auto relative">
        <div className="projects-title mb-16">
          <p className="text-primary font-mono text-sm mb-3 tracking-wider">
            {"// PROJECTS"}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Featured <span className="gradient-text">Projects</span>
          </h2>
        </div>

        <div className="projects-grid grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="project-card group glass hover-glow rounded-2xl overflow-hidden"
            >
              {/* Gradient top bar */}
              <div className="h-1 w-full bg-gradient-to-r from-primary to-accent" />

              <div className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
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
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {project.title}
                  </h3>
                </div>

                <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 text-xs font-mono rounded-lg bg-primary/10 text-primary border border-primary/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <ul className="space-y-2">
                  {project.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <svg
                        className="w-4 h-4 text-accent mt-0.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
