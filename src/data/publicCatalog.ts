import { Collection } from '../types';
import { COLLECTIONS as ORIGINAL_COLLECTIONS, LOCAL_CATALOG as ORIGINAL_CATALOG } from './catalog';
import type { CollectionMeta } from './catalog';
import { withPublicDescriptions } from './publicDressCopy';
export { withPublicDescriptions } from './publicDressCopy';

/** Public projection only. Original seed records, DB rows and image files remain intact. */
export const LOCAL_CATALOG = withPublicDescriptions(ORIGINAL_CATALOG);

export const COLLECTIONS: CollectionMeta[] = ORIGINAL_COLLECTIONS.map((meta) =>
  meta.collection === Collection.ANNA
    ? {
        ...meta,
        cover: LOCAL_CATALOG.find((dress) => dress.collection === Collection.ANNA && dress.name === 'Anais')!.imageUrl,
      }
    : meta
);

export const collectionBySlug = (value?: string): CollectionMeta | undefined =>
  COLLECTIONS.find((item) => item.slug === (value || '').toLowerCase());
