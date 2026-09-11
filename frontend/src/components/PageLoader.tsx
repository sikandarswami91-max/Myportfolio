import React from 'react';

/**
 * Full-screen loading fallback shown while a lazy-loaded route chunk
 * is being fetched. Styled consistently with the existing loading UI
 * in ProtectedRoute and ProjectDetails.
 */
export const PageLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-neutral-400 font-medium tracking-wide">Loading...</p>
      </div>
    </div>
  );
};