import type { Dress } from '../types';
import { filterAvailableDresses } from './catalogAvailability';

/**
 * Public Romanian copy, keyed by collection AND model, independent of DB UUIDs.
 * Editorial covers are not evidence of fabric, stock or the actual fitting garment.
 * Keep the text neutral until those specifications are confirmed by the atelier.
 */
export const PUBLIC_COPY_MODELS = [
  ['Imperial', 'Argente'],
  ['Imperial', 'Aurelia'],
  ['Imperial', 'Daiana'],
  ['Imperial', 'Elia'],
  ['Imperial', 'Elise'],
  ['Imperial', 'Evora'],
  ['Imperial', 'Serena'],
  ['Anna', 'Anais'],
  ['Anna', 'Anamara'],
  ['Anna', 'Anastasia'],
  ['Anna', 'Anastea'],
  ['Anna', 'Annador'],
  ['Mayra', 'Adania'],
  ['Mayra', 'Celina'],
  ['Mayra', 'Elvira'],
  ['Mayra', 'Grazia'],
  ['Mayra', 'Isadora'],
  ['Mayra', 'Luminia'],
  ['Mayra', 'Roze'],
  ['Mayra', 'Snow'],
  ['Mayra', 'Tania'],
  ['Mayra', 'Taniana'],
  ['Beverly', 'Beauty'],
  ['Beverly', 'Bety'],
  ['Beverly', 'Candy'],
  ['Beverly', 'Marisa'],
  ['Beverly', 'Nolli'],
] as const;

const normalize = (value: string): string =>
  value.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').toLowerCase();

const key = (collection: string, name: string): string =>
  JSON.stringify([normalize(collection), normalize(name)]);

export const UNKNOWN_PUBLIC_DESCRIPTION =
  'Pentru detalii despre acest model și despre o probă, contactează atelierul Salon FYA.';

export const PUBLIC_SKETCH_NOTE = 'Schițe de prezentare pentru acest model.';

const descriptions = new Map<string, string>(
  PUBLIC_COPY_MODELS.map(([collection, name]) => [
    key(collection, name),
    `${name}, din colecția ${collection} a Salonului FYA. Pentru detalii despre model și programarea unei probe, contactează atelierul.`,
  ])
);

export const publicDressDescription = (dress: Pick<Dress, 'collection' | 'name'>): string => {
  const isAurora = dress.collection === 'Aurora' && ['CARA', 'EMMA', 'MEGAN', 'ELSA', 'EMILY', 'ESMERALDA', 'KAMILA', 'MIA', 'QUEEN', 'ROSALIE', 'SAKURA'].includes(dress.name);
  const isNoblesse = dress.collection === 'Noblesse' && /^FYA28(?:0[1-9]|[1-3][0-9]|40)$/.test(dress.name);
  if (isAurora || isNoblesse) return `${dress.name}, din colecția ${dress.collection} a Salonului FYA. Pentru detalii despre model și programarea unei probe, contactează atelierul.`;
  return dress.collection
    ? descriptions.get(key(dress.collection, dress.name)) || UNKNOWN_PUBLIC_DESCRIPTION
    : UNKNOWN_PUBLIC_DESCRIPTION;
};

/**
 * Apply after DB row mapping and to the local fallback alike. Never trust legacy
 * descriptions for public display. Unknown pairs get neutral Romanian copy, not
 * another collection's copy. Withdrawn models remain excluded.
 */
export const withPublicDescriptions = <T extends Pick<Dress, 'collection' | 'name' | 'description'>>(
  dresses: readonly T[]
): T[] =>
  filterAvailableDresses(dresses).map((dress) => ({
    ...dress,
    description: publicDressDescription(dress),
  }));
