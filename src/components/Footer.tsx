import React from 'react';
import { motion } from 'motion/react';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ThemeMode } from '../types';

interface FooterProps {
  theme: ThemeMode;
}

export const Footer: React.FC<FooterProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className={`border-t transition-colors duration-300 ${
        isDark
          ? 'bg-neutral-950 border-neutral-900 text-neutral-400'
          : 'bg-neutral-50 border-neutral-200 text-neutral-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand & Subtitle */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
              }}
              className="inline-flex items-center gap-2 group focus:outline-none mb-1"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                S
              </div>
              <span className="font-heading text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Sikandar<span className="text-cyan-500">.</span>
              </span>
            </a>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium">
              MERN Stack Developer • BCA Graduate 2026
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noreferrer"
              className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${
                isDark
                  ? 'border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 hover:text-white'
                  : 'border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 hover:text-black shadow-sm'
              }`}
              aria-label="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>

            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noreferrer"
              className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${
                isDark
                  ? 'border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 hover:text-white'
                  : 'border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 hover:text-black shadow-sm'
              }`}
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>

            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${
                isDark
                  ? 'border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 hover:text-white'
                  : 'border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 hover:text-black shadow-sm'
              }`}
              aria-label="Send Email"
            >
              <Mail className="w-4 h-4" />
            </a>

            {/* Back to top button */}
            <button
              id="back-to-top-btn"
              onClick={scrollToTop}
              className={`p-2.5 rounded-xl border transition-all hover:scale-105 ml-2 ${
                isDark
                  ? 'border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-cyan-400'
                  : 'border-neutral-200 bg-white hover:bg-neutral-100 text-cyan-600 shadow-sm'
              }`}
              title="Back to top"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 dark:text-neutral-500 gap-4 text-center sm:text-left">
          <p>© 2026 Sikandar. All Rights Reserved.</p>
          <p className="flex items-center gap-2">
            <span>Built with React, Framer Motion & Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
