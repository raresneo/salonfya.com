import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/** Citire sincronă, ca primul render să nu pornească un video care apoi dispare. */
export const readReducedMotion = (): boolean =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(QUERY).matches;

/** Preferința de sistem, actualizată dacă utilizatorul o schimbă cu pagina deschisă. */
export const useReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(readReducedMotion);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia(QUERY);
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener?.('change', sync);
    return () => media.removeEventListener?.('change', sync);
  }, []);

  return reduced;
};
