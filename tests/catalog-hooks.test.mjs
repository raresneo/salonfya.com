import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

// Test the actual hook bodies with deterministic React/Supabase adapters, no network or DB writes.
const url = (code) => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
let serial = 0;
const compile = (path, imports = {}) => {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8');
  return url(ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    transformers: {
      before: [(context) => {
        const visit = (node) => {
          if (ts.isImportDeclaration(node) && imports[node.moduleSpecifier.text]) {
            return ts.factory.updateImportDeclaration(
              node, node.modifiers, node.importClause,
              ts.factory.createStringLiteral(imports[node.moduleSpecifier.text]), node.attributes
            );
          }
          return ts.visitEachChild(node, visit, context);
        };
        return (node) => ts.visitNode(node, visit);
      }],
    },
  }).outputText + `\n// isolated import ${serial++}`);
};
const policy = compile('../src/data/catalogAvailability.ts');
const copy = compile('../src/data/publicDressCopy.ts', { './catalogAvailability': policy });
const types = compile('../src/types.ts');
const { UNAVAILABLE_MODELS, filterAvailableDresses } = await import(policy);
const { PUBLIC_COPY_MODELS, UNKNOWN_PUBLIC_DESCRIPTION, withPublicDescriptions } = await import(copy);
const local = [
  ...UNAVAILABLE_MODELS.map(([collection, name], index) => ({
    id: `local-withdrawn-${index}`, collection, name, imageUrl: `/withdrawn-${index}.jpg`,
    images: [`/withdrawn-${index}.jpg`],
  })),
  { id: 'imperial-argente', collection: 'Imperial', name: 'Argente', imageUrl: '/argente.jpg', images: ['/argente.jpg'] },
  { id: 'anna-anais', collection: 'Anna', name: 'Anais', imageUrl: '/anais.jpg', images: ['/anais.jpg'] },
];
const react = url(`
  export const useState = (initial) => {
    const h = globalThis.__fyaHookTest;
    if (!('state' in h)) h.state = typeof initial === 'function' ? initial() : initial;
    return [h.state, (next) => { h.state = typeof next === 'function' ? next(h.state) : next; }];
  };
  export const useEffect = (effect) => { globalThis.__fyaHookTest.effects.push(effect); };
  export const useMemo = (fn) => fn();
  export const useCallback = (fn) => fn;
`);
const publicCatalog = url(`
  export const LOCAL_CATALOG = ${JSON.stringify(local)};
  export { withPublicDescriptions } from '${copy}';
`);
const supabase = url(`
  export const isSupabaseConfigured = true;
  export const supabase = { from: () => ({ select: async () => globalThis.__fyaHookTest.result }) };
`);

const loadCatalog = async (result) => {
  globalThis.__fyaHookTest = { effects: [], result };
  const module = await import(compile('../src/lib/useCatalog.ts', {
    react, '../types': types, '../data/publicCatalog': publicCatalog,
    '../data/catalogAvailability': policy, './supabase': supabase,
  }));
  const initial = module.useCatalog();
  for (const effect of globalThis.__fyaHookTest.effects) effect();
  await Promise.resolve();
  await Promise.resolve();
  return { initial, settled: globalThis.__fyaHookTest.state };
};
const dbRows = UNAVAILABLE_MODELS.map(([collection, name], index) => ({
  id: `db-withdrawn-${index}`, collection_id: collection.toUpperCase(), name,
  images: [`/db-${index}.jpg`],
}));

test('actual useCatalog filters the initial render and mapped Supabase rows', async () => {
  const { initial, settled } = await loadCatalog({
    data: [...dbRows, { id: 'db-argente', name: 'Argente', collection_id: 'IMPERIAL', images: ['/argente.jpg'] }],
    error: null,
  });
  assert.deepEqual(initial.dresses, withPublicDescriptions(local));
  assert.equal(initial.loading, true);
  assert.equal(settled.source, 'db');
  assert.equal(settled.loading, false);
  assert.deepEqual(settled.dresses.map((dress) => dress.id), ['db-argente']);
});

test('actual useCatalog error, empty and all-withdrawn responses use safe fallback', async () => {
  for (const result of [
    { data: null, error: { message: 'offline fixture' } },
    { data: [], error: null },
    { data: dbRows, error: null },
  ]) {
    const { settled } = await loadCatalog(result);
    assert.equal(settled.source, 'local');
    assert.equal(settled.loading, false);
    assert.deepEqual(settled.dresses, withPublicDescriptions(local));
  }
});

test('withdrawn database covers cannot shadow an available model during deduplication', async () => {
  const { settled } = await loadCatalog({
    data: [
      { id: 'db-alma', name: 'Alma', collection_id: 'IMPERIAL', images: ['/shared.jpg'] },
      { id: 'db-argente', name: 'Argente', collection_id: 'IMPERIAL', images: ['/shared.jpg'] },
    ],
    error: null,
  });
  assert.deepEqual(settled.dresses.map((dress) => dress.id), ['db-argente']);
});

test('actual Supabase mapping applies Romanian copy to all 27, neutralizes unknowns and excludes all 21', async () => {
  const active = PUBLIC_COPY_MODELS.map(([collection, name], index) => ({
    id: `uuid-active-${index}`, collection_id: collection.toUpperCase(), name,
    description: 'Wedding dress strapless mermaid', images: [`/active-${index}.jpg`],
  }));
  const unknown = { id: 'uuid-unknown', collection_id: 'ANNA', name: 'Unknown', description: 'English stock promise', images: ['/unknown.jpg'] };
  const { settled } = await loadCatalog({ data: [...active, ...dbRows, unknown], error: null });
  assert.equal(settled.source, 'db');
  assert.equal(settled.dresses.length, 28);
  for (const [index, [collection, name]] of PUBLIC_COPY_MODELS.entries()) {
    const model = settled.dresses.find((dress) => dress.id === `uuid-active-${index}`);
    assert.equal(model.description, withPublicDescriptions([{ collection, name, description: '' }])[0].description);
  }
  assert.equal(settled.dresses.find((dress) => dress.id === 'uuid-unknown').description, UNKNOWN_PUBLIC_DESCRIPTION);
  assert.equal(settled.dresses.some((dress) => dress.id.startsWith('db-withdrawn-')), false);
});

const wishlistCatalog = url('export const useCatalog = () => globalThis.__fyaHookTest.catalog;');
const loadWishlist = async (raw, catalog) => {
  const events = new EventTarget();
  let stored = raw;
  const oldWindow = globalThis.window;
  globalThis.window = {
    localStorage: {
      getItem: () => stored,
      setItem: (_key, value) => { stored = value; },
    },
    addEventListener: events.addEventListener.bind(events),
    removeEventListener: events.removeEventListener.bind(events),
    dispatchEvent: events.dispatchEvent.bind(events),
  };
  globalThis.__fyaHookTest = { effects: [], catalog };
  const module = await import(compile('../src/lib/useWishlist.ts', {
    react, '../data/catalogAvailability': policy, './useCatalog': wishlistCatalog,
  }));
  const render = () => {
    globalThis.__fyaHookTest.effects = [];
    const state = module.useWishlist();
    return { state, effects: globalThis.__fyaHookTest.effects };
  };
  return {
    render, stored: () => JSON.parse(stored),
    restore: () => { globalThis.window = oldWindow; },
  };
};

test('actual wishlist hides and purges stale IDs, rejects re-adding them, and updates counters', async () => {
  const available = filterAvailableDresses(local);
  const old = [...local.map((dress) => dress.id), 'orphan-uuid', available[0].id];
  const h = await loadWishlist(JSON.stringify(old), { dresses: available, loading: false });
  try {
    const { state, effects } = h.render();
    assert.deepEqual(state.ids, available.map((dress) => dress.id));
    assert.equal(state.count, 2);
    assert.equal(state.has(local[0].id), false);
    const cleanups = effects.map((effect) => effect());
    assert.deepEqual(h.stored(), available.map((dress) => dress.id));
    assert.equal(state.toggle(local[0].id), false);
    assert.equal(state.toggle(available[0].id), false);
    assert.equal(h.render().state.count, 1);
    state.clear();
    assert.equal(h.render().state.count, 0);
    cleanups.forEach((cleanup) => cleanup?.());
  } finally { h.restore(); }
});

test('wishlist never deletes valid DB UUIDs before catalog loading settles', async () => {
  const old = ['db-argente', 'db-withdrawn-0'];
  const h = await loadWishlist(JSON.stringify(old), { dresses: filterAvailableDresses(local), loading: true });
  try {
    const first = h.render();
    assert.deepEqual(first.state.ids, []);
    const cleanups = first.effects.map((effect) => effect());
    assert.deepEqual(h.stored(), old);
    globalThis.__fyaHookTest.catalog = {
      dresses: [{ id: 'db-argente', name: 'Argente', collection: 'Imperial' }], loading: false,
    };
    const second = h.render();
    assert.deepEqual(second.state.ids, ['db-argente']);
    const secondCleanups = second.effects.map((effect) => effect());
    assert.deepEqual(h.stored(), ['db-argente']);
    [...cleanups, ...secondCleanups].forEach((cleanup) => cleanup?.());
  } finally { h.restore(); }
});

test('malformed or non-array old storage never exposes IDs', async () => {
  for (const raw of ['{broken', '{"id":"imperial-alma"}', 'null']) {
    const h = await loadWishlist(raw, { dresses: filterAvailableDresses(local), loading: false });
    try { assert.equal(h.render().state.count, 0); } finally { h.restore(); }
  }
});
