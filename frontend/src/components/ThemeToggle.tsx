import React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { ThemeMode } from '../types';

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  const isDark = theme === 'dark';

  return (
    <motion.button
      id="theme-toggle-btn"
      onClick={onToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative p-2.5 rounded-full transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
        isDark
          ? 'bg-neutral-900/90 text-amber-300 border-neutral-800 hover:border-amber-400/40 hover:bg-neutral-800'
          : 'bg-white/90 text-neutral-800 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-100 shadow-sm'
      }`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Moon className="w-4 h-4 stroke-[2.2] text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.5)]" />
        ) : (
          <Sun className="w-4 h-4 stroke-[2.2] text-amber-600" />
        )}
      </motion.div>
    </motion.button>
  );
};
