"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const contactInfo = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "Email",
    value: "a.k.sughanthan@gmail.com",
    href: "mailto:a.k.sughanthan@gmail.com",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: "Phone",
    value: "8825784607",
    href: "tel:+918825784607",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Location",
    value: "Cuddalore, India",
    href: null,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    label: "LinkedIn",
    value: "linkedin.com/in/sughanthan-a-k",
    href: "https://linkedin.com/in/sughanthan-a-k",
  },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-title",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: { trigger: ".contact-title", start: "top 85%", toggleActions: "play reverse play reverse" },
        }
      );

      gsap.fromTo(
        ".contact-card",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          scrollTrigger: { trigger: ".contact-grid", start: "top 85%", toggleActions: "play reverse play reverse" },
        }
      );

      gsap.fromTo(
        ".contact-form",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: { trigger: ".contact-form", start: "top 85%", toggleActions: "play reverse play reverse" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("_subject", "Portfolio Contact Form Submission");
    formData.append("_captcha", "false");
    formData.append("_template", "table");

    try {
      const res = await fetch("https://formsubmit.co/ajax/272626ba356ca376e024688c196b9fd8", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setSubmitted(true);
        form.reset();
        setTimeout(() => setSubmitted(false), 4000);
      }
    } catch {
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section-padding relative"
    >
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[160px]" />

      <div className="max-w-6xl mx-auto relative">
        <div className="contact-title mb-16 text-center">
          <p className="text-primary font-mono text-sm mb-3 tracking-wider">
            {"// CONTACT"}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="mt-4 max-w-md mx-auto" style={{ color: 'var(--text-dimmed)' }}>
            Feel free to reach out for collaborations, opportunities, or just a
            friendly hello!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          <div className="contact-grid space-y-4">
            {contactInfo.map((info) => {
              const Wrapper = info.href ? "a" : "div";
              const wrapperProps = info.href
                ? {
                    href: info.href,
                    target: info.href.startsWith("http") ? "_blank" : undefined,
                    rel: info.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined,
                    onClick: (e: React.MouseEvent) => {
                      if (info.href!.startsWith("mailto:") || info.href!.startsWith("tel:")) {
                        e.preventDefault();
                        window.open(info.href!, "_self");
                      }
                    },
                  }
                : {};

              return (
                <Wrapper
                  key={info.label}
                  {...wrapperProps}
                  className="contact-card glass glass-hover hover-glow rounded-xl p-5 flex items-center gap-4 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-dimmed)' }}>
                      {info.label}
                    </p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {info.value}
                    </p>
                  </div>
                </Wrapper>
              );
            })}
          </div>

          <form
            onSubmit={handleSubmit}
            className="contact-form glass rounded-2xl p-5 sm:p-6 md:p-8 space-y-5"
          >
            <div>
              <label className="text-sm mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 rounded-xl focus:border-primary/50 focus:outline-none transition-colors"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', color: 'var(--text-primary)' }}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-sm mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-xl focus:border-primary/50 focus:outline-none transition-colors"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', color: 'var(--text-primary)' }}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
                Message
              </label>
              <textarea
                name="message"
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl focus:border-primary/50 focus:outline-none transition-colors resize-none"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', color: 'var(--text-primary)' }}
                placeholder="Your message..."
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="btn-primary w-full justify-center disabled:opacity-60"
            >
              {submitted ? (
                <>
                  <svg
                    className="w-5 h-5"
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
                  Message Sent!
                </>
              ) : sending ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
