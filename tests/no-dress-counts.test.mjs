import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

// Cerința lui Rareș: nicăieri pe site nu scriem câte rochii are o colecție.
// Catalogul și paginile de colecție arată rochiile, fără „N modele” sau „Toate (N)”.
// Fără rețea, DB sau Pixel. Componentele reale, dependențele externe adaptate.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const loadWith = (adapters) => {
  const cache = new Map();
  const load = (path) => {
    if (cache.has(path)) return cache.get(path);
    const output = ts.transpileModule(read(path), {
      fileName: path,
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true },
    }).outputText;
    const module = { exports: {} };
    const localRequire = (name) => {
      if (Object.hasOwn(adapters, name)) return adapters[name];
      throw new Error(`Import neadaptat în test: ${path}: ${name}`);
    };
    runInNewContext(output, { module, exports: module.exports, require: localRequire, window: { matchMedia: () => ({ matches: true, addEventListener() {}, removeEventListener() {} }) } });
    cache.set(path, module.exports);
    return module.exports;
  };
  return load;
};
const collections = ['Imperial', 'Anna', 'Mayra', 'Beverly'].map((collection) => ({
  collection, slug: collection.toLowerCase(), path: `/${collection.toLowerCase()}`, note: 'notă', intro: 'intro', cover: `/images/${collection}.jpg`,
}));
const dressesFor = (counts) => Object.entries(counts).flatMap(([collection, n]) =>
  Array.from({ length: n }, (_, i) => ({ id: `${collection}-${i}`, name: `${collection} ${i}`, collection })));
const common = {
  react: React,
  'react-router-dom': {
    Link: ({ to, children, ...props }) => React.createElement('a', { href: to, ...props }, children),
    useLocation: () => ({ pathname: '/imperial' }), useParams: () => ({}),
  },
  '../lib/motion': { Reveal: ({ as = 'div', children, index, mode, ...props }) => React.createElement(as, props, children) },
  '../ui/DressCard': { __esModule: true, default: ({ dress }) => React.createElement('article', { 'data-dress': dress.id }, dress.name) },
  '../ui/HeroMedia': { __esModule: true, default: () => null },
  '../lib/seo': { collectionSeo: (meta) => meta, notFoundSeo: (path) => path, useSeo: () => {} },
};
const text = (markup) => markup.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const COUNT = /\(\s*\d+\s*\)|\b\d+\s*(rochii|rochie|modele|model)\b/i;

const renderCollection = (n) => {
  const dresses = dressesFor({ Imperial: n });
  const load = loadWith({
    ...common,
    '../data/publicCatalog': { COLLECTIONS: collections, collectionBySlug: (slug) => collections.find((c) => c.slug === slug) },
    '../lib/useCatalog': { useCollection: () => ({ dresses, loading: false }) },
  });
  return renderToStaticMarkup(React.createElement(load('src/pages/CollectionPage.tsx').default, { slug: 'imperial' }));
};
const renderIndex = (counts) => {
  const dresses = dressesFor(counts);
  const load = loadWith({
    ...common,
    '../data/catalog': { COLLECTIONS: collections },
    '../lib/useCatalog': { useCatalog: () => ({ dresses, loading: false }) },
  });
  return renderToStaticMarkup(React.createElement(load('src/pages/CollectionsIndex.tsx').default));
};

test('pagina de colecție: arată toate rochiile, fără „N modele”', () => {
  for (const n of [1, 7, 40]) {
    const markup = renderCollection(n);
    assert.equal((markup.match(/data-dress=/g) || []).length, n);
    assert.doesNotMatch(text(markup), COUNT);
  }
});

test('catalog: filtrele fără numere; filtrele colecțiilor goale rămân ascunse', () => {
  const markup = renderIndex({ Imperial: 7, Anna: 5, Mayra: 10 });
  const chips = [...markup.matchAll(/<button class="chip[^"]*">([^<]*)<\/button>/g)].map((m) => m[1].trim());
  assert.deepEqual(chips, ['Toate', 'Imperial', 'Anna', 'Mayra']);
  assert.doesNotMatch(text(markup), COUNT);
  assert.equal((markup.match(/data-dress=/g) || []).length, 22);
});

test('catalog: intro fără „Patru colecții” și fără croitorie pentru colecții', () => {
  const body = text(renderIndex({ Imperial: 1 }));
  assert.ok(body.includes('Rochii alese de noi, ajustate pe tine în atelierul din Oradea.'));
  assert.doesNotMatch(body, /Patru colecții|croite și ajustate/i);
});

test('sursele publice nu mai afișează numărători de rochii', () => {
  assert.doesNotMatch(read('src/pages/CollectionPage.tsx'), /dresses\.length\}\s*\{?\s*dresses\.length === 1|'modele'/);
  assert.doesNotMatch(read('src/pages/CollectionsIndex.tsx'), /\(\{dresses\.length\}\)|\(\{count\}\)/);
  assert.doesNotMatch(read('src/pages/Homepage.tsx'), /dresses\.length|countFor/);
});
