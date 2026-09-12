import React from 'react';
import { motion } from 'motion/react';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { PERSONAL_INFO, WHATSAPP_URL } from '../data/portfolioData';
import { ThemeMode } from '../types';

interface FooterProps {
  theme: ThemeMode;
  onOpenResume?: () => void;
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
          ? 'bg-neutral-950 border-neutral-800/80 text-[#A8B3C2]'
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
              <span className={`font-heading text-xl font-extrabold tracking-tight ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}>
                Sikandar<span className="text-cyan-500">.</span>
              </span>
            </a>
            <p className={`text-xs sm:text-sm font-medium ${
              isDark ? 'text-[#E2E8F0]' : 'text-neutral-500'
            }`}>
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
                  ? 'border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-[#E2E8F0] hover:text-white'
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
                  ? 'border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-[#E2E8F0] hover:text-white'
                  : 'border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 hover:text-black shadow-sm'
              }`}
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>

            {/* WhatsApp social link — matches the existing icon-button row */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2.5 rounded-xl border transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                isDark
                  ? 'border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-[#25D366]'
                  : 'border-neutral-200 bg-white hover:bg-neutral-100 text-[#25D366] shadow-sm'
              }`}
              title="Chat with me on WhatsApp"
              aria-label="Chat with me on WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </a>

            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${
                isDark
                  ? 'border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-[#E2E8F0] hover:text-white'
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
                  ? 'border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-cyan-400'
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
        <div className={`mt-8 pt-8 border-t flex flex-col sm:flex-row items-center justify-between text-xs gap-4 text-center sm:text-left ${
          isDark ? 'border-neutral-800 text-[#A8B3C2]' : 'border-neutral-200 text-neutral-500'
        }`}>
          <p>© 2026 Sikandar. All Rights Reserved.</p>
          <p className="flex items-center gap-2">
            <span>Built with React, Framer Motion & Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
