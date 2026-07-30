# salonfya.com

Site-ul Salon FYA: atelier de rochii de mireasă din Oradea. Vite + React 19 +
TypeScript, găzduit pe Vercel, date în Supabase.

## Pornire locală

```bash
npm install
cp .env.example .env   # completează valorile
npm run dev            # http://localhost:3001
```

## Variabile de mediu

Se setează în **Vercel → Project Settings → Environment Variables** pentru
producție și în `.env` local. Fișierul `.env` este ignorat de git; nu pune chei
reale în repo.

| Variabilă | Obligatorie | Ce face |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | da | proiectul Supabase |
| `VITE_SUPABASE_ANON_KEY` | da | citirea publică a catalogului, inserarea programărilor |
| `SUPABASE_SERVICE_ROLE` | doar server | scripturi și funcții; **niciodată** expusă în browser |
| `GEMINI_API_KEY` | opțional | generări de conținut |
| `BLOB_READ_WRITE_TOKEN` | pentru `/admin` | upload de imagini prin `api/upload.ts` |
| `META_PIXEL_ID`, `META_ACCESS_TOKEN` | opțional | Conversions API în `api/meta-conversion.js` |

Variabilele `VITE_*` sunt injectate **la build**, nu la runtime. După ce le
modifici în Vercel trebuie **Redeploy**, altfel rămâne build-ul vechi.

## Baza de date

Rulează `supabase_schema.sql` în SQL Editor. Creează `collections`, `dresses`,
`programari` și politicile RLS. Scriptul poate fi rulat de mai multe ori.

## Catalogul de rochii

Două surse, în ordinea aceasta:

1. **Supabase**, tabela `dresses`. Ce editează echipa din `/admin`.
2. **`src/data/catalog.ts`**, plasa de siguranță cu cele 49 de rochii și
   fotografiile din `public/images`. Se folosește când tabela e goală sau
   variabilele de mediu lipsesc, ca site-ul să nu apară niciodată fără produse.

Colecția din baza de date e normalizată în `src/lib/useCatalog.ts`, deci
`IMPERIAL`, `Imperial` și `Colecția Imperial` sunt tratate identic.

### De completat

- prețuri, mărimi și descrieri per rochie, din `/admin`
- datele reale de contact în `src/data/salon.ts` (telefon, adresă, social)
- fotografii cu mirese reale, pentru secțiunea de social proof

## Structură

```
src/
  data/      catalog.ts (rochii), salon.ts (date de contact)
  lib/       supabase.ts, useCatalog.ts, useWishlist.ts, motion.tsx
  pages/     Homepage, CollectionsIndex, CollectionPage, DressPage,
             Atelier, Programare, Admin
  ui/        Nav, Footer, Preloader, DressCard
  index.css  design system complet (tokens OKLCH, tipografie, motion)
api/         funcții Vercel: upload imagini, Meta Conversions API
```

## Rute

| Rută | Pagină |
| --- | --- |
| `/` | homepage |
| `/colectii` | toate rochiile, cu filtre |
| `/imperial`, `/anna`, `/mayra`, `/beverly` | pagină de colecție |
| `/rochie/:id` | pagină dedicată unei rochii |
| `/atelier` | procesul de lucru |
| `/programare` | formular de programare |
| `/admin` | administrare catalog |

## Deploy

Push pe `main` declanșează build pe Vercel. Framework Vite, build `npm run build`,
output `dist`. `vercel.json` rescrie totul către `index.html` pentru rutarea
client-side.
