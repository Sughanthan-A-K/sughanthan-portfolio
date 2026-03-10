"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);

    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
    );

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass py-3 shadow-lg shadow-black/10"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a
          href="#"
          className="text-xl font-bold gradient-text tracking-tight"
        >
          &lt;SAK /&gt;
        </a>

        {/* Desktop links + theme toggle */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm transition-colors duration-300 relative group"
              style={{ color: "var(--text-muted)" }}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
            </a>
          ))}

          {/* Theme toggle */}
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="relative w-9 h-9 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform duration-300"
          >
            {/* Sun icon */}
            <svg
              className={`w-[18px] h-[18px] absolute transition-all duration-500 ${
                theme === "dark"
                  ? "opacity-0 rotate-90 scale-0"
                  : "opacity-100 rotate-0 scale-100"
              }`}
              fill="none"
              stroke="#f59e0b"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
            {/* Moon icon */}
            <svg
              className={`w-[18px] h-[18px] absolute transition-all duration-500 ${
                theme === "dark"
                  ? "opacity-100 rotate-0 scale-100"
                  : "opacity-0 -rotate-90 scale-0"
              }`}
              fill="none"
              stroke="#a78bfa"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          </button>
        </div>

        {/* Mobile toggle + theme */}
        <div className="md:hidden flex items-center gap-3 z-50">
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full glass flex items-center justify-center"
          >
            <svg
              className={`w-[16px] h-[16px] absolute transition-all duration-500 ${
                theme === "dark"
                  ? "opacity-0 rotate-90 scale-0"
                  : "opacity-100 rotate-0 scale-100"
              }`}
              fill="none"
              stroke="#f59e0b"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
            <svg
              className={`w-[16px] h-[16px] absolute transition-all duration-500 ${
                theme === "dark"
                  ? "opacity-100 rotate-0 scale-100"
                  : "opacity-0 -rotate-90 scale-0"
              }`}
              fill="none"
              stroke="#a78bfa"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          </button>

          <button
            aria-label="Toggle menu"
            className="flex flex-col gap-1.5"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span
              className={`w-6 h-0.5 transition-all duration-300 ${
                mobileOpen ? "rotate-45 translate-y-2" : ""
              }`}
              style={{ background: "var(--text-primary)" }}
            />
            <span
              className={`w-6 h-0.5 transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
              style={{ background: "var(--text-primary)" }}
            />
            <span
              className={`w-6 h-0.5 transition-all duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
              style={{ background: "var(--text-primary)" }}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-0 backdrop-blur-xl flex flex-col items-center justify-center gap-8 transition-all duration-500 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "var(--mobile-bg)" }}
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className="text-2xl transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
