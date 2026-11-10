# Aurora and Noblesse import

## Scope

- Source: user-supplied `fya_cadre_noi_FYA.csv`, 152 image rows, 51 dresses.
- Downloads: Aurora 33/33, Noblesse 119/119. No failed URLs or substitutions.
- Optimized: 152 JPEGs, quality 80, max 1920 pixels on each axis, no enlargement.
- Storage follows the existing uppercase collection directories: `public/images/AURORA/<cod>/...` and `NOBLESSE/<cod>/...`.
- New `scripts/optimize-images.cjs` added because it was absent from main and all existing branches/PRs.
- Sale prices only, RON, from the supplied CSV. No old prices or discounts.
- Public names are CARA, EMMA, MEGAN, the remaining Aurora names, and FYA2801-FYA2840. QUEEN has ID `aurora-queen`.
- AI disclosure was removed at the owner's explicit request on November10,21:46. Generated-image origin is unchanged.
- No generation or paid services used.

## Data behavior

Supabase is read-only. New collections are projected from the approved CSV even if Supabase returns existing dresses. DB rows for Aurora/Noblesse are not used to override that approved data. Existing collection rows retain their current behavior and withdrawal filter. A future transition to DB editing of the new collections must deliberately remove this CSV projection.

`supabase/proposed/colectii_noi.sql` was **not executed**. It contains 51 dress INSERTs and no writes to existing dresses. Existing collection IDs AURORA and NOBLESSE are prerequisites because the repository schema uses a foreign key. This file does not create the collections, alter the schema, change policies, or import anything automatically.

## Validation

- `npx tsc --noEmit`: exit 0, no output. Fixed existing Seed/DressSeed mismatch and added the already-used h2 tag to Reveal's type.
- `npm run build`: exit 0.
- `node --test tests/*.test.mjs`: 208/208 pass.
- Local browser: 7 routes at 390 and 1280 pixels, no overflow/broken images. Tested Supabase containing only an existing dress and an empty response.
- All 51 new product routes: exact names, prices, image count, disclosure count, no broken images or mobile overflow.
- Actual screenshots inspected. Fixed disclosure selector disturbing hero positioning. New portrait heroes preserve whole garments instead of cropping them to wide backgrounds.
- Sitemap: 88 indexable URLs (10 routes plus 78 active dresses). Existing 21 withdrawals remain excluded.

## Still required

- GitHub push, PR and hosted Vercel Preview, blocked until repo-scoped GitHub write access is supplied.
- Hosted desktop and phone verification before merge.
- Owner decision on supplied image variants before merge. Some sets show different sleeves/accessories; Brain context mentions detachable pieces, but this is not independent proof of exact garment fidelity.
- Separate explicit approval before any DB import. None performed here.
- Existing public-repository credential exposure is outside this change. No secrets were copied into new code or reports, and no credentials were rotated.
