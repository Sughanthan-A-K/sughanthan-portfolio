"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const aiTools = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: "GitHub Copilot",
    description: "Intelligent code generation, refactoring, and auto-completion for faster development cycles.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "AI-Assisted Debugging",
    description: "Leveraging AI to identify bugs, optimize performance, and suggest clean code solutions.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    title: "Prompt Engineering",
    description: "Writing structured prompts to generate reusable components and accelerate rapid prototyping.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Productivity Boost",
    description: "Accelerating documentation, boilerplate generation, and development workflows with AI tools.",
  },
];

export default function AIAssistedDev() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ai-title",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: { trigger: ".ai-title", start: "top 85%", toggleActions: "play reverse play reverse" },
        }
      );

      gsap.fromTo(
        ".ai-card",
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          scrollTrigger: { trigger: ".ai-grid", start: "top 85%", toggleActions: "play reverse play reverse" },
        }
      );

      gsap.fromTo(
        ".ai-note",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: { trigger: ".ai-note", start: "top 90%", toggleActions: "play reverse play reverse" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="ai-dev"
      ref={sectionRef}
      className="section-padding relative"
    >
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[140px]" />

      <div className="max-w-6xl mx-auto relative">
        <div className="ai-title mb-16">
          <p className="text-primary font-mono text-sm mb-3 tracking-wider">
            {"// AI ASSISTED DEVELOPMENT"}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ color: "var(--text-primary)" }}>
            AI-Powered <span className="gradient-text">Productivity</span>
          </h2>
          <p className="mt-4 max-w-2xl text-lg" style={{ color: "var(--text-muted)" }}>
            Experienced in leveraging AI-powered developer tools to accelerate
            development, improve code quality, and deliver solutions faster.
          </p>
        </div>

        <div className="ai-grid grid sm:grid-cols-2 gap-6">
          {aiTools.map((tool) => (
            <div
              key={tool.title}
              className="ai-card glass glass-hover hover-glow rounded-2xl p-8 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:bg-primary/20 transition-colors">
                {tool.icon}
              </div>
              <h3
                className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors"
                style={{ color: "var(--text-primary)" }}
              >
                {tool.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {tool.description}
              </p>
            </div>
          ))}
        </div>

        <div className="ai-note mt-10 glass rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            AI tools are used <span className="font-medium" style={{ color: "var(--text-primary)" }}>responsibly</span> to
            enhance efficiency while maintaining a strong understanding of software
            fundamentals. The focus is always on writing clean, maintainable code — AI
            accelerates the process, it doesn&apos;t replace the thinking.
          </p>
        </div>
      </div>
    </section>
  );
}
