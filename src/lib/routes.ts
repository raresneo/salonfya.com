import { normalizePath } from './seo';

/** Rutele care încep cu un hero întunecat pe toată lățimea. */
const DARK_STATIC = new Set(['/', '/colectii', '/atelier', '/despre-noi', '/programare']);

/**
 * Navul folosește text deschis doar peste un hero întunecat. Lista veche nu
 * includea /colectii și /colectia/:slug, așa că acolo navul era închis la
 * culoare peste fundal închis.
 */
export const hasDarkHero = (pathname: string, collectionSlugs: readonly string[]): boolean => {
  const path = normalizePath(pathname).toLowerCase();
  if (DARK_STATIC.has(path)) return true;

  const slugs = new Set(collectionSlugs.map((slug) => slug.toLowerCase()));
  const direct = path.slice(1);
  if (direct && !direct.includes('/') && slugs.has(direct)) return true;

  const match = /^\/colectia\/([^/]+)$/.exec(path);
  if (!match) return false;
  try {
    return slugs.has(decodeURIComponent(match[1]));
  } catch {
    return false;
  }
};
