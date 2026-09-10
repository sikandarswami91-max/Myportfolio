import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';
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
import { ThemeMode, Project } from '../types';

export const PublicHome: React.FC = () => {
  const location = useLocation();

  // Theme state with localStorage and system preference fallback
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('sikandar_theme') as ThemeMode;
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    }
    return 'dark';
  });

  const [activeSection, setActiveSection] = useState<string>('home');
  const [resumeOpen, setResumeOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  // Sync theme with HTML class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('sikandar_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // If visiting /about, /skills, /projects, /contact, smooth scroll there
  useEffect(() => {
    const path = location.pathname.replace('/', '').toLowerCase();
    if (path && ['about', 'skills', 'projects', 'services', 'experience', 'education', 'contact'].includes(path)) {
      setTimeout(() => {
        const el = document.getElementById(path);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  }, [location.pathname]);

  // Track active section and scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const sections = ['home', 'about', 'skills', 'projects', 'services', 'experience', 'education', 'contact'];
    const observers: IntersectionObserver[] = [];

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(sectionId);
              }
            });
          },
          { rootMargin: '-30% 0px -40% 0px', threshold: 0.1 }
        );
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`min-h-screen relative font-sans transition-colors duration-500 selection:bg-cyan-500/25 selection:text-cyan-400 ${
        theme === 'dark'
          ? 'bg-neutral-950 text-neutral-100'
          : 'bg-neutral-50 text-neutral-900'
      }`}
    >
      {/* Dynamic Background Ambient Lighting */}
      <BackgroundEffects theme={theme} />

      {/* Sticky Glassmorphic Navbar */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenResume={() => setResumeOpen(true)}
        activeSection={activeSection}
      />

      {/* Main Page Sections */}
      <main className="relative z-10">
        <Hero
          theme={theme}
          onOpenResume={() => setResumeOpen(true)}
        />

        <About theme={theme} />

        <Skills theme={theme} />

        <Projects
          theme={theme}
          onSelectProject={(proj) => setSelectedProject(proj)}
        />

        <Services
          theme={theme}
          onContactClick={() => scrollToSection('contact')}
        />

        <Experience theme={theme} />

        <Education theme={theme} />

        <Contact theme={theme} />
      </main>

      {/* Minimal VIP Footer */}
      <Footer theme={theme} />

      {/* Interactive Resume Modal */}
      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
        theme={theme}
      />

      {/* Interactive Project Details Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        theme={theme}
      />

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`fixed bottom-6 right-6 z-40 p-3 rounded-full border shadow-xl backdrop-blur-md transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
              theme === 'dark'
                ? 'bg-neutral-900/80 border-neutral-800 text-cyan-400 hover:bg-neutral-800 hover:border-cyan-500/40'
                : 'bg-white/90 border-neutral-200 text-cyan-600 hover:bg-neutral-100 hover:border-neutral-300'
            }`}
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
