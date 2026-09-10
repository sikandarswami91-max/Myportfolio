import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, FileText, ArrowRight } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { ThemeMode } from '../types';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenResume: () => void;
  activeSection: string;
}

const NAV_LINKS = [
  { name: 'Home', id: 'home', path: '/' },
  { name: 'About', id: 'about', path: '/about' },
  { name: 'Skills', id: 'skills', path: '/skills' },
  { name: 'Projects', id: 'projects', path: '/projects' },
  { name: 'Services', id: 'services', path: '/services' },
  { name: 'Experience', id: 'experience', path: '/experience' },
  { name: 'Education', id: 'education', path: '/education' },
  { name: 'Contact', id: 'contact', path: '/contact' },
];

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  onOpenResume,
  activeSection,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const isDark = theme === 'dark';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isMainPage = ['/', '/about', '/skills', '/projects', '/services', '/experience', '/education', '/contact', '/resume'].includes(location.pathname);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    const targetPath = sectionId === 'home' ? '/' : `/${sectionId}`;

    if (isMainPage) {
      navigate(targetPath, { replace: false });
      if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      // Direct navigation from sub-pages (e.g. /projects/:slug or /admin/*)
      navigate(targetPath);
    }
  };

  const handleResumeClick = () => {
    setMobileMenuOpen(false);
    navigate('/resume');
    onOpenResume();
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 transition-all duration-300">
      {/* Top Scroll Progress Indicator */}
      <div className="h-[2.5px] w-full bg-transparent overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-amber-400 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <nav
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          isScrolled ? 'pt-2 sm:pt-3' : 'pt-4 sm:pt-6'
        }`}
      >
        <div
          className={`flex items-center justify-between rounded-2xl px-4 sm:px-6 py-3 transition-all duration-300 border ${
            isDark
              ? isScrolled
                ? 'bg-neutral-900/80 backdrop-blur-xl border-neutral-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
                : 'bg-neutral-900/40 backdrop-blur-md border-neutral-800/40 shadow-none'
              : isScrolled
              ? 'bg-white/85 backdrop-blur-xl border-neutral-200/90 shadow-[0_8px_32px_rgba(0,0,0,0.08)]'
              : 'bg-white/50 backdrop-blur-md border-neutral-200/50 shadow-none'
          }`}
        >
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="group flex items-center gap-2 focus:outline-none"
            aria-label="Sikandar Home"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              S
            </div>
            <span className="font-heading text-lg sm:text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Sikandar<span className="text-cyan-500">.</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.id);
                  }}
                  className={`relative px-3 py-1.5 text-xs xl:text-sm font-medium transition-colors rounded-lg ${
                    isActive
                      ? 'text-cyan-500 dark:text-cyan-400 font-semibold'
                      : isDark
                      ? 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/40'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 inset-x-2 h-[2px] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Right Side Actions: ThemeToggle + Resume + Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

            <motion.button
              id="navbar-resume-btn"
              onClick={handleResumeClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm hover:shadow-cyan-500/25 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume</span>
            </motion.button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl lg:hidden border transition-colors ${
                isDark
                  ? 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:text-white'
                  : 'border-neutral-200 bg-neutral-100/60 text-neutral-700 hover:text-black'
              }`}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-in Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className={`lg:hidden mx-4 mt-2 rounded-2xl border overflow-hidden shadow-2xl backdrop-blur-2xl ${
              isDark
                ? 'bg-neutral-900/95 border-neutral-800 text-neutral-200'
                : 'bg-white/95 border-neutral-200 text-neutral-800'
            }`}
          >
            <div className="p-4 space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.id)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-500 font-semibold'
                        : isDark
                        ? 'hover:bg-neutral-800 text-neutral-300'
                        : 'hover:bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && <ArrowRight className="w-4 h-4 text-cyan-500" />}
                  </button>
                );
              })}

              <div className="pt-3 mt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={handleResumeClick}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                >
                  <FileText className="w-4 h-4" />
                  <span>View / Download Resume</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
