import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

// Textul public al homepage-ului: doar afirmații verificabile la probă.
// Rochiile sunt alese de salon; proba și ajustările se fac în atelierul propriu.
// Fără rețea, DB sau Pixel. Componenta reală, dependențele externe adaptate.
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
      if (name.startsWith('.')) {
        const base = resolve(root, dirname(path), name).slice(root.length + 1);
        for (const ext of ['.ts', '.tsx']) {
          try { readFileSync(resolve(root, base + ext)); return load(base + ext); } catch {}
        }
      }
      throw new Error(`Import neadaptat în test: ${path}: ${name}`);
    };
    runInNewContext(output, { module, exports: module.exports, require: localRequire, window: { matchMedia: () => ({ matches: true, addEventListener() {}, removeEventListener() {} }) } });
    cache.set(path, module.exports);
    return module.exports;
  };
  return load;
};

const blocked = () => { throw new Error('Testul nu permite servicii externe sau scrieri.'); };
const collections = ['Imperial', 'Anna', 'Mayra', 'Beverly'].map((collection) => ({
  collection, slug: collection.toLowerCase(), path: `/${collection.toLowerCase()}`, note: 'notă', intro: 'intro', cover: `/images/${collection}.jpg`,
}));
const renderHome = (count = 0) => {
  const load = loadWith({
    react: React,
    'react-router-dom': { Link: ({ to, children, ...props }) => React.createElement('a', { href: to, ...props }, children) },
    '../lib/motion': {
      Reveal: ({ as = 'div', children, index, mode, ...props }) => React.createElement(as, props, children),
      SmartImage: (props) => React.createElement('img', props),
    },
    '../data/salon': { SALON: { reach: ['Bihor', 'Cluj'], email: 'contact@salonfya.com', phone: '+40 727 844 228', phoneHref: '+40727844228' } },
    '../lib/supabase': { supabase: { from: blocked } },
    '../data/publicCatalog': { COLLECTIONS: collections },
    '../lib/useCatalog': { useCatalog: () => ({ dresses: Array.from({ length: count }, (_, i) => ({ id: `d${i}`, collection: 'Imperial' })) }) },
  });
  return renderToStaticMarkup(React.createElement(load('src/pages/Homepage.tsx').default));
};
const text = (markup) => markup.replace(/<[^>]+>/g, ' ').replace(/&#x27;|&#39;/g, "'").replace(/\s+/g, ' ').replace(/ ([.,])/g, '$1');

// Afirmații de producție proprie sau comparații cu alte saloane, care nu se pot susține pentru rochii cumpărate.
const CLAIMS = [
  /croit/i, /croial/i, /externaliz/i, /gata făcut/i, /furnizor/i, /se coase/i, /cusut/i, /brodat/i,
  /se taie/i, /lucrat manual/i, /aplicată manual/i, /schiț/i, /se desenează/i, /\bDesign\b/, /\bExecuție\b/,
  /croitoria e a noastră/i, /Majoritatea saloanelor/i,
];
// Cifre care se schimbă odată cu catalogul sau nu sunt documentate.
const VOLATILE = [/Patru colecții/i, /rochii în colecții/i, /județe/i];

test('homepage: niciun claim de producție proprie sau comparație cu alte saloane', () => {
  const body = text(renderHome(27));
  for (const pattern of CLAIMS) assert.doesNotMatch(body, pattern, `claim rămas: ${pattern}`);
});

test('homepage: nici textele alternative ale imaginilor nu promit lucru manual sau croitorie', () => {
  const alts = [...renderHome(27).matchAll(/alt="([^"]*)"/g)].map((m) => m[1]);
  assert.ok(alts.length >= 4);
  for (const alt of alts) {
    for (const pattern of [/manual/i, /croit/i, /brodat/i]) assert.doesNotMatch(alt, pattern, `${pattern} în alt: ${alt}`);
  }
});

test('homepage: fără cifre fixe care se strică la colecțiile noi', () => {
  const body = text(renderHome(27));
  for (const pattern of VOLATILE) assert.doesNotMatch(body, pattern, `cifră fixă rămasă: ${pattern}`);
  assert.doesNotMatch(read('src/pages/Homepage.tsx'), /SALON\.reach/);
});

test('homepage: textul nou aprobat apare exact', () => {
  const body = text(renderHome(27));
  for (const phrase of [
    'Salon și atelier de mireasă · Oradea',
    'Rochia ta,', 'ajustată pe tine în Oradea.',
    'Alegi dintre colecțiile noastre, iar ultima ajustare se face în atelierul din salon, cu tine la probă.',
    'Proba, ajustarea sau redresarea, toate în același loc.',
    'Rochii alese de noi, ajustate pe tine în atelierul din Oradea.',
    'Colecțiile noastre, un singur atelier de ajustări',
    'Atelier de ajustări', 'Colecții alese de noi', 'Ajustări în casă', 'Probe pe bază de programare',
    'Alegerea', 'Proba', 'Ajustarea', 'Continuăm până la proba finală, oricâte sunt nevoie.',
    'La noi, doar imaginația e limita.',
  ]) assert.ok(body.includes(phrase), `lipsește: ${phrase}`);
});

test('homepage: fără numărul de rochii; CTA „Vezi colecția noastră”, cardurile „Vezi colecția”', () => {
  for (const count of [0, 3, 27, 78]) {
    const body = text(renderHome(count));
    assert.ok(body.includes('Vezi colecția noastră'));
    assert.doesNotMatch(body, /\d+\s*(rochii|rochie|modele|model)\b/i);
    assert.doesNotMatch(body, /Vezi cele/);
    assert.equal((body.match(/Vezi colecția(?! noastră)/g) || []).length, collections.length);
  }
  assert.doesNotMatch(read('src/pages/Homepage.tsx'), /dresses\.length|countFor|useCatalog/);
});

test('homepage: CTA-urile și contactul rămân neschimbate', () => {
  const markup = renderHome(27);
  assert.equal((markup.match(/href="\/programare"/g) || []).length, 2);
  assert.ok(markup.includes('href="/colectii"'));
  assert.ok(markup.includes('href="/atelier"'));
  assert.ok(markup.includes('href="tel:+40727844228"'));
  assert.ok(markup.includes('mailto:contact@salonfya.com'));
});

const html = read('index.html');
const meta = (pattern) => html.match(pattern)[1];
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
const seo = loadWith({ react: React })('src/lib/seo.ts');
const TITLE = 'Salon FYA · Rochii de mireasă alese și ajustate în atelier, Oradea';

test('SEO: titlul nou identic în HTML, Open Graph și SEO client-side', () => {
  assert.equal(meta(/<title>([^<]+)<\/title>/), TITLE);
  assert.equal(meta(/<meta property="og:title" content="([^"]+)"/), TITLE);
  assert.equal(seo.HOME_SEO.title, TITLE);
  assert.equal(seo.HOME_SEO.description, meta(/<meta name="description"\s+content="([^"]+)"/));
});

test('SEO: meta, Open Graph și schema fără claimuri de producție proprie', () => {
  const fields = [
    meta(/<title>([^<]+)<\/title>/),
    meta(/<meta name="description"\s+content="([^"]+)"/),
    meta(/<meta property="og:title" content="([^"]+)"/),
    meta(/<meta property="og:description"\s+content="([^"]+)"/),
    schema.description,
    seo.HOME_SEO.title,
    seo.HOME_SEO.description,
  ];
  for (const value of fields) {
    for (const pattern of [/croit/i, /externaliz/i, /execuție/i, /\bDesign\b/, /Patru colecții/i, /atelier propriu/i]) {
      assert.doesNotMatch(value, pattern, `${pattern} în: ${value}`);
    }
  }
  assert.ok(seo.HOME_SEO.description.includes('Mihail Kogălniceanu nr. 44'));
});
