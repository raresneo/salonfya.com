import { useCallback, useEffect, useState } from 'react';

const KEY = 'fya_wishlist';
const EVENT = 'fya:wishlist';

const read = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
};

const write = (ids: string[]) => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // localStorage plin sau blocat, wishlist-ul rămâne doar în memorie
  }
  window.dispatchEvent(new CustomEvent(EVENT));
};

/**
 * Lista de rochii salvate de mireasă, ținută local în browser.
 * Se sincronizează între componente printr-un event propriu, ca să nu avem
 * nevoie de context sau state manager pentru atât.
 */
export const useWishlist = () => {
  const [ids, setIds] = useState<string[]>(read);

  useEffect(() => {
    const sync = () => setIds(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const toggle = useCallback((id: string): boolean => {
    const current = read();
    const exists = current.includes(id);
    write(exists ? current.filter((item) => item !== id) : [...current, id]);
    return !exists;
  }, []);

  const clear = useCallback(() => write([]), []);
  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, count: ids.length, toggle, clear, has };
};
