import React, { useState, useEffect } from 'react';

/**
 * Reactive CSS media-query hook.
 * Used to keep Framer Motion entrance animations desktop-identical while making
 * them mobile-safe (horizontal slide-ins on desktop, vertical slide-ins on mobile,
 * so animated elements can never push content past the viewport edge).
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mql = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Sync once in case the query result changed between render and effect.
    setMatches(mql.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}
