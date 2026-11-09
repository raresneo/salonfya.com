import type { Dress } from '../types';

/** Exact collection/model pairs approved on 2026-11-09. Never match by name alone. */
export const UNAVAILABLE_MODELS = [
  ['Imperial', 'Alma'],
  ['Imperial', 'Ivory Grace'],
  ['Imperial', 'Lumiere'],
  ['Imperial', 'Mayson'],
  ['Imperial', 'Queen'],
  ['Anna', 'Anamaria'],
  ['Anna', 'Anaria'],
  ['Anna', 'Anatolia'],
  ['Anna', 'Anavelle'],
  ['Anna', 'Anelie'],
  ['Anna', 'Annabelle'],
  ['Anna', 'Annette'],
  ['Anna', 'Just Anna'],
  ['Mayra', 'Desideria'],
  ['Mayra', 'Miracle'],
  ['Beverly', 'Aveline'],
  ['Beverly', 'Cediz'],
  ['Beverly', 'Celestia'],
  ['Beverly', 'Fyona'],
  ['Beverly', 'Solea'],
  ['Beverly', 'Valensia'],
] as const;

const normalize = (value: string): string =>
  value.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').toLowerCase();

const key = (collection: string, name: string): string =>
  JSON.stringify([normalize(collection), normalize(name)]);

const unavailable = new Set(UNAVAILABLE_MODELS.map(([collection, name]) => key(collection, name)));

export const isUnavailableDress = (dress: Pick<Dress, 'collection' | 'name'>): boolean =>
  Boolean(dress.collection && unavailable.has(key(dress.collection, dress.name)));

export const filterAvailableDresses = <T extends Pick<Dress, 'collection' | 'name'>>(dresses: readonly T[]): T[] =>
  dresses.filter((dress) => !isUnavailableDress(dress));

/** Unknown, withdrawn and duplicate IDs must never reach a booking or its counters. */
export const retainAvailableWishlistIds = (
  ids: readonly string[],
  dresses: readonly Pick<Dress, 'id' | 'collection' | 'name'>[]
): string[] => {
  const allowed = new Set(filterAvailableDresses(dresses).map((dress) => dress.id));
  return [...new Set(ids)].filter((id) => allowed.has(id));
};
