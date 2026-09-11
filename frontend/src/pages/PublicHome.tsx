import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
