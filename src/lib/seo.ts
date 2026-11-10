import { useEffect } from 'react';

import type { Dress } from '../types';

/**
 * SEO per rută, aplicat în browser. Site-ul este un SPA: serverul trimite
 * același index.html pentru toate rutele, iar valorile de aici apar doar după
 * ce rulează JavaScript. Crawlerele care nu execută JS văd valorile din
 * index.html. Textele refolosesc formulări deja publice; nu adaugă promisiuni.
 */
export const SITE_ORIGIN = 'https://www.salonfya.com';

const SUFFIX = 'Salon FYA';
const BOOKING = 'Probele se fac doar pe bază de programare.';

export type SeoRobots = 'index,follow' | 'noindex,follow' | 'noindex,nofollow';

export type SeoMeta = {
  title: string;
  description: string;
  /** Calea canonică, fără host, query sau hash. */
  path: string;
  robots: SeoRobots;
};

/** Identic cu index.html, ca revenirea pe homepage să nu schimbe nimic. */
export const HOME_SEO: SeoMeta = {
  title: 'Salon FYA · Rochii de mireasă alese și ajustate în atelier, Oradea',
  description:
    'Salon de rochii de mireasă în Oradea, pe Mihail Kogălniceanu nr. 44. Rochii alese de noi, probă și ajustări în atelierul din salon. Colecțiile Imperial, Anna, Mayra și Beverly. Probe doar pe bază de programare.',
  path: '/',
  robots: 'index,follow',
};

export const normalizePath = (path: string): string => {
  const clean = (path || '/').split(/[?#]/)[0].replace(/\/{2,}/g, '/');
  const withSlash = clean.startsWith('/') ? clean : `/${clean}`;
  const trimmed = withSlash.replace(/\/+$/, '');
  return trimmed || '/';
};

export const canonicalUrl = (path: string): string => {
  const normalized = normalizePath(path);
  return normalized === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${normalized}`;
};

const ATELIER_SEO: SeoMeta = {
  title: `Atelierul · ${SUFFIX}`,
  description: `Atelierul ${SUFFIX} din Oradea, pentru rochii de mireasă și de seară. ${BOOKING}`,
  path: '/atelier',
  robots: 'index,follow',
};

const STATIC_SEO: Record<string, SeoMeta> = {
  '/': HOME_SEO,
  '/colectii': {
    title: `Toate rochiile · ${SUFFIX}`,
    description: `Toate rochiile din catalogul ${SUFFIX}: colecțiile Imperial, Anna, Mayra și Beverly. ${BOOKING}`,
    path: '/colectii',
    robots: 'index,follow',
  },
  '/atelier': ATELIER_SEO,
  // Aceeași pagină ca /atelier, deci o singură adresă canonică.
  '/despre-noi': ATELIER_SEO,
  '/programare': {
    title: `Programare probă · ${SUFFIX}`,
    description: `Programează o probă la ${SUFFIX}, Oradea. ${BOOKING}`,
    path: '/programare',
    robots: 'index,follow',
  },
  '/admin': {
    title: `Administrare · ${SUFFIX}`,
    description: 'Zonă internă.',
    path: '/admin',
    robots: 'noindex,nofollow',
  },
};

/** Doar rutele fără date proprii. Colecțiile, rochiile și 404 își setează singure SEO. */
export const staticRouteSeo = (pathname: string): SeoMeta | undefined => STATIC_SEO[normalizePath(pathname)];

export const collectionSeo = (meta: { collection: string; path: string }): SeoMeta => ({
  title: `Colecția ${meta.collection} · ${SUFFIX}`,
  description: `Rochii de mireasă din colecția ${meta.collection}, la ${SUFFIX} în Oradea. ${BOOKING}`,
  path: meta.path,
  robots: 'index,follow',
});

export const dressSeo = (dress: Pick<Dress, 'id' | 'name' | 'collection' | 'description'>): SeoMeta => ({
  title: dress.collection ? `${dress.name} · Colecția ${dress.collection} · ${SUFFIX}` : `${dress.name} · ${SUFFIX}`,
  description: dress.description || `${dress.name}, ${SUFFIX}. ${BOOKING}`,
  path: `/rochie/${encodeURIComponent(dress.id)}`,
  robots: 'index,follow',
});

export const notFoundSeo = (pathname: string): SeoMeta => ({
  title: `Pagina nu există · ${SUFFIX}`,
  description: `Pagina căutată nu există. Colecțiile ${SUFFIX} sunt în catalog.`,
  path: normalizePath(pathname),
  robots: 'noindex,follow',
});

export const unavailableDressSeo = (pathname: string): SeoMeta => ({
  title: `Model indisponibil · ${SUFFIX}`,
  description: `Modelul nu mai este în catalogul ${SUFFIX}. Restul modelelor sunt în catalog.`,
  path: normalizePath(pathname),
  robots: 'noindex,follow',
});

type SeoDocument = Pick<Document, 'head' | 'createElement'> & { title: string };

const upsertMeta = (doc: SeoDocument, attr: 'name' | 'property', key: string, content: string) => {
  let node = doc.head.querySelector(`meta[${attr}="${key}"]`);
  if (!node) {
    node = doc.createElement('meta');
    node.setAttribute(attr, key);
    doc.head.appendChild(node);
  }
  node.setAttribute('content', content);
};

/** Scrie toate câmpurile de fiecare dată, ca o pagină să nu moștenească valorile alteia. */
export const applySeo = (meta: SeoMeta, doc: SeoDocument = document): void => {
  const url = canonicalUrl(meta.path);
  doc.title = meta.title;
  upsertMeta(doc, 'name', 'description', meta.description);
  upsertMeta(doc, 'name', 'robots', meta.robots);
  upsertMeta(doc, 'property', 'og:title', meta.title);
  upsertMeta(doc, 'property', 'og:description', meta.description);
  upsertMeta(doc, 'property', 'og:url', url);

  let link = doc.head.querySelector('link[rel="canonical"]');
  // O pagină noindex nu primește canonical, ca să nu trimitem semnale contradictorii.
  if (meta.robots.startsWith('noindex')) {
    link?.remove();
    return;
  }
  if (!link) {
    link = doc.createElement('link');
    link.setAttribute('rel', 'canonical');
    doc.head.appendChild(link);
  }
  link.setAttribute('href', url);
};

/** `null` înseamnă „încă se încarcă”: păstrăm valorile curente. */
export const useSeo = (meta: SeoMeta | null): void => {
  useEffect(() => {
    if (meta) applySeo(meta);
  }, [meta?.title, meta?.description, meta?.path, meta?.robots]);
};
