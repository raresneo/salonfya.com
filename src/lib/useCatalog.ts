import { useEffect, useMemo, useState } from 'react';

import { Collection, Dress, DressType } from '../types';
import { LOCAL_CATALOG } from '../data/catalog';
import { isSupabaseConfigured, supabase } from './supabase';

/**
 * Normalizează valoarea colecției venită din baza de date.
 *
 * În `dresses.collection_id` stăm cu 'IMPERIAL', iar enum-ul din aplicație e
 * 'Imperial'. Comparația directă returna mereu fals, deci paginile de colecție
 * apăreau goale chiar și cu rochii în tabelă.
 */
const normalizeCollection = (value?: string | null): Collection | undefined => {
  const key = (value || '').trim().toUpperCase();
  if (!key) return undefined;
  if (key.includes('IMPERIAL')) return Collection.IMPERIAL;
  if (key.includes('BEVERLY')) return Collection.BEVERLY;
  if (key.includes('MAYRA')) return Collection.MAYRA;
  if (key.includes('ANNA')) return Collection.ANNA;
  return undefined;
};

const asArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.length > 0) : [];

const mapRow = (row: Record<string, any>): Dress => {
  const images = asArray(row.images);
  const cover = row.image_url || images[0] || '';

  return {
    id: String(row.id),
    name: row.name || 'Rochie',
    description: row.description || '',
    price: row.price ?? undefined,
    rentPrice: row.rent_price ?? undefined,
    type: row.type === DressType.RENT ? DressType.RENT : DressType.BUY,
    currency: row.currency || 'RON',
    imageUrl: cover,
    images: images.length > 0 ? images : cover ? [cover] : [],
    sketches: asArray(row.sketches),
    sizes: asArray(row.sizes),
    colors: asArray(row.colors),
    collection: normalizeCollection(row.collection_id),
    details:
      row.fabric || row.silhouette || row.neckline
        ? {
            fabric: row.fabric || '',
            silhouette: row.silhouette || '',
            neckline: row.neckline || '',
          }
        : undefined,
  };
};

/**
 * Scoate duplicatele, pe id și pe fotografia de copertă.
 *
 * A doua verificare contează: în repo existau modele cu nume diferite dar cu
 * exact aceleași fișiere (Elia era Daiana redenumită, Evora apărea și în
 * Beverly). Dacă cineva reintroduce așa ceva din /admin, gridul nu o mai
 * afișează de două ori.
 */
const dedupe = (list: Dress[]): Dress[] => {
  const seenIds = new Set<string>();
  const seenCovers = new Set<string>();
  const out: Dress[] = [];

  for (const dress of list) {
    const cover = (dress.imageUrl || '').toLowerCase();
    if (seenIds.has(dress.id)) continue;
    if (cover && seenCovers.has(cover)) continue;

    seenIds.add(dress.id);
    if (cover) seenCovers.add(cover);
    out.push(dress);
  }

  return out;
};

export type CatalogState = {
  dresses: Dress[];
  loading: boolean;
  /** De unde vin datele afișate acum. */
  source: 'db' | 'local';
  /** Setat doar când Supabase a răspuns cu eroare; afișarea continuă din local. */
  warning?: string;
};

const LOCAL = dedupe(LOCAL_CATALOG);

/**
 * Catalogul afișat pe site.
 *
 * Ordinea de preferință: Supabase (ce editează echipa din /admin), apoi
 * catalogul local din repo. Nu lăsăm niciodată pagina fără produse.
 */
export const useCatalog = (): CatalogState => {
  const [state, setState] = useState<CatalogState>({
    dresses: LOCAL,
    loading: isSupabaseConfigured,
    source: 'local',
  });

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let alive = true;

    const load = async () => {
      const { data, error } = await supabase.from('dresses').select('*');
      if (!alive) return;

      if (error) {
        setState({
          dresses: LOCAL,
          loading: false,
          source: 'local',
          warning: error.message,
        });
        return;
      }

      const rows = dedupe((data || []).map(mapRow).filter((dress) => dress.images && dress.images.length > 0));

      setState({
        dresses: rows.length > 0 ? rows : LOCAL,
        loading: false,
        source: rows.length > 0 ? 'db' : 'local',
      });
    };

    load();
    return () => {
      alive = false;
    };
  }, []);

  return state;
};

/** Rochiile unei colecții, în ordinea din catalog. */
export const useCollection = (collection?: Collection) => {
  const catalog = useCatalog();
  const dresses = useMemo(
    () => (collection ? catalog.dresses.filter((dress) => dress.collection === collection) : catalog.dresses),
    [catalog.dresses, collection]
  );
  return { ...catalog, dresses };
};
