"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SkillCategory {
  title: string;
  icon: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    icon: "⚛",
    skills: [
      "React.js",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Redux",
    ],
  },
  {
    title: "Development",
    icon: "⚙",
    skills: [
      "Component Architecture",
      "Responsive Design",
      "Performance Optimization",
      "Cross Browser Compatibility",
    ],
  },
  {
    title: "Tools",
    icon: "🛠",
    skills: ["Git", "GitHub", "Bitbucket", "VS Code", "Material UI", "Mantine"],
  },
  {
    title: "Methodologies",
    icon: "📋",
    skills: ["Agile", "Scrum", "SDLC"],
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".skills-title",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: { trigger: ".skills-title", start: "top 85%" },
        }
      );

      gsap.fromTo(
        ".skill-category",
        { y: 80, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          scrollTrigger: { trigger: ".skills-grid", start: "top 85%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="section-padding relative"
    >
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="max-w-6xl mx-auto relative">
        <div className="skills-title mb-16">
          <p className="text-primary font-mono text-sm mb-3 tracking-wider">
            {"// SKILLS"}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
            My <span className="gradient-text">Tech Stack</span>
          </h2>
        </div>

        <div className="skills-grid grid md:grid-cols-2 gap-6">
          {skillCategories.map((category) => (
            <div
              key={category.title}
              className="skill-category glass glass-hover hover-glow rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{category.icon}</span>
                <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {category.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 rounded-xl text-sm font-medium hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 cursor-default"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', color: 'var(--text-secondary)' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
