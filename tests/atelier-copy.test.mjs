import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

// Atelier + footer: salonul face rochii la comandă ȘI vinde colecții alese.
// Croitoria proprie se afirmă doar pentru rochiile la comandă; colecțiile sunt
// „alese de noi și ajustate”. Fără comparații cu alte saloane, fără cifre nedocumentate.
// Fără rețea, DB sau Pixel. Componentele reale, dependențele externe adaptate.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const blocked = () => { throw new Error('Testul nu permite servicii externe sau scrieri.'); };
const collections = ['Imperial', 'Anna', 'Mayra', 'Beverly'].map((collection) => ({
  collection, slug: collection.toLowerCase(), path: `/${collection.toLowerCase()}`,
}));
const adapters = {
  react: React,
  'react-router-dom': { Link: ({ to, children, ...props }) => React.createElement('a', { href: to, ...props }, children) },
  '../lib/motion': {
    Reveal: ({ as = 'div', children, index, mode, ...props }) => React.createElement(as, props, children),
    SmartImage: (props) => React.createElement('img', props),
  },
  '../lib/supabase': { isSupabaseConfigured: true, supabase: { from: blocked } },
  '../data/catalog': { COLLECTIONS: collections },
};
const cache = new Map();
const load = (path) => {
  if (cache.has(path)) return cache.get(path);
  const output = ts.transpileModule(read(path), {
    fileName: path,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true },
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
const render = (path) => renderToStaticMarkup(React.createElement(load(path).default));
const text = (markup) => markup.replace(/<[^>]+>/g, ' ').replace(/&#x27;|&#39;/g, "'").replace(/\s+/g, ' ').replace(/ ([.,;])/g, '$1');
const alts = (markup) => [...markup.matchAll(/alt="([^"]*)"/g)].map((m) => m[1]);

// Generalizări false acum că salonul vinde și colecții cumpărate, plus comparații cu alte saloane.
const CLAIMS = [
  /externaliz/i, /furnizor/i, /nu se mai poate/i, /croitoria e în casă/i, /brodăm/i,
  /\bDesign și execuție\b/, /Design, execuție/i, /pe jumătate lucrată/i,
];

test('Atelier: niciun claim general de croitorie proprie sau comparație cu alte saloane', () => {
  const body = text(render('src/pages/Atelier.tsx'));
  for (const pattern of CLAIMS) assert.doesNotMatch(body, pattern, `claim rămas: ${pattern}`);
});

test('Atelier: croitoria proprie e legată explicit de rochiile la comandă, colecțiile de ajustare', () => {
  const body = text(render('src/pages/Atelier.tsx'));
  for (const phrase of [
    'Rochiile la comandă le croim aici, iar pe cele din colecții le ajustăm pe tine în același atelier.',
    'Când atelierul e la același etaj, o modificare nu mai înseamnă așteptare.',
    'Se măsoară, se desface și se coase din nou, la noi.',
    'La comandă', 'Pentru rochiile la comandă schițăm, croim și cusem în atelierul propriu.',
    'Din colecții', 'Rochiile din colecții sunt alese de noi și ajustate pe tine aici.',
    'Reparații', 'Inclusiv pe rochii care nu sunt cumpărate de la noi.',
    'Pentru o rochie la comandă desenăm varianta ta; pentru una din colecții notăm ce ajustăm față de model.',
    'Vezi rochia în lucru. Aici se corectează liniile, nu la final.',
  ]) assert.ok(body.includes(phrase), `lipsește: ${phrase}`);
  // Orice „croim/cusem/schițăm” apare doar în propoziții care spun „la comandă”.
  for (const sentence of body.split(/(?<=[.;])\s+/)) {
    if (/\b(croim|cusem|schițăm|desenăm)\b/i.test(sentence)) assert.match(sentence, /la comandă/i, sentence);
  }
});

test('Atelier: fără acoperirea pe județe nedocumentată și fără SALON.reach', () => {
  const body = text(render('src/pages/Atelier.tsx'));
  assert.doesNotMatch(body, /Vin mirese din|Acoperire/);
  assert.doesNotMatch(read('src/pages/Atelier.tsx'), /SALON\.reach/);
});

test('Atelier: textele alternative nu promit lucru manual sau rochii finalizate în atelier', () => {
  const list = alts(render('src/pages/Atelier.tsx'));
  assert.ok(list.length >= 4);
  for (const alt of list) {
    for (const pattern of [/manual/i, /finalizată/i, /croit/i, /brodat/i]) assert.doesNotMatch(alt, pattern, alt);
  }
});

test('Atelier: cadrele editoriale au caption de colecție, nu promit un interior real', () => {
  const markup = render('src/pages/Atelier.tsx');
  assert.ok(markup.includes('<figcaption>Emma · Colecția Aurora</figcaption>'));
  for (const image of ['AURORA/CARA/CARA_03_detaliu.jpg', 'AURORA/EMMA/EMMA_01_plan_intreg.jpg', 'NOBLESSE/FYA2803/FYA2803_03_detaliu_asezata.jpg', 'AURORA/CARA/CARA_01_plan_intreg.jpg', 'NOBLESSE/FYA2804/FYA2804_01_plan_intreg.jpg']) {
    assert.ok(markup.includes(`/images/${image}`), image);
  }
  assert.ok(markup.includes('href="/programare"'));
});

test('Footer: descriere fără „Design, execuție”, cu rochii la comandă, ajustări și reparații', () => {
  const body = text(render('src/ui/Footer.tsx'));
  assert.ok(body.includes('Salon și atelier de rochii de mireasă și de seară în Oradea. Rochii la comandă, ajustări și reparații.'));
  for (const pattern of [/Design/, /execuție/i, /făcute la noi/i, /externaliz/i]) assert.doesNotMatch(body, pattern);
  assert.ok(body.includes('Mihail Kogălniceanu nr. 44'));
});
