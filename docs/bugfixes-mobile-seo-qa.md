# QA: bugfixes mobile, accesibilitate și SEO (PR draft, preview only)

Bază: main d7cfc79e39c9e95d0259da2a04425bcd17f4d826 (după merge PR #3). STOP înainte de merge: necesită un nou „da” după preview.
Neatinse: PR #1, adresa, tema (culori/fonturi), imaginile, video-urile, programarea, Meta Pixel, DB, catalogul (27 active: 7/5/10/5; 21 retrase excluse).

## Probleme verificate înainte de lucru (read-only, 9 nov 2026)

- /robots.txt și /sitemap.xml returnau aplicația SPA cu pagina 404, nu fișiere reale.
- www.salonfya.com și salonfya.com servesc ambele site-ul, fără redirect. index.html declară canonical pe www, deci păstrăm www.
- /colectii (și /colectia/:slug) au hero întunecat, dar navul primea text închis (lipseau din lista DARK_HERO): contrast slab peste fundal închis.
- Peste 980px, butonul flotant „Programează” dubla CTA-ul din header și acoperea carduri și ultima linie din footer.
- Meniul mobil (z-index 62) stătea sub bara de jos (z-index 70); închis, rămânea focusabil.
- DressPage pe mobil: numele, descrierea și CTA-ul apăreau abia după toată galeria.
- Tap targets sub 44px: burger, logo, chips, prev/next, „Închide”, linkuri footer.
- Fiecare schimbare de rută derula animat până sus (clasa scroll-smooth), iar scroll-smooth ignora reduced motion.
- useScrollFx rula un requestAnimationFrame continuu și citea layoutul la fiecare frame, inclusiv cu pagina nemișcată.
- După navigare de pe o pagină derulată, navul putea rămâne „solid” pe noua pagină (starea nu se resincroniza).

## Ce s-a schimbat

- `src/lib/seo.ts`: title, description, canonical, og:title/description/url și robots per rută. Home identic cu index.html. Catalog, Atelier (și alias /despre-noi -> canonical /atelier), Programare, colecții (/colectia/:slug -> canonical /slug), produs (descrierea neutră din PR #3). 404, model indisponibil și colecție necunoscută: noindex, fără canonical. /admin: noindex,nofollow.
- `public/robots.txt`: permite tot, blochează /admin, indică sitemap-ul. `public/sitemap.xml`: 8 rute indexabile + exact cele 27 modele active (35 URL-uri, host www). Fără lastmod/priority inventate.
- `src/lib/routes.ts` + App: navul detectează hero întunecat pe /colectii și pe toate aliasurile de colecție.
- `src/styles/mobile-fixes.css` (încărcat ultimul): umbră scurtă sub nav doar peste hero, linkuri active în nisip pe fundal închis, butonul flotant doar 700–979px, footer cu spațiu sub el în acel interval, meniul mobil peste bara de jos și ascuns complet când e închis, tap targets 44px pe touch, grid DressPage, reduced motion pentru scroll/bandă/tranziții.
- DressPage: imaginea principală, apoi numele, descrierea și CTA-urile, apoi restul galeriei și schițele. Desktop: galeria stânga, informațiile sticky dreapta, ca înainte.
- `src/lib/motion.tsx`: scroll FX doar la scroll/resize, cel mult un frame per rafală; resincronizează navul la schimbarea rutei. App: scroll instant la navigare.

## Limite SPA (fără promisiuni SEO)

- Serverul trimite același index.html pentru toate rutele; title/description/canonical per rută apar doar după rularea JavaScript. Crawlerele care nu execută JS (multe previzualizări sociale, unele motoare) văd valorile homepage-ului din index.html. Pentru meta fără JS ar fi nevoie de prerender/SSR, în afara acestui PR.
- Rutele inexistente răspund tot cu HTTP 200 (rewrite SPA). noindex-ul este aplicat client-side; nu există un 404 HTTP real.
- Sitemap-ul este static și folosește ID-urile catalogului local (live folosește acum aceste ID-uri, /rochie/imperial-argente). Dacă Supabase devine sursa cu UUID-uri, linkurile din sitemap trebuie regenerate; testul verifică sincronizarea cu catalogul local.
- Redirectul apex -> www este o setare de domeniu Vercel, nu cod. Nu a fost modificat.
- Nu garantăm indexare, poziții sau trafic.

## Teste executate

- `node --test tests/catalog-availability.test.mjs tests/catalog-hooks.test.mjs tests/public-dress-copy.test.mjs tests/bugfixes.test.mjs`: 111/111 trecute (69 existente + 42 noi).
- Noile teste: catalog real 27 (7/5/10/5) fără retrase; rute hero; SEO home identic cu index.html; rute statice, aliasuri, admin; colecții; SEO pentru fiecare din cele 27 produse; noindex pentru 404/indisponibil; applySeo fără duplicate și cu canonical eliminat/restabilit; sitemap = exact rutele indexabile + 27 active, fără retrase; robots; scroll FX fără buclă continuă, rafale coalescate, resincronizare nav, reduced motion; DressPage randat cu React real pentru toate cele 27: imagine principală < nume < descriere < CTA < restul galeriei < schițe; cazurile cu o singură imagine, indisponibil și încărcare; wiring App/index; regulile CSS.
- Teste de mutație manuale: galeria mutată înaintea informațiilor, Alma în sitemap, bucla rAF continuă, /colectii scos din hero și butonul flotant reactivat pe desktop sunt toate prinse de teste.
- TypeScript strict izolat pentru seo.ts, routes.ts și dependențe: trecut. Diagnostic sintactic pentru App, DressPage, CollectionPage, motion, index: fără erori.
- Limite locale: sandbox fără internet și fără checkout complet. Sitemap/catalog au rulat local pe o reproducere a catalog.ts cu aceeași funcție slug și cele 48 de nume; în repo rulează pe fișierul real. Full tsc, npm build și E2E browser nu au fost rerulate local; previewul Vercel este protejat de login.

## QA independent înainte de orice merge

1. Rerulează cele 111 teste, npm build și full tsc; compară cu cele 10 erori existente pe main.
2. Mobil (390x844 și 360x780): DressPage pentru mai multe modele, info+CTA imediat după prima imagine; meniul deschis acoperă bara de jos; închis nu primește focus; tap targets; fără overlap CTA.
3. Desktop (1440x900): fără buton flotant peste 980px; footer complet vizibil; DressPage cu info sticky; nav lizibil pe /, /colectii, colecții, /atelier, /programare; nav închis pe /rochie, 404.
4. Reduced motion activ: fără derulare animată, fără bandă rulantă, fără parallax.
5. /robots.txt și /sitemap.xml pe preview returnează fișierele, nu aplicația. Title/description/canonical per rută în DevTools.
6. Programare fără submit; Meta Pixel neschimbat. STOP fără merge.
