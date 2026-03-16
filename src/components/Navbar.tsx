"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { useTheme, COLOR_SCHEMES } from "./ThemeProvider";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "AI Dev", href: "#ai-dev" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

function SettingsPanel({
  size = "desktop",
  onOpenChange,
}: {
  size?: "desktop" | "mobile";
  onOpenChange?: (open: boolean) => void;
}) {
  const { theme, toggleTheme, colorScheme, setColorScheme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [colorIndex, setColorIndex] = useState(-1);
  const [focusedBtn, setFocusedBtn] = useState(-1);
  const panelRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef({ settingsOpen, paletteOpen, colorIndex, focusedBtn });
  stateRef.current = { settingsOpen, paletteOpen, colorIndex, focusedBtn };

  const iconSize = size === "desktop" ? "w-[18px] h-[18px]" : "w-[16px] h-[16px]";
  const btnSize = size === "desktop" ? "w-9 h-9" : "w-8 h-8";

  const closeAll = useCallback(() => {
    setSettingsOpen(false);
    setPaletteOpen(false);
    setColorIndex(-1);
    setFocusedBtn(-1);
    onOpenChange?.(false);
  }, [onOpenChange]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        closeAll();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [closeAll]);

  /* Keyboard shortcuts from SmoothScroll — only register on desktop panel */
  useEffect(() => {
    if (size === "mobile") return;

    const onSettingsToggle = () => {
      const s = stateRef.current;
      if (s.settingsOpen) closeAll();
      else { setSettingsOpen(true); setPaletteOpen(false); setFocusedBtn(0); }
    };
    const onColorOpen = () => {
      setSettingsOpen(true);
      setPaletteOpen(true);
      setFocusedBtn(1);
      const idx = COLOR_SCHEMES.findIndex((cs) => cs.id === colorScheme);
      setColorIndex(idx >= 0 ? idx : 0);
    };
    const onThemeToggle = () => { toggleTheme(); };
    const onSettingsNav = (e: Event) => {
      const s = stateRef.current;
      const key = (e as CustomEvent).detail;
      if (!s.settingsOpen) return;
      if (s.paletteOpen) return;
      if (key === "ArrowLeft") setFocusedBtn(0);
      else if (key === "ArrowRight") setFocusedBtn(1);
    };
    const onSettingsClose = () => {
      const s = stateRef.current;
      if (s.paletteOpen) {
        setPaletteOpen(false);
        setColorIndex(-1);
        setFocusedBtn(1);
      } else {
        closeAll();
      }
    };
    const onColorNav = (e: Event) => {
      const s = stateRef.current;
      const key = (e as CustomEvent).detail;
      if (!s.settingsOpen) return;
      if (key === "Enter" && !s.paletteOpen) {
        if (s.focusedBtn === 0) { toggleTheme(); }
        else if (s.focusedBtn === 1) {
          setPaletteOpen(true);
          const idx = COLOR_SCHEMES.findIndex((cs) => cs.id === colorScheme);
          setColorIndex(idx >= 0 ? idx : 0);
        }
        return;
      }
      if (!s.paletteOpen) return;
      if (key === "ArrowDown") {
        setColorIndex((prev) => Math.min(COLOR_SCHEMES.length - 1, prev + 1));
      } else if (key === "ArrowUp") {
        setColorIndex((prev) => Math.max(0, prev - 1));
      } else if (key === "Enter" && s.colorIndex >= 0 && s.colorIndex < COLOR_SCHEMES.length) {
        setColorScheme(COLOR_SCHEMES[s.colorIndex].id);
        closeAll();
      }
    };
    window.addEventListener("kb-settings-toggle", onSettingsToggle);
    window.addEventListener("kb-color-open", onColorOpen);
    window.addEventListener("kb-theme-toggle", onThemeToggle);
    window.addEventListener("kb-settings-nav", onSettingsNav);
    window.addEventListener("kb-settings-close", onSettingsClose);
    window.addEventListener("kb-color-nav", onColorNav);
    return () => {
      window.removeEventListener("kb-settings-toggle", onSettingsToggle);
      window.removeEventListener("kb-color-open", onColorOpen);
      window.removeEventListener("kb-theme-toggle", onThemeToggle);
      window.removeEventListener("kb-settings-nav", onSettingsNav);
      window.removeEventListener("kb-settings-close", onSettingsClose);
      window.removeEventListener("kb-color-nav", onColorNav);
    };
  }, [size, colorScheme, toggleTheme, setColorScheme, closeAll]);

  return (
    <div ref={panelRef} className="relative flex items-center">
      <button
        aria-label="Settings"
        onClick={() => {
          if (settingsOpen) {
            closeAll();
          } else {
            setSettingsOpen(true);
            onOpenChange?.(true);
          }
        }}
        className={`${btnSize} rounded-full glass flex items-center justify-center hover:scale-110 transition-transform duration-300 shrink-0`}
      >
        <svg
          className={`${iconSize} transition-transform duration-500 ${settingsOpen ? "rotate-90" : "rotate-0"}`}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
        {colorScheme !== "default" && (
          <span
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[var(--bg)]"
            style={{ background: "var(--color-primary)" }}
          />
        )}
      </button>

      <div
        className={`absolute top-full right-0 flex items-center gap-2 mt-1 transition-all duration-400 ease-out ${
          settingsOpen ? "opacity-100 translate-y-1 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <button
          aria-label="Toggle theme"
          onClick={() => { toggleTheme(); closeAll(); }}
          className={`${btnSize} rounded-full glass flex items-center justify-center hover:scale-110 transition-all duration-300 shrink-0 ${focusedBtn === 0 ? 'ring-2 ring-[var(--color-primary)] scale-110' : ''}`}
        >
          <svg
            className={`${iconSize} absolute transition-all duration-500 ${
              theme === "dark"
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 rotate-90 scale-0"
            }`}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          <svg
            className={`${iconSize} absolute transition-all duration-500 ${
              theme === "dark"
                ? "opacity-0 -rotate-90 scale-0"
                : "opacity-100 rotate-0 scale-100"
            }`}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        </button>

        <button
          aria-label="Color schemes"
          onClick={() => setPaletteOpen((v) => !v)}
          className={`${btnSize} rounded-full glass flex items-center justify-center hover:scale-110 transition-all duration-300 shrink-0 ${focusedBtn === 1 ? 'ring-2 ring-[var(--color-primary)] scale-110' : ''}`}
        >
          <svg
            className={`${iconSize}`}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="8" r="2" fill="var(--color-primary)" stroke="none" />
            <circle cx="8" cy="14" r="2" fill="var(--color-accent)" stroke="none" />
            <circle cx="16" cy="14" r="2" fill="var(--color-primary)" stroke="none" opacity="0.6" />
          </svg>
        </button>
      </div>

      {paletteOpen && (
        <div className="absolute top-full right-0 mt-3 py-2 rounded-xl shadow-2xl shadow-black/30 w-[min(220px,calc(100vw-2rem))] max-h-[60vh] overflow-y-auto z-[999] border" style={{ background: 'rgba(var(--bg-rgb), 0.95)', borderColor: 'var(--border-card)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)' }}>
          <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-[var(--text-dimmed)] font-medium">
            Color Scheme
          </div>
          {COLOR_SCHEMES.map((scheme, idx) => (
            <button
              key={scheme.id}
              ref={(el) => { if (idx === colorIndex && el) el.scrollIntoView({ block: "nearest", behavior: "smooth" }); }}
              onClick={() => {
                setColorScheme(scheme.id);
                closeAll();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors duration-200 hover:bg-[var(--bg-card-hover)] ${
                idx === colorIndex
                  ? "bg-[var(--bg-card-hover)] text-[var(--text-primary)]"
                  : colorScheme === scheme.id
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-muted)]"
              }`}
            >
              <span className="flex items-center gap-1 shrink-0">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ background: scheme.primary, border: '1px solid var(--border-card)' }}
                />
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ background: scheme.accent, border: '1px solid var(--border-card)' }}
                />
              </span>
              <span className="truncate">{scheme.label}</span>
              {colorScheme === scheme.id && (
                <svg className="w-4 h-4 ml-auto shrink-0" fill="none" stroke="var(--color-primary)" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);

    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
    );

    // Track active section via IntersectionObserver
    const sectionIds = navLinks.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === "hero") {
              setActiveSection("");
            } else {
              setActiveSection(entry.target.id);
            }
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    const heroEl = document.getElementById("hero");
    if (heroEl) observer.observe(heroEl);
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleRopeClick = () => setActiveSection("");
    window.addEventListener("rope-click", handleRopeClick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("rope-click", handleRopeClick);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      window.dispatchEvent(new CustomEvent("mobile-menu-open"));
    } else {
      document.body.style.overflow = "";
      window.dispatchEvent(new CustomEvent("mobile-menu-close"));
    }
    return () => {
      document.body.style.overflow = "";
      window.dispatchEvent(new CustomEvent("mobile-menu-close"));
    };
  }, [mobileOpen]);

  return (
    <>
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 opacity-0 transition-all duration-500 border-0 ${
        scrolled
          ? "glass !border-0 py-3 shadow-lg shadow-black/10"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <a
          href="#"
          className="text-xl font-bold gradient-text tracking-tight"
        >
          &lt;SAK /&gt;
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                className="text-sm transition-colors duration-300 relative text-[var(--text-muted)] dark:hover:!text-white hover:!text-primary"
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-primary to-accent transition-all duration-300 ${
                    isActive ? "w-full" : "w-0"
                  }`}
                />
              </a>
            );
          })}

          <SettingsPanel size="desktop" />
        </div>

        <div className="md:hidden flex items-center gap-2 sm:gap-3 z-50">
          <SettingsPanel size="mobile" onOpenChange={setMobileSettingsOpen} />

          <button
            aria-label="Toggle menu"
            className="flex flex-col gap-1.5 justify-center items-center w-10 h-10"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span
              className={`w-6 h-0.5 transition-all duration-300 ${
                mobileOpen ? "rotate-45 translate-y-2" : ""
              }`}
              style={{ background: "var(--color-primary)" }}
            />
            <span
              className={`w-6 h-0.5 transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
              style={{ background: "var(--color-primary)" }}
            />
            <span
              className={`w-6 h-0.5 transition-all duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
              style={{ background: "var(--color-primary)" }}
            />
          </button>
        </div>
      </div>

    </nav>

    <div
      className={`md:hidden fixed inset-0 z-[39] transition-all duration-300 ${
        mobileSettingsOpen && !mobileOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      style={{
        background: "rgba(var(--bg-rgb), 0.4)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      onClick={() => setMobileSettingsOpen(false)}
    />

    <div
      className={`md:hidden fixed inset-0 z-[45] flex flex-col items-center justify-center gap-6 transition-all duration-500 px-6 ${
        mobileOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      style={{
        background: "rgba(var(--bg-rgb), 0.85)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
      }}
    >
      {navLinks.map((link) => {
        const isActive = activeSection === link.href.slice(1);
        return (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className={`text-xl sm:text-2xl font-medium transition-colors duration-300 py-1 ${
              isActive
                ? "text-[var(--color-primary)]"
                : "text-[var(--text-muted)] hover:text-[var(--color-primary)]"
            }`}
          >
            {link.label}
          </a>
        );
      })}
    </div>
    </>
  );
}
