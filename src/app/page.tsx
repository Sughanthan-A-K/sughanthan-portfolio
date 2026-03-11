import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import AIAssistedDev from "@/components/AIAssistedDev";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import DevApproach from "@/components/DevApproach";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <ScrollReveal>
        <About />
      </ScrollReveal>
      <ScrollReveal>
        <Skills />
      </ScrollReveal>
      <ScrollReveal>
        <AIAssistedDev />
      </ScrollReveal>
      <ScrollReveal>
        <Experience />
      </ScrollReveal>
      <ScrollReveal>
        <Projects />
      </ScrollReveal>
      <ScrollReveal>
        <DevApproach />
      </ScrollReveal>
      <ScrollReveal>
        <Education />
      </ScrollReveal>
      <ScrollReveal>
        <Contact />
      </ScrollReveal>
      <Footer />
    </main>
  );
}
