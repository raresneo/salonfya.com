import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

const url = (code) => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
const compile = (path, imports = {}) => url(ts.transpileModule(
  readFileSync(new URL(path, import.meta.url), 'utf8'),
  {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    transformers: {
      before: [(context) => {
        const visit = (node) => {
          if (ts.isExportDeclaration(node) && node.moduleSpecifier && imports[node.moduleSpecifier.text]) {
            return ts.factory.updateExportDeclaration(
              node, node.modifiers, node.isTypeOnly, node.exportClause,
              ts.factory.createStringLiteral(imports[node.moduleSpecifier.text]), node.attributes
            );
          }
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
  }
).outputText);
const policyUrl = compile('../src/data/catalogAvailability.ts');
const { UNAVAILABLE_MODELS } = await import(policyUrl);
const copyUrl = compile('../src/data/publicDressCopy.ts', { './catalogAvailability': policyUrl });
const {
  PUBLIC_COPY_MODELS, PUBLIC_SKETCH_NOTE, UNKNOWN_PUBLIC_DESCRIPTION,
  publicDressDescription, withPublicDescriptions,
} = await import(copyUrl);

// Independent expected list: do not derive coverage from the copy manifest itself.
const expected = {
  Imperial: ['Argente', 'Aurelia', 'Daiana', 'Elia', 'Elise', 'Evora', 'Serena'],
  Anna: ['Anais', 'Anamara', 'Anastasia', 'Anastea', 'Annador'],
  Mayra: ['Adania', 'Celina', 'Elvira', 'Grazia', 'Isadora', 'Luminia', 'Roze', 'Snow', 'Tania', 'Taniana'],
  Beverly: ['Beauty', 'Bety', 'Candy', 'Marisa', 'Nolli'],
};
const active = Object.entries(expected).flatMap(([collection, names]) =>
  names.map((name) => ({ collection, name }))
);

test('copy coverage is exactly the 27 active pairs with 7/5/10/5 counts', () => {
  assert.deepEqual(PUBLIC_COPY_MODELS, active.map(({ collection, name }) => [collection, name]));
  assert.equal(PUBLIC_COPY_MODELS.length, 27);
  assert.equal(new Set(PUBLIC_COPY_MODELS.map((pair) => JSON.stringify(pair))).size, 27);
});

for (const { collection, name } of active) {
  test(`Romanian copy for ${collection}/${name}: DB UUID and local ID match without unsafe claims`, () => {
    const description = `${name}, din colecția ${collection} a Salonului FYA. Pentru detalii despre model și programarea unei probe, contactează atelierul.`;
    const local = { collection, name, id: `${collection}-${name}`, description: 'Wedding dress strapless mermaid silk' };
    const db = { ...local, id: `uuid-${name}`, description: 'Wrong legacy AI prompt', images: ['/existing.jpg'] };
    assert.equal(publicDressDescription(local), description);
    assert.equal(withPublicDescriptions([local])[0].description, description);
    assert.equal(withPublicDescriptions([db])[0].description, description);
    assert.equal(withPublicDescriptions([{ ...db, description: '' }])[0].description, description);
    assert.deepEqual(withPublicDescriptions([db])[0].images, db.images);
    assert.doesNotMatch(description, /strapless|mermaid|silk|dantel|satin|mătase|mâneci|mărim|lei|stoc|garant|croial/i);
  });
}

test('collection/name normalization does not leak copy to a different or unknown collection', () => {
  assert.equal(
    publicDressDescription({ collection: ' IMPERIAL ', name: '  Árgente  ' }),
    publicDressDescription({ collection: 'Imperial', name: 'Argente' })
  );
  for (const model of active) {
    assert.equal(publicDressDescription({ ...model, collection: 'Unknown' }), UNKNOWN_PUBLIC_DESCRIPTION);
    assert.equal(publicDressDescription({ ...model, collection: undefined }), UNKNOWN_PUBLIC_DESCRIPTION);
    assert.equal(publicDressDescription({ ...model, name: `${model.name} II` }), UNKNOWN_PUBLIC_DESCRIPTION);
  }
  assert.equal(withPublicDescriptions([
    { collection: 'Anna', name: 'Unknown', description: 'English silk stock promise' },
  ])[0].description, UNKNOWN_PUBLIC_DESCRIPTION);
});

test('all 21 withdrawals stay excluded in local and DB-shaped projections', () => {
  for (const [collection, name] of UNAVAILABLE_MODELS) {
    assert.equal(publicDressDescription({ collection, name }), UNKNOWN_PUBLIC_DESCRIPTION);
    assert.deepEqual(withPublicDescriptions([
      { collection, name, id: `local-${name}`, description: 'legacy' },
      { collection, name, id: `uuid-${name}`, description: 'legacy' },
    ]), []);
  }
  const all = [...active, ...UNAVAILABLE_MODELS.map(([collection, name]) => ({ collection, name }))]
    .map((model) => ({ ...model, description: 'legacy' }));
  const result = withPublicDescriptions(all);
  assert.equal(result.length, 27);
  assert.deepEqual(
    Object.fromEntries(Object.keys(expected).map((collection) =>
      [collection, result.filter((dress) => dress.collection === collection).length])),
    { Imperial: 7, Anna: 5, Mayra: 10, Beverly: 5 }
  );
});

test('projection is immutable and idempotent, preserving all unrelated model fields', () => {
  const original = Object.freeze({
    collection: 'Imperial', name: 'Argente', id: 'uuid', description: 'strapless mermaid',
    price: 123, sizes: ['unchanged'], imageUrl: '/unchanged.jpg',
  });
  const result = withPublicDescriptions([original]);
  assert.equal(original.description, 'strapless mermaid');
  assert.deepEqual(result, withPublicDescriptions(result));
  assert.deepEqual({ ...result[0], description: original.description }, original);
  assert.deepEqual(withPublicDescriptions([]), []);
});

test('sketch caption makes no claim of provenance or production chronology', () => {
  assert.equal(PUBLIC_SKETCH_NOTE, 'Schițe de prezentare pentru acest model.');
  assert.doesNotMatch(PUBLIC_SKETCH_NOTE, /original|înainte|croial|execut|manual|concept/i);
});

test('actual publicCatalog fallback projects all 27 and retains metadata without mutating the seed', async () => {
  const typesUrl = compile('../src/types.ts');
  const original = [...active, ...UNAVAILABLE_MODELS.map(([collection, name]) => ({ collection, name }))]
    .map((model) => ({ ...model, id: `${model.collection}-${model.name}`, description: 'legacy English', imageUrl: `/${model.name}.jpg` }));
  const collections = Object.keys(expected).map((collection) => ({
    collection, slug: collection.toLowerCase(), path: `/${collection.toLowerCase()}`,
    note: 'unchanged', intro: 'unchanged', cover: '/original-cover.jpg',
  }));
  const catalogUrl = url(`export const LOCAL_CATALOG = ${JSON.stringify(original)};
    export const COLLECTIONS = ${JSON.stringify(collections)};`);
  const projected = await import(compile('../src/data/publicCatalog.ts', {
    '../types': typesUrl, './catalog': catalogUrl, './publicDressCopy': copyUrl,
  }));
  assert.deepEqual(projected.LOCAL_CATALOG, withPublicDescriptions(original));
  assert.equal(projected.LOCAL_CATALOG.length, 27);
  const baseline = await import(catalogUrl);
  assert.equal(baseline.LOCAL_CATALOG.length, 48);
  assert.equal(baseline.LOCAL_CATALOG[0].description, 'legacy English');
  for (const meta of projected.COLLECTIONS) {
    assert.equal(meta.intro, 'unchanged');
    assert.equal(meta.note, 'unchanged');
    assert.equal(meta.cover, meta.collection === 'Anna' ? '/Anais.jpg' : '/original-cover.jpg');
  }
});
