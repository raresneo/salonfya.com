import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

// Load the real TypeScript module without adding a test dependency or changing the build.
const source = readFileSync(new URL('../src/data/catalogAvailability.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText;
const { UNAVAILABLE_MODELS, filterAvailableDresses, isUnavailableDress, retainAvailableWishlistIds } =
  await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

const expected = {
  Imperial: ['Alma', 'Ivory Grace', 'Lumiere', 'Mayson', 'Queen'],
  Anna: ['Anamaria', 'Anaria', 'Anatolia', 'Anavelle', 'Anelie', 'Annabelle', 'Annette', 'Just Anna'],
  Mayra: ['Desideria', 'Miracle'],
  Beverly: ['Aveline', 'Cediz', 'Celestia', 'Fyona', 'Solea', 'Valensia'],
};
const withdrawn = Object.entries(expected).flatMap(([collection, names]) =>
  names.map((name) => ({ id: `${collection.toLowerCase()}-${name.toLowerCase().replaceAll(' ', '-')}`, name, collection }))
);
const retained = {
  Imperial: ['Argente', 'Aurelia', 'Daiana', 'Elia', 'Elise', 'Evora', 'Serena'],
  Anna: ['Anais', 'Anamara', 'Anastasia', 'Anastea', 'Annador'],
  Mayra: ['Adania', 'Celina', 'Elvira', 'Grazia', 'Isadora', 'Luminia', 'Roze', 'Snow', 'Tania', 'Taniana'],
  Beverly: ['Beauty', 'Bety', 'Candy', 'Marisa', 'Nolli'],
};
const available = Object.entries(retained).flatMap(([collection, names]) =>
  names.map((name) => ({ id: `${collection.toLowerCase()}-${name.toLowerCase()}`, name, collection }))
);

test('manifest contains exactly the 21 approved pairs, no extras or duplicates', () => {
  assert.equal(UNAVAILABLE_MODELS.length, 21);
  assert.deepEqual(UNAVAILABLE_MODELS, withdrawn.map(({ collection, name }) => [collection, name]));
  assert.equal(new Set(UNAVAILABLE_MODELS.map((pair) => JSON.stringify(pair))).size, 21);
});

for (const dress of withdrawn) {
  test(`excludes ${dress.collection} / ${dress.name} with local or database IDs`, () => {
    assert.equal(isUnavailableDress(dress), true);
    assert.deepEqual(filterAvailableDresses([dress, { ...dress, id: 'database-uuid' }]), []);
  });
}

test('preserves all 27 other collection/model pairs from the baseline catalog', () => {
  assert.equal(available.length, 27);
  assert.deepEqual(filterAvailableDresses([...withdrawn, ...available]), available);
  assert.deepEqual(filterAvailableDresses(available), available);
  assert.deepEqual(
    Object.fromEntries(Object.keys(expected).map((collection) => [
      collection, available.filter((dress) => dress.collection === collection).length,
    ])),
    { Imperial: 7, Anna: 5, Mayra: 10, Beverly: 5 }
  );
});

test('case, diacritics and whitespace normalize without fuzzy or name-only matching', () => {
  assert.equal(isUnavailableDress({ collection: ' IMPERIAL ', name: '  Ívory   Grace ' }), true);
  for (const dress of withdrawn) {
    assert.equal(isUnavailableDress({ ...dress, collection: 'Another collection' }), false);
    assert.equal(isUnavailableDress({ ...dress, collection: undefined }), false);
    assert.equal(isUnavailableDress({ ...dress, name: `${dress.name} II` }), false);
  }
  assert.equal(isUnavailableDress({ collection: 'Anna', name: 'Anna' }), false);
});

test('Supabase-like UUID rows are excluded by collection and name, not seed ID', () => {
  const rows = [...withdrawn, ...available].map((dress, index) => ({ ...dress, id: `uuid-${index}` }));
  assert.deepEqual(filterAvailableDresses(rows), rows.slice(21));
});

test('an all-withdrawn database result cannot resurrect withdrawn fallback records', () => {
  const local = filterAvailableDresses([...withdrawn, ...available]);
  const rows = filterAvailableDresses(withdrawn);
  assert.deepEqual(rows.length ? rows : local, available);
  assert.deepEqual(filterAvailableDresses([]), []);
});

test('old wishlist drops withdrawn, unknown and duplicate IDs from display and bookings', () => {
  const old = [...withdrawn.map((dress) => dress.id), available[0].id, 'orphan-uuid', available[0].id];
  assert.deepEqual(retainAvailableWishlistIds(old, [...withdrawn, ...available]), [available[0].id]);
  assert.deepEqual(retainAvailableWishlistIds(old, []), []);
});

test('database UUID wishlist retains only currently available models', () => {
  const rows = [
    { ...withdrawn[0], id: 'withdrawn-db-uuid' },
    { ...available[0], id: 'available-db-uuid' },
  ];
  assert.deepEqual(
    retainAvailableWishlistIds(['withdrawn-db-uuid', 'available-db-uuid', withdrawn[0].id, 'orphan'], rows),
    ['available-db-uuid']
  );
});

test('filtering is idempotent and never mutates source records or stored IDs', () => {
  const rows = Object.freeze([...withdrawn, ...available].map((dress) => Object.freeze({ ...dress })));
  const ids = Object.freeze(rows.map((dress) => dress.id));
  const filtered = filterAvailableDresses(rows);
  assert.deepEqual(filterAvailableDresses(filtered), filtered);
  assert.deepEqual(retainAvailableWishlistIds(ids, rows), available.map((dress) => dress.id));
  assert.equal(rows.length, 48);
  assert.equal(ids.length, 48);
});
