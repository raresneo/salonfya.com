import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

// Fără rețea și fără scrieri: modulele reale sunt transpilate, dependențele externe sunt adaptoare.
const require = createRequire(import.meta.url);
const realReact = pathToFileURL(require.resolve('react')).href;
const realServer = pathToFileURL(require.resolve('react-dom/server')).href;
const url = (code) => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
let serial = 0;
const compile = (path, imports = {}) => {
  const rewrite = (context) => {
    const visit = (node) => {
      if (ts.isImportDeclaration(node) && imports[node.moduleSpecifier.text]) {
        return ts.factory.updateImportDeclaration(node, node.modifiers, node.importClause,
          ts.factory.createStringLiteral(imports[node.moduleSpecifier.text]), node.attributes);
      }
      if (ts.isExportDeclaration(node) && node.moduleSpecifier && imports[node.moduleSpecifier.text]) {
        return ts.factory.updateExportDeclaration(node, node.modifiers, node.isTypeOnly, node.exportClause,
          ts.factory.createStringLiteral(imports[node.moduleSpecifier.text]), node.attributes);
      }
      return ts.visitEachChild(node, visit, context);
    };
    return (node) => ts.visitNode(node, visit);
  };
  const out = ts.transpileModule(read(path), {
    fileName: path,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.React },
    transformers: { before: [rewrite] },
  }).outputText;
  return url(`${out}\n// ${serial++}`);
};

const types = compile('../src/types.ts');
const policy = compile('../src/data/catalogAvailability.ts', { '../types': types });
const copy = compile('../src/data/publicDressCopy.ts', { './catalogAvailability': policy });
const catalog = compile('../src/data/catalog.ts', { '../types': types, './newCollections': compile('../src/data/newCollections.ts') });
const publicCatalog = compile('../src/data/publicCatalog.ts', {
  '../types': types, './catalog': catalog, './publicDressCopy': copy, './catalogAvailability': policy,
});
const seoUrl = compile('../src/lib/seo.ts', { react: realReact, '../types': types });
const routesUrl = compile('../src/lib/routes.ts', { './seo': seoUrl });

const seo = await import(seoUrl);
const { hasDarkHero } = await import(routesUrl);
const { LOCAL_CATALOG, COLLECTIONS } = await import(publicCatalog);
const { UNAVAILABLE_MODELS } = await import(policy);
const { publicDressDescription } = await import(copy);

const SLUGS = ['imperial', 'anna', 'mayra', 'beverly'];
const UNSAFE = /strapless|mermaid|silk|mătase|satin|dantel|stoc|garant|reducer|lei\b|mărim|livrare|gratuit|cel mai/i;

/* ------------------------------ catalog intact ------------------------------ */

test('real public catalog retains the 27 existing models and adds 51 approved new models, no withdrawals', () => {
  assert.equal(LOCAL_CATALOG.length, 78);
  const counts = Object.fromEntries(['Imperial', 'Anna', 'Mayra', 'Beverly']
    .map((c) => [c, LOCAL_CATALOG.filter((d) => d.collection === c).length]));
  assert.deepEqual(counts, { Imperial: 7, Anna: 5, Mayra: 10, Beverly: 5 });
  for (const [collection, name] of UNAVAILABLE_MODELS) {
    assert.equal(LOCAL_CATALOG.some((d) => d.collection === collection && d.name === name), false);
  }
});

/* --------------------------------- nav hero -------------------------------- */

test('dark-hero routes include catalog and collection aliases; light pages stay ink', () => {
  for (const path of ['/', '/colectii', '/colectii/', '/atelier', '/despre-noi', '/programare',
    '/imperial', '/Imperial', '/anna', '/mayra', '/beverly', '/colectia/anna', '/colectia/BEVERLY', '/colectii?x=1']) {
    assert.equal(hasDarkHero(path, SLUGS), true, path);
  }
  for (const path of ['/rochie/imperial-argente', '/foo', '/colectia/necunoscuta', '/colectia/%E0%A4%A',
    '/admin', '/imperial/extra', '/colectia', '']) {
    assert.equal(hasDarkHero(path, SLUGS), path === '', path);
  }
});

/* ----------------------------------- SEO ----------------------------------- */

test('home SEO is byte-identical to index.html title and description', () => {
  const html = read('../index.html');
  const title = /<title>([^<]+)<\/title>/.exec(html)[1];
  const description = /name="description"\s+content="([^"]+)"/.exec(html)[1];
  assert.equal(seo.HOME_SEO.title, title);
  assert.equal(seo.HOME_SEO.description, description);
  assert.equal(seo.staticRouteSeo('/'), seo.HOME_SEO);
  assert.equal(seo.canonicalUrl('/'), 'https://www.salonfya.com/');
});

test('static routes have own title/description/canonical; aliases and admin handled', () => {
  const expected = { '/colectii': '/colectii', '/atelier': '/atelier', '/despre-noi': '/atelier', '/programare': '/programare' };
  const titles = new Set();
  for (const [route, path] of Object.entries(expected)) {
    const meta = seo.staticRouteSeo(route);
    assert.equal(meta.path, path);
    assert.equal(meta.robots, 'index,follow');
    assert.match(meta.title, /· Salon FYA$/);
    assert.doesNotMatch(`${meta.title} ${meta.description}`, UNSAFE);
    assert.ok(meta.description.length >= 50 && meta.description.length <= 160, route);
    if (route !== '/despre-noi') titles.add(meta.title);
  }
  assert.equal(titles.size, 3);
  assert.equal(seo.staticRouteSeo('/colectii/').path, '/colectii');
  assert.equal(seo.staticRouteSeo('/admin').robots, 'noindex,nofollow');
  for (const dynamic of ['/imperial', '/rochie/imperial-argente', '/colectia/anna', '/nope']) {
    assert.equal(seo.staticRouteSeo(dynamic), undefined, dynamic);
  }
});

test('collection SEO: one canonical per collection, also for /colectia/:slug', () => {
  assert.equal(COLLECTIONS.length, 6);
  for (const meta of COLLECTIONS) {
    const s = seo.collectionSeo(meta);
    assert.equal(seo.canonicalUrl(s.path), `https://www.salonfya.com/${meta.slug}`);
    assert.equal(s.title, `Colecția ${meta.collection} · Salon FYA`);
    assert.doesNotMatch(s.description, UNSAFE);
    assert.ok(s.description.length <= 160);
  }
});

for (const dress of LOCAL_CATALOG) {
  test(`product SEO ${dress.collection}/${dress.name}: neutral copy, canonical, no new claims`, () => {
    const s = seo.dressSeo(dress);
    assert.equal(s.title, `${dress.name} · Colecția ${dress.collection} · Salon FYA`);
    assert.equal(s.description, publicDressDescription(dress));
    assert.equal(seo.canonicalUrl(s.path), `https://www.salonfya.com/rochie/${dress.id}`);
    assert.equal(s.robots, 'index,follow');
    assert.doesNotMatch(`${s.title} ${s.description}`, UNSAFE);
  });
}

test('404, unavailable models and unknown collections are noindex', () => {
  assert.equal(seo.notFoundSeo('/x?y=1').robots, 'noindex,follow');
  assert.equal(seo.notFoundSeo('/x?y=1').path, '/x');
  const withdrawn = seo.unavailableDressSeo('/rochie/imperial-alma');
  assert.equal(withdrawn.robots, 'noindex,follow');
  assert.doesNotMatch(withdrawn.title, /Alma/);
  assert.equal(seo.normalizePath('rochie//a/#x'), '/rochie/a');
});

class FakeEl {
  constructor(tag, doc) { this.tagName = tag; this.attrs = {}; this.doc = doc; }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  getAttribute(k) { return this.attrs[k] ?? null; }
  remove() { this.doc.head.children = this.doc.head.children.filter((c) => c !== this); }
}
const fakeDocument = () => {
  const doc = { title: '' };
  doc.createElement = (tag) => new FakeEl(tag, doc);
  doc.head = {
    children: [],
    appendChild(node) { this.children.push(node); return node; },
    querySelector(selector) {
      const m = /^(\w+)\[(\w+)="([^"]+)"\]$/.exec(selector);
      return this.children.find((c) => c.tagName === m[1] && c.attrs[m[2]] === m[3]) || null;
    },
  };
  return doc;
};

test('applySeo upserts all tags, never duplicates, removes canonical on noindex and restores it', () => {
  const doc = fakeDocument();
  const argente = LOCAL_CATALOG.find((d) => d.name === 'Argente');
  seo.applySeo(seo.dressSeo(argente), doc);
  seo.applySeo(seo.dressSeo(argente), doc);
  const get = (sel) => doc.head.querySelector(sel);
  assert.equal(doc.title, 'Argente · Colecția Imperial · Salon FYA');
  assert.equal(get('meta[name="description"]').attrs.content, publicDressDescription(argente));
  assert.equal(get('link[rel="canonical"]').attrs.href, 'https://www.salonfya.com/rochie/imperial-argente');
  assert.equal(get('meta[property="og:url"]').attrs.content, 'https://www.salonfya.com/rochie/imperial-argente');
  assert.equal(get('meta[name="robots"]').attrs.content, 'index,follow');
  assert.equal(doc.head.children.length, 6);
  seo.applySeo(seo.unavailableDressSeo('/rochie/imperial-alma'), doc);
  assert.equal(get('link[rel="canonical"]'), null);
  assert.equal(get('meta[name="robots"]').attrs.content, 'noindex,follow');
  seo.applySeo(seo.HOME_SEO, doc);
  assert.equal(get('link[rel="canonical"]').attrs.href, 'https://www.salonfya.com/');
  assert.equal(doc.title, seo.HOME_SEO.title);
  assert.equal(doc.head.children.length, 6);
});

/* ---------------------------- robots + sitemap ----------------------------- */

test('sitemap.xml lists exactly real indexable routes and all 78 active models', () => {
  const xml = read('../public/sitemap.xml');
  assert.match(xml, /^<\?xml version="1.0" encoding="UTF-8"\?>\n<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/);
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const expected = ['/', '/colectii', '/imperial', '/anna', '/mayra', '/beverly', '/aurora', '/noblesse', '/atelier', '/programare',
    ...LOCAL_CATALOG.map((d) => `/rochie/${encodeURIComponent(d.id)}`)].map(seo.canonicalUrl);
  assert.deepEqual([...locs].sort(), [...expected].sort());
  assert.equal(locs.length, 88);
  assert.equal(new Set(locs).size, locs.length);
  for (const [collection, name] of UNAVAILABLE_MODELS) {
    const slugged = `${collection}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    assert.equal(locs.some((loc) => loc.endsWith(`/rochie/${slugged}`)), false, slugged);
  }
  assert.equal(locs.some((loc) => /\/admin|\/despre-noi|\/colectia\//.test(loc)), false);
  // Fiecare URL din sitemap are SEO indexabil și canonical identic cu URL-ul listat.
  for (const loc of locs) {
    const path = loc.replace('https://www.salonfya.com', '') || '/';
    const meta = seo.staticRouteSeo(path)
      || COLLECTIONS.map(seo.collectionSeo).find((m) => m.path === path)
      || LOCAL_CATALOG.map(seo.dressSeo).find((m) => m.path === path);
    assert.ok(meta, path);
    assert.equal(seo.canonicalUrl(meta.path), loc);
    assert.equal(meta.robots, 'index,follow');
  }
});

test('robots.txt is real, blocks only /admin and points to the sitemap', () => {
  const robots = read('../public/robots.txt');
  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Disallow: \/admin$/m);
  assert.doesNotMatch(robots, /^Disallow: \/\s*$/m);
  assert.match(robots, /^Sitemap: https:\/\/www\.salonfya\.com\/sitemap\.xml$/m);
});

/* ------------------------------- scroll FX --------------------------------- */

const reactShim = url(`
  export const useState = (initial) => {
    const h = globalThis.__fx;
    if (!('state' in h)) h.state = typeof initial === 'function' ? initial() : initial;
    return [h.state, (next) => { h.state = next; h.sets.push(next); }];
  };
  export const useRef = (value) => (globalThis.__fx.ref ||= { current: value });
  export const useEffect = (effect) => { globalThis.__fx.effects.push(effect); };
  const React = { createElement: () => null };
  export default React;
`);
const loadScrollFx = async ({ scrollY = 0, reduced = false, solid = false } = {}) => {
  const listeners = new Map();
  const frames = new Map();
  let nextFrame = 1;
  const node = { dataset: { par: '0.2' }, style: { props: {}, setProperty(k, v) { this.props[k] = v; } },
    getBoundingClientRect: () => ({ top: 100, bottom: 500, height: 400 }) };
  globalThis.__fx = { effects: [], sets: [], ...(solid ? { state: true } : {}) };
  globalThis.window = {
    innerHeight: 800, scrollY, pageYOffset: scrollY,
    matchMedia: (q) => ({ matches: reduced && q.includes('reduce') }),
    addEventListener: (type, fn) => listeners.set(type, fn),
    removeEventListener: (type, fn) => { if (listeners.get(type) === fn) listeners.delete(type); },
    setTimeout: () => 0, clearTimeout: () => {},
  };
  globalThis.document = {
    documentElement: { scrollHeight: 3000 },
    querySelectorAll: () => [node],
  };
  globalThis.requestAnimationFrame = (fn) => { const id = nextFrame++; frames.set(id, fn); return id; };
  globalThis.cancelAnimationFrame = (id) => frames.delete(id);
  const motion = await import(compile('../src/lib/motion.tsx', { react: reactShim }));
  const result = motion.useScrollFx('/route');
  result.progressRef.current = { style: {} };
  const cleanup = globalThis.__fx.effects.at(-1)();
  const flush = () => { const pending = [...frames]; frames.clear(); pending.forEach(([, fn]) => fn()); return pending.length; };
  return { listeners, frames, flush, cleanup, node, result, fx: globalThis.__fx };
};

test('scroll FX is event-driven: one frame per burst, idle page schedules nothing', async () => {
  const h = await loadScrollFx();
  assert.equal(h.frames.size, 1);
  assert.equal(h.flush(), 1);
  assert.equal(h.frames.size, 0, 'no continuous rAF loop');
  h.listeners.get('scroll')();
  h.listeners.get('scroll')();
  h.listeners.get('resize')();
  assert.equal(h.frames.size, 1, 'bursts coalesce into one frame');
  h.flush();
  assert.equal(h.frames.size, 0);
  assert.match(h.node.style.props['--py'], /px$/);
  h.cleanup();
  assert.equal(h.listeners.size, 0);
});

test('scroll FX syncs nav state on route change and threshold; reduced motion skips parallax', async () => {
  const stale = await loadScrollFx({ scrollY: 0, solid: true });
  stale.flush();
  assert.deepEqual(stale.fx.sets, [false], 'stale solid nav is reset at top of new route');
  stale.cleanup();
  const scrolled = await loadScrollFx({ scrollY: 700 });
  scrolled.flush();
  assert.deepEqual(scrolled.fx.sets, [true]);
  assert.equal(scrolled.result.progressRef.current.style.transform, `scaleX(${700 / 2200})`);
  scrolled.cleanup();
  const reduced = await loadScrollFx({ reduced: true });
  reduced.flush();
  assert.equal(reduced.node.style.props['--py'], undefined);
  reduced.cleanup();
  delete globalThis.window; delete globalThis.document;
});

/* ----------------------------- DressPage render ---------------------------- */

const routerShim = url(`
  import React from '${realReact}';
  export const Link = ({ to, children, ...rest }) => React.createElement('a', { href: to, ...rest }, children);
  export const useParams = () => ({ id: globalThis.__page.id });
  export const useLocation = () => ({ pathname: '/rochie/' + globalThis.__page.id });
`);
const catalogShim = url(`export const useCatalog = () => globalThis.__page.catalog;`);
const wishlistShim = url(`export const useWishlist = () => ({ has: () => false, toggle: () => false, count: 0, ids: [] });`);
const motionReal = compile('../src/lib/motion.tsx', { react: realReact });
const dressCard = compile('../src/ui/DressCard.tsx', {
  react: realReact, 'react-router-dom': routerShim, '../types': types, '../lib/motion': motionReal,
});
const dressPage = compile('../src/pages/DressPage.tsx', {
  react: realReact, 'react-router-dom': routerShim, '../lib/useCatalog': catalogShim, '../lib/useWishlist': wishlistShim,
  '../lib/motion': motionReal, '../lib/seo': seoUrl, '../ui/DressCard': dressCard,
  '../data/salon': compile('../src/data/salon.ts'), '../data/publicDressCopy': copy,
});
const { renderToStaticMarkup } = await import(realServer);
const React = (await import(realReact)).default;
const { default: DressPage } = await import(dressPage);
const render = (id, dresses, loading = false) => {
  globalThis.__page = { id, catalog: { dresses, loading } };
  return renderToStaticMarkup(React.createElement(DressPage));
};

test('mobile order on every active model: lead image, name, description, CTA, then rest of gallery', () => {
  for (const dress of LOCAL_CATALOG) {
    const withGallery = { ...dress, images: ['/lead.jpg', '/two.jpg', '/three.jpg'], sketches: ['/sketch.png'] };
    const html = render(dress.id, [withGallery]);
    const at = (needle) => { const i = html.indexOf(needle); assert.ok(i >= 0, `${dress.name}: ${needle}`); return i; };
    const lead = at('src="/lead.jpg"');
    const name = at(`<h1 class="dress-name"`);
    const description = at(publicDressDescription(dress).replace(/ș/g, 'ș'));
    const cta = at(`Probează ${dress.name}`);
    const second = at('src="/two.jpg"');
    const sketch = at('src="/sketch.png"');
    assert.ok(lead < name && name < description && description < cta && cta < second && second < sketch, dress.name);
    assert.ok(at('gallery--lead') < at('dress-info') && at('dress-info') < at('gallery--rest'));
    assert.equal((html.match(/<img /g) || []).length, 4);
    assert.match(html, /Schițe de prezentare pentru acest model\./);
    assert.doesNotMatch(html, /înainte de croială|conceptul original/);
  }
});

test('single-image model renders no empty rest gallery; unavailable and loading states unchanged', () => {
  const one = { ...LOCAL_CATALOG[0], images: ['/only.jpg'], sketches: [] };
  const html = render(one.id, [one]);
  assert.doesNotMatch(html, /gallery--rest/);
  assert.match(html, /src="\/only.jpg"/);
  assert.match(render('imperial-alma', LOCAL_CATALOG), /Rochia asta nu mai e în catalog/);
  assert.match(render('imperial-argente', [], true), /class="sk"/);
});

/* ------------------------------ wiring + CSS ------------------------------- */

test('App and index wiring: hero detection, instant route scroll, static SEO, fixes CSS loaded last', () => {
  const app = read('../src/App.tsx');
  assert.match(app, /hasDarkHero\(location\.pathname, COLLECTION_SLUGS\)/);
  assert.doesNotMatch(app, /DARK_HERO/);
  assert.match(app, /behavior: 'instant'/);
  assert.match(app, /staticRouteSeo\(location\.pathname\)/);
  assert.match(app, /useSeo\(notFoundSeo\(location\.pathname\)\)/);
  const entry = read('../src/index.tsx');
  const imports = [...entry.matchAll(/^import '\.\/(.+?)';$/gm)].map((m) => m[1]);
  assert.equal(imports.at(-1), 'styles/mobile-fixes.css');
});

test('CSS fixes: no CTA overlap, sheet above bottom bar, tap targets, grid order, reduced motion', () => {
  const css = read('../src/styles/mobile-fixes.css');
  assert.match(css, /@media \(min-width: 980px\) \{ \.fab \{ display: none; \} \}/);
  assert.match(css, /\.sheet \{\s*z-index: calc\(var\(--z-bar\) \+ 2\);\s*visibility: hidden;/);
  assert.match(css, /\.sheet\.open \{ visibility: visible;/);
  assert.match(css, /grid-template-areas: "lead" "info" "rest";/);
  assert.match(css, /grid-template-areas: "lead info" "rest info";/);
  assert.match(css, /\.burger \{ width: 44px; height: 44px;/);
  const coarse = css.slice(css.indexOf('@media (pointer: coarse)'));
  for (const sel of ['.mark', '.chip', '.link-go', '.sheet-close', '.foot-col a']) assert.ok(coarse.includes(sel), sel);
  assert.ok((coarse.match(/min-height: 44px/g) || []).length >= 5);
  const reduced = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
  assert.match(reduced, /scroll-behavior: auto !important/);
  assert.match(reduced, /\.band-track \{ animation: none !important; \}/);
  // Fără schimbări de temă: nicio culoare nouă, doar variabilele existente și plum-deep deja folosit.
  const colors = [...css.matchAll(/oklch\(([^)]+)\)/g)].map((m) => m[1]);
  assert.ok(colors.every((c) => c.startsWith('16.5% 0.036 340')), colors.join(';'));
  assert.doesNotMatch(css, /font-family|@import|url\(/);
});
