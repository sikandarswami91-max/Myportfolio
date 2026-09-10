import React from 'react';
import { motion } from 'motion/react';
import { ThemeMode } from '../types';

interface BackgroundEffectsProps {
  theme: ThemeMode;
}

export const BackgroundEffects: React.FC<BackgroundEffectsProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Subtle Grid overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isDark
            ? 'opacity-[0.12] bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px]'
            : 'opacity-[0.06] bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:32px_32px]'
        }`}
      />

      {/* Primary Ambient Gradient Orbs */}
      <motion.div
        animate={{
          x: [0, 25, 0],
          y: [0, -35, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full blur-[140px] transition-all duration-700 ${
          isDark
            ? 'bg-cyan-500/10'
            : 'bg-cyan-400/10'
        }`}
      />

      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full blur-[160px] transition-all duration-700 ${
          isDark
            ? 'bg-indigo-500/10'
            : 'bg-indigo-300/15'
        }`}
      />

      <motion.div
        animate={{
          x: [0, 20, 0],
          y: [0, 25, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`absolute -bottom-40 left-1/4 w-[650px] h-[650px] rounded-full blur-[180px] transition-all duration-700 ${
          isDark
            ? 'bg-emerald-500/08'
            : 'bg-emerald-300/10'
        }`}
      />

      {/* Subtle top edge vignette */}
      <div
        className={`absolute top-0 inset-x-0 h-40 bg-gradient-to-b ${
          isDark ? 'from-neutral-950 to-transparent' : 'from-neutral-50/80 to-transparent'
        }`}
      />
    </div>
  );
};
