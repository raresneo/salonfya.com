import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

// Fără browser, rețea, DB sau Pixel: randăm componentele reale pe server.
const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const STREET = 'Mihail Kogălniceanu nr. 44';
const ADDRESS = `${STREET}, Oradea`;
const FULL = `${ADDRESS}, Bihor`;
const OLD = /Alecsandri|410072|Vasile\+|Vasile%20/i;
const collections = ['Imperial', 'Anna', 'Mayra', 'Beverly'].map((collection) => ({
  collection, slug: collection.toLowerCase(), path: `/${collection.toLowerCase()}`,
}));
const cache = new Map();
const blocked = () => { throw new Error('Testul nu permite servicii externe sau scrieri.'); };
const adapters = {
  react: React,
  'react-router-dom': {
    Link: ({ to, children, ...props }) => React.createElement('a', { href: to, ...props }, children),
    useSearchParams: () => [new URLSearchParams()],
  },
  'react-facebook-pixel': { track: blocked },
  '../lib/motion': {
    Reveal: ({ as = 'div', children, index, mode, ...props }) => React.createElement(as, props, children),
    SmartImage: (props) => React.createElement('img', props),
  },
  '../lib/useCatalog': { useCatalog: () => ({ dresses: [] }) },
  '../lib/useWishlist': { useWishlist: () => ({ ids: [], clear: blocked }) },
  '../lib/supabase': { isSupabaseConfigured: true, supabase: { from: blocked } },
  '../data/catalog': { COLLECTIONS: collections },
};
const load = (path) => {
  if (cache.has(path)) return cache.get(path);
  const output = ts.transpileModule(read(path), {
    fileName: path,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.React, esModuleInterop: true,
    },
  }).outputText;
  const module = { exports: {} };
  const localRequire = (name) => {
    if (name === '../data/salon') return load('src/data/salon.ts');
    if (Object.hasOwn(adapters, name)) return adapters[name];
    throw new Error(`Import neadaptat în test: ${path}: ${name}`);
  };
  runInNewContext(output, { module, exports: module.exports, require: localRequire, URLSearchParams });
  cache.set(path, module.exports);
  return module.exports;
};
const { SALON } = load('src/data/salon.ts');
const seo = load('src/lib/seo.ts');
const html = read('index.html');
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
const render = (path) => renderToStaticMarkup(React.createElement(load(path).default));

test('adresa actuală are diacritice, nr. 44 și orașul corect', () => {
  assert.equal(SALON.street, STREET);
  assert.equal(SALON.address, ADDRESS);
  assert.equal(SALON.addressFull, FULL);
  assert.equal(SALON.city, 'Oradea');
  assert.equal(SALON.county, 'Bihor');
});

test('nu se păstrează cod poștal sau coordonate neverificate în configurație/schema', () => {
  assert.equal('postalCode' in SALON, false);
  assert.equal('geo' in SALON, false);
  assert.equal('latitude' in SALON, false);
  assert.equal('longitude' in SALON, false);
  assert.equal('postalCode' in schema.address, false);
  assert.equal('geo' in schema, false);
  assert.doesNotMatch(JSON.stringify({ SALON, schema }), OLD);
});

for (const field of ['maps', 'mapsEmbed']) {
  test(`${field}: query după adresa completă, fără coordonate/place ID vechi`, () => {
    const url = new URL(SALON[field]);
    assert.equal(url.protocol, 'https:');
    assert.match(url.hostname, /^(?:maps\.google\.com|www\.google\.com)$/);
    assert.equal(url.searchParams.get('q'), `${ADDRESS}, Romania`);
    assert.deepEqual([...url.searchParams.keys()].sort(), field === 'maps' ? ['q'] : ['output', 'q']);
    if (field === 'mapsEmbed') assert.equal(url.searchParams.get('output'), 'embed');
    assert.doesNotMatch(decodeURIComponent(url.href), OLD);
  });
}

test('schema BridalShop folosește adresa nouă, fără cod poștal', () => {
  assert.equal(schema['@type'], 'BridalShop');
  assert.equal(schema.address.streetAddress, SALON.street);
  assert.equal(schema.address.addressLocality, SALON.city);
  assert.equal(schema.address.addressRegion, SALON.county);
  assert.equal(schema.address.addressCountry, 'RO');
});

test('meta HTML și SEO client-side coincid și nu readuc adresa veche la navigare', () => {
  const description = html.match(/<meta name="description"\s+content="([^"]+)"/)[1];
  assert.equal(seo.HOME_SEO.description, description);
  assert.ok(description.includes(STREET));
  assert.doesNotMatch(description, OLD);
  for (const route of ['/', '/atelier', '/despre-noi', '/programare', '/colectii']) {
    assert.doesNotMatch(JSON.stringify(seo.staticRouteSeo(route)), OLD);
  }
  assert.equal(html.match(/<link rel="canonical" href="([^"]+)"/)[1], 'https://www.salonfya.com/');
});

test('footerul real afișează noua stradă, adresa completă și linkul Maps', () => {
  const markup = render('src/ui/Footer.tsx');
  assert.ok(markup.includes(STREET));
  assert.ok(markup.includes(FULL));
  assert.ok(markup.includes(`href="${SALON.maps}"`));
  assert.doesNotMatch(markup, OLD);
});

test('Programare real: text, link Maps, iframe și titlu sunt toate la adresa nouă', () => {
  const markup = render('src/pages/Programare.tsx');
  assert.ok(markup.includes(ADDRESS));
  assert.ok(markup.includes(`href="${SALON.maps}"`));
  assert.ok(markup.includes(`src="${SALON.mapsEmbed.replaceAll('&', '&amp;')}"`));
  assert.ok(markup.includes(`title="Harta către Salon FYA, ${FULL}"`));
  assert.doesNotMatch(markup, OLD);
});

test('imaginea editorială nu este atribuită adresei salonului', () => {
  const markup = render('src/pages/Atelier.tsx');
  assert.ok(markup.includes('<figcaption>Emma · Colecția Aurora</figcaption>'));
  assert.ok(markup.includes('/images/AURORA/EMMA/EMMA_01_plan_intreg.jpg'));
  assert.doesNotMatch(markup, OLD);
});

test('telefon, WhatsApp, email, program și profiluri sociale rămân neschimbate', () => {
  assert.equal(SALON.phone, '+40 727 844 228');
  assert.equal(SALON.phoneHref, '+40727844228');
  assert.equal(SALON.whatsapp, '40727844228');
  assert.equal(SALON.email, 'contact@salonfya.com');
  assert.equal(SALON.hours, 'Doar pe bază de programare');
  assert.equal(SALON.hoursNote, 'Ne potrivim după programul tău, inclusiv în weekend.');
  assert.equal(SALON.facebook, 'https://www.facebook.com/461693320575514');
  assert.equal(SALON.instagram, 'https://www.instagram.com/salonfyaromania/');
});

test('nicio sursă runtime src sau index.html nu păstrează strada/codul poștal vechi', () => {
  const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(dir, entry.name);
    return entry.isDirectory() ? walk(path) : /\.(?:tsx?|css|json|html)$/.test(path) ? [path] : [];
  });
  for (const path of [resolve(root, 'index.html'), ...walk(resolve(root, 'src'))]) {
    assert.doesNotMatch(readFileSync(path, 'utf8'), OLD, path);
  }
});
