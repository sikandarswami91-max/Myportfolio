import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Skills } from '../components/Skills';
import { Projects } from '../components/Projects';
import { Services } from '../components/Services';
import { Experience } from '../components/Experience';
import { Education } from '../components/Education';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { ResumeModal } from '../components/ResumeModal';
import { ProjectModal } from '../components/ProjectModal';
import { BackgroundEffects } from '../components/BackgroundEffects';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { WHATSAPP_URL } from '../data/portfolioData';
import { ThemeMode, Project } from '../types';

export const PublicHome: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'light';
  });

  const [resumeOpen, setResumeOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeSection, setActiveSection] = useState<string>('home');
  const location = useLocation();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Handle URL route changes (e.g. /about, /projects, /resume)
  useEffect(() => {
    const path = location.pathname.replace('/', '') || 'home';
    if (path === 'resume') {
      setResumeOpen(true);
      setActiveSection('home');
    } else {
      setActiveSection(path);
      const el = document.getElementById(path);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className={`min-h-screen relative font-sans transition-colors duration-300 ${
      theme === 'dark' ? 'bg-neutral-950 text-neutral-100' : 'bg-neutral-50 text-neutral-900'
    }`}>
      {/* Dynamic Background Grid & Particles */}
      <BackgroundEffects theme={theme} />

      {/* Navigation Header */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenResume={() => setResumeOpen(true)}
        activeSection={activeSection}
      />

      <main className="relative z-10">
        <section id="home">
          <Hero theme={theme} onOpenResume={() => setResumeOpen(true)} />
        </section>

        <section id="about">
          <About theme={theme} />
        </section>

        <section id="skills">
          <Skills theme={theme} />
        </section>

        <section id="projects">
          <Projects
            theme={theme}
            onSelectProject={(p) => setSelectedProject(p)}
          />
        </section>

        <section id="services">
          <Services theme={theme} />
        </section>

        <section id="experience">
          <Experience theme={theme} />
        </section>

        <section id="education">
          <Education theme={theme} />
        </section>

        <section id="contact">
          <Contact theme={theme} />
        </section>
      </main>

      <Footer theme={theme} onOpenResume={() => setResumeOpen(true)} />

      {/* Single floating WhatsApp click-to-chat button (public pages only).
          - z-40: beneath the navbar/toasts/modals (z-50), above page content
          - bottom-right 48px touch target (meets 44px minimum on mobile)
          - toast container is pointer-events-none, so taps pass through
          - wa.me opens the WhatsApp app on mobile, web handler on desktop */}
      <motion.a
        id="floating-whatsapp-btn"
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-5 right-5 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-[#25D366] hover:bg-[#1FB855] text-white shadow-xl shadow-[#25D366]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
        title="Chat with me on WhatsApp"
        aria-label="Chat with me on WhatsApp"
      >
        <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7" />
      </motion.a>

      {/* Interactive Modals */}
      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
        theme={theme}
      />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        theme={theme}
      />
    </div>
  );
};
