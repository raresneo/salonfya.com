# Catalog availability: 21 withdrawals

Base: main at 6390428cdb8bc6aa271090f90e54d18603d3f873.
Branch: fix/catalog-unavailable-21-20261109. Review only. No merge or production action authorized.

## Exact scope

- Imperial (5): Alma, Ivory Grace, Lumiere, Mayson, Queen.
- Anna collection (8): Anamaria, Anaria, Anatolia, Anavelle, Anelie, Annabelle, Annette, Just Anna.
- Mayra (2): Desideria, Miracle.
- Beverly (6): Aveline, Cediz, Celestia, Fyona, Solea, Valensia.

Baseline reported and confirmed by Rareș: 48 total (12 / 13 / 12 / 11).
Expected public result for that catalog: 27 total (Imperial 7 / Anna 5 / Mayra 10 / Beverly 5).

The exact collection/name policy applies before deduplication to local initial state, DB results, and every empty/error fallback. Database IDs may be UUIDs. A record with the same name in a different collection is not withdrawn.

The original catalog records and original image files are retained. No database rows, schemas, or admin records were changed. Anna's public cover uses Anais instead of Annabelle; the homepage static Alma photo uses the existing Argente photo. Existing collection videos are unchanged and have not been visually audited for withdrawn garments.

## Wishlist / booking safety

`useWishlist` only exposes IDs present in the current filtered catalog, including counters and `has`. On catalog settlement it removes withdrawn, unknown and duplicate IDs from local storage. It does not erase DB UUIDs while the initial local fallback is still loading. Attempts to toggle an unknown/withdrawn ID are rejected.

`Programare.tsx` was inspected and intentionally left unchanged: both `dressId` preselection and saved model names resolve exclusively through `useCatalog().dresses`. WhatsApp names use these resolved objects; the DB payload uses `dress?.id || null`, never the raw URL parameter or raw storage. Direct unavailable model routes also resolve only through the filtered catalog and show the existing unavailable state. No appointment was sent during QA.

## Executed checks

- Node 22: `node --test tests/catalog-availability.test.mjs tests/catalog-hooks.test.mjs`: 35 passed, 0 failed.
- Includes all 21 exact pairs, the 27 retained fixture pairs and collection counts, DB UUIDs, initial render, DB mapping, empty/error/all-withdrawn fallbacks, filter-before-dedupe, stale wishlist cleanup, counters, rejected re-addition, pending DB UUID preservation and malformed storage.
- Hook tests execute the actual TypeScript hook bodies with deterministic React/Supabase adapters. They do not contact a database. The 48-model count test uses the explicit baseline name fixture, not a browser/live query.
- Strict isolated TypeScript check for `catalogAvailability.ts`: passed.
- TypeScript transpilation diagnostics for the four new/changed policy and hook modules: none.

## Baseline vs new diagnostics

User-provided baseline QA for main 6390428: build passes; full tsc has 10 existing errors involving Seed.description, missing DressSeed and Reveal as h2. These were not repaired or expanded in scope.

Full application tsc, Vite build and browser end-to-end checks have NOT been rerun for this branch. The execution sandbox has no internet access, npm is unavailable, and a complete installed checkout is not present. Isolated checks do not establish that the full application has no new type errors. Full branch-to-baseline diagnostic comparison remains a review gate.

No paid service, deployment command, workflow run, database write, migration, image deletion, or PR #1 modification was requested by this implementation. Opening this branch/PR may cause repository-configured checks or previews automatically; those should be inspected read-only, not retriggered.

## Review commands (existing development environment)

```sh
node --test tests/catalog-availability.test.mjs tests/catalog-hooks.test.mjs
npx tsc --noEmit
npm run build
```

Manually verify the 27-model catalog and 7/5/10/5 collection counts; direct withdrawn URLs; `/programare?dressId=<withdrawn ID>`; and old `fya_wishlist` containing local slugs, database UUIDs, unknown IDs and available controls. Booking messages must list only available models and unavailable preselection must not send a dress ID. Do not submit a real booking while reviewing.
