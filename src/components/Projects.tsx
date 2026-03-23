"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  title: string;
  organization: string;
  description: string;
  tech: string[];
  features: string[];
}

const projects: Project[] = [
  {
    title: "Project Management Tool",
    organization: "HEPL Pvt Ltd",
    description:
      "My first project built from scratch — a full-featured task management system with multi-level task hierarchy and multiple view modes.",
    tech: ["React.js", "TypeScript", "Material UI", "Redux", "REST APIs", "Git"],
    features: [
      "Designed and built the entire UI from scratch",
      "Multi-level hierarchy: Milestone → Task List → Task → Sub Task → Macro Task → Micro Task",
      "MUI Table with Accordion for layered task display",
      "List, Grid, and Kanban views with Drag & Drop",
      "Full task flow management with status tracking",
    ],
  },
  {
    title: "Learning Management System",
    organization: "HEPL Pvt Ltd",
    description:
      "Enterprise LMS product for managing courses, learners, and assessments with role-based dashboards.",
    tech: ["React.js", "TypeScript", "Material UI", "Redux", "REST APIs"],
    features: [
      "Course and learning content management",
      "Learner progress tracking and dashboards",
      "Role-based access control and permissions",
      "Reusable UI components for consistent UX",
    ],
  },
  {
    title: "Job Recruitment System",
    organization: "HEPL Pvt Ltd",
    description:
      "Recruitment platform with rich-text JD creation, template management, and resume-based candidate data extraction.",
    tech: ["React.js", "TypeScript", "Material UI", "Rich Text Editor", "REST APIs"],
    features: [
      "Job Description editor with mail-format rich text",
      "JD template creation and management",
      "Candidate form with resume data extraction",
      "User detail forms with auto-fill from uploaded resume",
    ],
  },
  {
    title: "DJ Event Management Platform",
    organization: "Tender Software India Pvt Ltd",
    description:
      "Web platform for end-to-end DJ event booking with payment, travel costing, and digital contract generation.",
    tech: ["Next.js", "React.js", "TypeScript", "Tailwind CSS", "Google Maps API", "REST APIs"],
    features: [
      "Event booking and Event Builder with service packages",
      "Payment integration and invoice management",
      "Travel cost calculator using Google Distance Matrix API",
      "Digital contract generation for clients",
    ],
  },
  {
    title: "Child Care & Activity Monitoring",
    organization: "Tender Software India Pvt Ltd",
    description:
      "School child-care platform where teachers log child activities and parents track their child's day in real time.",
    tech: ["Next.js", "React.js", "TypeScript", "Tailwind CSS", "REST APIs", "Bitbucket"],
    features: [
      "Incident reporting with interactive body map",
      "Add new child and adult with parent linking",
      "Advanced filters for list views; center and company management",
      "Migrated legacy iFrame modules to Next.js architecture",
    ],
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    gsap.to(card, {
      rotationY: ((x - centerX) / centerX) * 6,
      rotationX: -((y - centerY) / centerY) * 6,
      duration: 0.3,
      ease: "power2.out",
      transformPerspective: 800,
    });
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".projects-title",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: { trigger: ".projects-title", start: "top 85%", toggleActions: "play reverse play reverse" },
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
          scrollTrigger: { trigger: ".projects-grid", start: "top 85%", toggleActions: "play reverse play reverse" },
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Featured <span className="gradient-text">Projects</span>
          </h2>
        </div>

        <div className="projects-grid grid md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="project-card group glass hover-glow rounded-2xl overflow-hidden will-change-transform"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Gradient top bar */}
              <div className="h-1 w-full bg-gradient-to-r from-primary to-accent" />

              <div className="p-5 sm:p-6 md:p-8">
                <div className="flex items-start gap-4 mb-2">
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
                  <div>
                    <h3 className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors" style={{ color: 'var(--text-primary)' }}>
                      {project.title}
                    </h3>
                    <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-dimmed)' }}>
                      {project.organization}
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed mb-6 mt-4" style={{ color: 'var(--text-muted)' }}>
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
