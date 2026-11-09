import { useCallback, useEffect, useMemo, useState } from 'react';

import { retainAvailableWishlistIds } from '../data/catalogAvailability';
import { useCatalog } from './useCatalog';

const KEY = 'fya_wishlist';
const EVENT = 'fya:wishlist';

const read = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
};

const write = (ids: string[]) => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // Storage is optional; event synchronization still works when writes are blocked.
  }
  window.dispatchEvent(new CustomEvent(EVENT));
};

/** Only current public catalog IDs are exposed to counters, dress pages and Programare. */
export const useWishlist = () => {
  const { dresses, loading } = useCatalog();
  const [storedIds, setStoredIds] = useState<string[]>(read);
  const ids = useMemo(() => retainAvailableWishlistIds(storedIds, dresses), [storedIds, dresses]);

  useEffect(() => {
    const sync = () => setStoredIds(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    // Do not erase valid database UUIDs while the initial local fallback is loading.
    if (loading) return;
    const current = read();
    const clean = retainAvailableWishlistIds(current, dresses);
    if (JSON.stringify(current) !== JSON.stringify(clean)) write(clean);
  }, [dresses, loading, storedIds]);

  const toggle = useCallback((id: string): boolean => {
    const current = retainAvailableWishlistIds(read(), dresses);
    if (!dresses.some((dress) => dress.id === id)) {
      write(current);
      return false;
    }
    const exists = current.includes(id);
    write(exists ? current.filter((item) => item !== id) : [...current, id]);
    return !exists;
  }, [dresses]);

  const clear = useCallback(() => write([]), []);
  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, count: ids.length, toggle, clear, has };
};
