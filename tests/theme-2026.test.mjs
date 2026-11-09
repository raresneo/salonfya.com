import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

// Fără browser, rețea, DB sau Pixel. Componentele reale, dependențele externe adaptate.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const theme = read('src/styles/theme-2026.css');

/* ------------------------------- CSS helpers ------------------------------ */

const rules = (css) => {
  const out = [];
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const match of clean.matchAll(/([^{}@]+)\{([^{}]*)\}/g)) {
    for (const selector of match[1].split(',').map((s) => s.trim()).filter(Boolean)) {
      out.push({ selector, body: match[2] });
    }
  }
  return out;
};
const rem = (body) => {
  const hit = /font-size:\s*([\d.]+)rem/.exec(body);
  return hit ? Number(hit[1]) : null;
};

const tokens = Object.fromEntries(
  [...theme.slice(theme.indexOf(':root'), theme.indexOf('}')).matchAll(/--([\w-]+):\s*oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)\)/g)]
    .map(([, name, l, c, h]) => [name, [Number(l) / 100, Number(c), Number(h)]])
);
const luminance = ([L, C, h]) => {
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const clamp = (v) => Math.min(1, Math.max(0, v));
  const R = clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s);
  const G = clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s);
  const B = clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};
const contrast = (fg, bg) => {
  const [x, y] = [luminance(tokens[fg]), luminance(tokens[bg])].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

/* ----------------------------- module loader ------------------------------ */

const loadWith = (adapters, sandbox) => {
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
    runInNewContext(output, { module, exports: module.exports, require: localRequire, ...sandbox });
    cache.set(path, module.exports);
    return module.exports;
  };
  return load;
};
const windowWith = (reduced) => ({ matchMedia: () => ({ matches: reduced, addEventListener() {}, removeEventListener() {} }) });
const blocked = () => { throw new Error('Testul nu permite servicii externe sau scrieri.'); };
const collections = ['Imperial', 'Anna', 'Mayra', 'Beverly'].map((collection) => ({
  collection, slug: collection.toLowerCase(), path: `/${collection.toLowerCase()}`,
  note: 'notă', intro: 'intro', cover: `/images/${collection.toLowerCase()}-cover.jpg`, video: `/images/${collection.toLowerCase()}.mp4`,
}));
const common = {
  react: React,
  '../lib/motion': {
    Reveal: ({ as = 'div', children, index, mode, ...props }) => React.createElement(as, props, children),
    SmartImage: (props) => React.createElement('img', props),
  },
  '../data/salon': { SALON: { reach: ['Bihor'], email: 'contact@salonfya.com', phone: '+40 727 844 228', phoneHref: '+40727844228' } },
  '../lib/supabase': { supabase: { from: blocked } },
};
const renderHome = (reduced) => {
  const load = loadWith({
    ...common,
    'react-router-dom': { Link: ({ to, children, ...props }) => React.createElement('a', { href: to, ...props }, children) },
    '../data/publicCatalog': { COLLECTIONS: collections },
    '../lib/useCatalog': { useCatalog: () => ({ dresses: [] }) },
  }, { window: windowWith(reduced) });
  return renderToStaticMarkup(React.createElement(load('src/pages/Homepage.tsx').default));
};
const renderCollection = (reduced) => {
  const load = loadWith({
    ...common,
    'react-router-dom': {
      Link: ({ to, children, ...props }) => React.createElement('a', { href: to, ...props }, children),
      useLocation: () => ({ pathname: '/imperial' }), useParams: () => ({}),
    },
    '../data/publicCatalog': { COLLECTIONS: collections, collectionBySlug: (slug) => collections.find((c) => c.slug === slug) },
    '../lib/useCatalog': { useCollection: () => ({ dresses: [], loading: false }) },
    '../lib/seo': { collectionSeo: (meta) => meta, notFoundSeo: (path) => path, useSeo: () => {} },
    '../ui/DressCard': { default: () => null },
  }, { window: windowWith(reduced) });
  return renderToStaticMarkup(React.createElement(load('src/pages/CollectionPage.tsx').default, { slug: 'imperial' }));
};

/* --------------------------------- tests ---------------------------------- */

test('tema se încarcă după index.css și înaintea mobile-fixes.css, care rămâne ultimul', () => {
  const imports = [...read('src/index.tsx').matchAll(/^import '\.\/(.+?)';$/gm)].map((m) => m[1]);
  assert.deepEqual(imports.slice(-2), ['styles/theme-2026.css', 'styles/mobile-fixes.css']);
  assert.ok(imports.indexOf('index.css') < imports.indexOf('styles/theme-2026.css'));
});

test('fără fonturi, imagini sau URL-uri noi în temă', () => {
  assert.doesNotMatch(theme, /@import|url\(|font-family|https?:/);
});

test('fără preloader blocant și fără cursor cu rAF continuu', () => {
  const app = read('src/App.tsx');
  assert.doesNotMatch(app, /Preloader|<Cursor|booted/);
  assert.match(app, /requestAnimationFrame\(\(\) => document\.body\.classList\.add\('ready'\)\)/);
  assert.match(app, /cancelAnimationFrame\(frame\)/);
});

test('fără parallax: niciun data-par pe homepage', () => {
  assert.doesNotMatch(read('src/pages/Homepage.tsx'), /data-par|SPEEDS/);
  assert.doesNotMatch(renderHome(false), /data-par/);
});

test('homepage: video existent cu autoplay normal, doar poster la reduced motion', () => {
  const normal = renderHome(false);
  assert.match(normal, /<video[^>]*autoplay=""[^>]*poster="\/images\/history_hero_portrait\.png"/i);
  assert.match(normal, /<source src="\/images\/CINEMATIC\.mp4" type="video\/mp4"/);
  const reduced = renderHome(true);
  assert.doesNotMatch(reduced, /<video|autoplay|CINEMATIC/i);
  assert.match(reduced, /<div class="hero-media"><img src="\/images\/history_hero_portrait\.png" alt="" aria-hidden="true"\/>/);
});

test('colecție: video existent normal, poster coperta la reduced motion', () => {
  const normal = renderCollection(false);
  assert.match(normal, /<video[^>]*autoplay=""[^>]*poster="\/images\/imperial-cover\.jpg"/i);
  assert.match(normal, /<source src="\/images\/imperial\.mp4"/);
  const reduced = renderCollection(true);
  assert.doesNotMatch(reduced, /<video|autoplay|imperial\.mp4/i);
  assert.match(reduced, /<div class="phero-media"><img src="\/images\/imperial-cover\.jpg" alt="" aria-hidden="true"\/>/);
});

test('autoplay există doar în HeroMedia; paginile nu mai pornesc video direct', () => {
  for (const page of ['src/pages/Homepage.tsx', 'src/pages/CollectionPage.tsx']) {
    assert.doesNotMatch(read(page), /<video|autoPlay/, page);
  }
  assert.match(read('src/ui/HeroMedia.tsx'), /if \(!video \|\| reduced\) return <img/);
});

test('lizibilitate: orice etichetă sub 12px din tema veche e ridicată la cel puțin .75rem', () => {
  const themed = new Map();
  const hidden = new Set();
  for (const { selector, body } of rules(theme)) {
    const size = rem(body);
    if (size !== null) themed.set(selector, Math.max(themed.get(selector) ?? 0, size));
    if (/display:\s*none/.test(body)) hidden.add(selector);
  }
  const notRendered = new Set(['.veil-num']); // preloaderul nu mai e randat
  const small = [...rules(read('src/index.css')), ...rules(read('src/styles/booking.css'))]
    .filter(({ body }) => rem(body) !== null && rem(body) < 0.75)
    .map(({ selector }) => selector)
    .filter((selector) => !hidden.has(selector) && !notRendered.has(selector));
  assert.ok(small.length >= 15, 'lista de etichete mici a fost găsită');
  for (const selector of small) {
    assert.ok((themed.get(selector) ?? 0) >= 0.75, `${selector} rămâne sub 12px`);
  }
  for (const [selector, size] of themed) assert.ok(size >= 0.75, `${selector} setat sub 12px în temă`);
});

test('contrast WCAG pe perechile reale de tokenuri', () => {
  const pairs = [
    ['ink', 'ivory', 7], ['muted', 'ivory', 4.5], ['muted', 'ivory-warm', 4.5],
    ['clay', 'ivory', 4.5], ['olive', 'ivory', 4.5], ['olive', 'ivory-warm', 4.5],
    ['on-plum', 'plum', 7], ['plum', 'ivory', 7], ['on-plum', 'plum-deep', 7], ['sand', 'plum-deep', 7],
    ['on-plum-dim', 'plum-deep', 4.5], ['on-plum-dim', 'plum', 4.5], ['on-plum-dim', 'ink', 4.5],
    ['ivory', 'clay', 4.5], ['plum', 'sand', 4.5],
  ];
  for (const [fg, bg, min] of pairs) {
    assert.ok(tokens[fg] && tokens[bg], `${fg}/${bg} definite`);
    const ratio = contrast(fg, bg);
    assert.ok(ratio >= min, `${fg} pe ${bg}: ${ratio.toFixed(2)} < ${min}`);
  }
});

test('mobil: catalog pe 2 coloane, filtre și galerie derulabile fără overflow de pagină', () => {
  const mobile = theme.slice(theme.indexOf('@media (max-width: 699px)'));
  assert.match(mobile, /\.cat-grid \{ grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/);
  assert.match(mobile, /\.filters \{\s*flex-wrap: nowrap; overflow-x: auto;[^}]*margin-inline: calc\(var\(--gut\) \* -1\); padding-inline: var\(--gut\);/);
  const product = theme.slice(theme.indexOf('@media (max-width: 1023px)'));
  assert.match(product, /\.gallery--rest \{\s*display: flex;[^}]*overflow-x: auto;[^}]*scroll-snap-type: x mandatory;[^}]*margin-inline: calc\(var\(--gut\) \* -1\); padding-inline: var\(--gut\);/);
  assert.match(product, /\.gallery--rest > figure \{ flex: 0 0 72%; scroll-snap-align: start; \}/);
  // ordinea produsului rămâne cea din mobile-fixes: imagine, info și CTA, apoi galeria
  assert.match(read('src/styles/mobile-fixes.css'), /grid-template-areas: "lead" "info" "rest";/);
});

test('nav compact, cu fond pe paginile deschise; tap targets 44px pe touch', () => {
  assert.match(theme, /\.nav \{ padding: 14px var\(--gut\); \}/);
  assert.match(theme, /\.nav\.solid \{ padding: 10px var\(--gut\); \}/);
  assert.match(theme, /\.nav \.btn \{ min-height: 44px;/);
  assert.match(theme, /\.nav\.ink::after \{ opacity: \.96; \}/);
  const coarse = theme.slice(theme.indexOf('@media (pointer: coarse)'));
  assert.match(coarse, /\.cal-slot \{ min-height: 44px; \}/);
  assert.match(coarse, /\.chip \{ min-height: 44px; \}/);
  assert.match(read('src/styles/mobile-fixes.css'), /\.burger \{ width: 44px; height: 44px;/);
});

test('mișcare ușoară: fără wipe clip-path, fără bandă rulantă, reduced motion complet', () => {
  assert.match(theme, /\[data-reveal="wipe"\] \{ clip-path: none; opacity: 0; transform: none;/);
  assert.match(theme, /\.band-track \{\s*animation: none;/);
  assert.match(theme, /\.hero-scroll \{ display: none; \}/);
  const reduced = theme.slice(theme.indexOf('@media (prefers-reduced-motion: reduce)'));
  assert.match(reduced, /\[data-reveal\], \[data-reveal="wipe"\] \{ opacity: 1; transform: none; clip-path: none; \}/);
  for (const match of theme.matchAll(/transition[^;]*?([\d.]+)s/g)) {
    assert.ok(Number(match[1]) <= 0.8, `tranziție prea lungă: ${match[0]}`);
  }
});
