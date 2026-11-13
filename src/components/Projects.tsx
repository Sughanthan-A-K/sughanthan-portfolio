"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  title: string;
  organization: string;
  category: "Professional" | "Personal & AI Tools";
  description: string;
  tech: string[];
  features: string[];
  liveUrl?: string;
  github?: string;
}

const projects: Project[] = [
  // ── Professional Projects ──
  {
    title: "Nextdoor AI & BNI Referral Automation Platform",
    organization: "Tender Software India Pvt Ltd",
    category: "Professional",
    description:
      "AI-powered SaaS lead generation platform collecting social media posts via Playwright, classifying service requests with OpenAI, and automating BNI vendor matching.",
    tech: ["Python", "FastAPI", "Playwright", "OpenAI API", "PostgreSQL", "SQLAlchemy", "n8n Workflows", "React.js"],
    features: [
      "Engineered automated social media post scraping pipeline across Nextdoor neighborhood feeds and Facebook groups using Playwright",
      "Integrated OpenAI API classification to filter conversational noise, detect commercial intent, and match eligible BNI vendors",
      "Constructed FastAPI REST APIs, PostgreSQL/SQLAlchemy data persistence, controlled posting queues, and n8n background workflows",
    ],
  },
  {
    title: "BlueDop EHR (Electronic Health Record)",
    organization: "Tender Software India Pvt Ltd",
    category: "Professional",
    description:
      "Cloud-based healthcare provider clinical portal for streamlined patient documentation, medical appointments, and clinical diagnostics.",
    tech: ["Angular 19", "TypeScript", "RxJS", "Tailwind CSS", "Bootstrap 5", "ngx-translate"],
    features: [
      "Architected high-performance clinical dashboards utilizing Angular 19 standalone components and reactive forms",
      "Engineered multi-language clinical translation (ngx-translate) and global phone number sanitization",
      "Implemented secure clinical data export bundles generating encrypted zip archives for physician review",
    ],
  },
  {
    title: "Juzo / StockingScanner 3D Web App",
    organization: "Tender Software India Pvt Ltd",
    category: "Professional",
    description:
      "Advanced 3D medical device platform rendering USDZ limb scans with Three.js to accurately calculate customized compression stocking sizes.",
    tech: ["Three.js", "USDZ WebGL", "Angular 19", "TypeScript", "Tailwind CSS"],
    features: [
      "Integrated Three.js WebGL canvas in Angular 19 to render 3D patient limb scans with orbit controls and measurement points",
      "Engineered multi-patient database tracking scan history, precision limb measurements, and prescription portals",
      "Built multi-factor security passcode authentication and session management for healthcare practitioners",
    ],
  },
  {
    title: "EdemaTrack & EdemaTrack Clinic",
    organization: "Tender Software India Pvt Ltd",
    category: "Professional",
    description:
      "Medical diagnostic & patient monitoring suite tracking limb swelling progression via standardized camera overlays and clinical reports.",
    tech: ["Angular 16", "TypeScript", "RxJS", "Stripe SDK", "jsPDF", "SCSS"],
    features: [
      "Built in-browser camera capture module with limb alignment overlays for standardized edema progression tracking",
      "Integrated Stripe subscription checkout workflows for automated recurring therapy plans",
      "Engineered client-side clinical PDF generator (jsPDF) visualizing historical swelling reduction metrics",
    ],
  },
  {
    title: "DJ Event Management Platform (PlanningBeats)",
    organization: "Tender Software India Pvt Ltd",
    category: "Professional",
    description:
      "Web platform for end-to-end DJ event booking, interactive event builder with service packages, automated travel costing, and digital contracts.",
    tech: ["Next.js", "React.js", "TypeScript", "Tailwind CSS", "Google Distance Matrix API", "REST APIs"],
    features: [
      "Developed an event booking flow and interactive Event Builder with configurable service packages",
      "Integrated the Google Distance Matrix API for dynamic, real-time travel cost calculations",
      "Implemented automated digital contract generation and invoice management workflows",
    ],
  },
  {
    title: "Child Care & Activity Monitoring (YCD - Your Child's Day)",
    organization: "Tender Software India Pvt Ltd",
    category: "Professional",
    description:
      "School childcare and activity tracking platform enabling teachers to log real-time daily milestones and parents to monitor their child.",
    tech: ["Next.js", "React.js", "TypeScript", "Tailwind CSS", "SignalR WebSockets", "REST APIs"],
    features: [
      "Migrated legacy iFrame modules to modern Next.js architecture, cutting initial page load times by 35%",
      "Integrated Microsoft SignalR WebSocket connection for instantaneous parent-teacher activity alerts",
      "Built incident reporting UI with interactive body mapping and customizable center-level filtering",
    ],
  },
  {
    title: "Project Management Tool (PM Tool)",
    organization: "HEPL Pvt Ltd",
    category: "Professional",
    description:
      "Full-featured B2B task management system with multi-level task hierarchy, drag-and-drop Kanban, and cross-functional task tracking.",
    tech: ["React.js", "TypeScript", "Material UI", "Redux", "REST APIs"],
    features: [
      "Built a 6-level hierarchical task tracking system (Milestone → Task List → Task → Sub Task → Macro → Micro)",
      "Created high-performance Material UI data tables with accordion expansion and custom cell formatters",
      "Engineered multi-view task boards (List, Grid, and Kanban) with real-time status filtering and search",
    ],
  },
  {
    title: "Learning Management System (LMS)",
    organization: "HEPL Pvt Ltd",
    category: "Professional",
    description:
      "Enterprise LMS platform for corporate course creation, structured curriculum delivery, and student assessment tracking.",
    tech: ["React.js", "TypeScript", "Material UI", "Redux", "REST APIs"],
    features: [
      "Developed role-based dashboards for administrators, instructors, and corporate learners",
      "Engineered reusable UI components reducing cross-module frontend duplication across course modules",
      "Integrated real-time REST APIs for tracking course progress, assessment submissions, and completion certificates",
    ],
  },
  {
    title: "Job Recruitment System",
    organization: "HEPL Pvt Ltd",
    category: "Professional",
    description:
      "Talent recruitment portal featuring rich-text JD creation, template management, and automated resume parsing.",
    tech: ["React.js", "TypeScript", "Material UI", "Rich Text Editor", "REST APIs"],
    features: [
      "Constructed a rich-text Job Description editor with template storage and email-formatted exports",
      "Integrated candidate application intake forms with automated data extraction from uploaded resumes",
      "Built interactive candidate tracking workflows to manage stages from screening through interview scheduling",
    ],
  },

  // ── Personal & AI Developer Tools ──
  {
    title: "PayGenie AI — Conversational Billing Copilot",
    organization: "PayPal AI Hackathon 2026",
    category: "Personal & AI Tools",
    description:
      "Intelligent conversational billing assistant and instant payment portal turning natural language into verified invoices with PayPal Orders v2 integration.",
    tech: ["Next.js 16", "React 19", "Google Gemini SDK", "PayPal Orders v2", "TypeScript", "Tailwind CSS"],
    features: [
      "Engineered conversational billing threads supporting English, Tanglish, and Tamil using Google Gemini 3.5 Flash",
      "Integrated native PayPal Sandbox checkout and Orders v2 REST API with vector-based PDF invoice generation",
      "Implemented browser BroadcastChannel API for instantaneous real-time cross-tab settlement synchronization",
    ],
    liveUrl: "https://paygenie-ai.vercel.app/",
    github: "https://github.com/Sughanthan-A-K/paygenie-ai",
  },
  {
    title: "HTML CSS Copier — AI Developer Extension",
    organization: "Published Chrome Extension",
    category: "Personal & AI Tools",
    description:
      "Published Chromium browser extension that allows developers to extract semantic HTML and computed CSS directly into AI prompts or clean code.",
    tech: ["Chrome Extension Manifest V3", "JavaScript", "DOM Parser", "Chrome Scripting API"],
    features: [
      "Architected Manifest V3 background service workers and content scripts for real-time DOM element style extraction",
      "Implemented dual-mode output: formatted human-readable code vs. raw, token-efficient AI prompt context",
      "Published on Chrome Web Store with active-tab permissions and configurable keyboard shortcuts",
    ],
    liveUrl: "https://chromewebstore.google.com/detail/phbgicliphimpfehblfpklokoibnkhoh?utm_source=item-share-cb",
    github: "https://github.com/Sughanthan-A-K/html-css-copier",
  },
  {
    title: "Countdown 2027 — PWA Interactive Calendar",
    organization: "Personal Project",
    category: "Personal & AI Tools",
    description:
      "Interactive progressive web app with realistic 3D paper tear physics, festive card unlocks, and daily countdown push notifications.",
    tech: ["React 18", "Tailwind CSS", "Framer Motion", "Supabase", "Service Workers", "Web Push API"],
    features: [
      "Engineered realistic 3D paper-tear and drag-to-peel gesture mechanics utilizing Framer Motion physics",
      "Integrated Supabase PostgreSQL database for persistent user progress, card unlocks, and easter eggs",
      "Configured offline PWA caching and scheduled festival push notifications for global audiences",
    ],
    github: "https://github.com/Sughanthan-A-K/countdown-2027",
  },
  {
    title: "Sharey — Cross-Device Cloud Transfer",
    organization: "Personal Project",
    category: "Personal & AI Tools",
    description:
      "Secure, instant file transfer and clipboard synchronization web tool for frictionless sharing across personal devices.",
    tech: ["Next.js 15", "React", "TypeScript", "Tailwind CSS", "Supabase Storage", "Vercel"],
    features: [
      "Implemented direct multipart streaming into Supabase Storage with signed, auto-expiring download links",
      "Built real-time clipboard synchronization for text snippets and URLs with cross-device encryption",
      "Designed clean, responsive mobile-first UI with dark mode support for instant utility access",
    ],
    github: "https://github.com/Sughanthan-A-K/sharey",
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

                <ul className="space-y-2 mb-6">
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

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3 flex-wrap">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:underline font-medium"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Live Demo / Store &rarr;
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline font-medium"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                        GitHub &rarr;
                      </a>
                    )}
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
