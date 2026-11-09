# Tema 2026: checklist QA (preview only)

Verificare pe preview, iPhone (390x844) și desktop (1440). Nu trimite formularul de programare: scrie în DB și pornește Pixelul.

## Global
- [ ] Pagina apare imediat, fără cortină/preloader. Titlul hero intră scurt o singură dată.
- [ ] Fără parallax, fără bandă rulantă, fără cursor personalizat pe desktop, fără scroll hijack. Scroll nativ.
- [ ] Nav compact (~52px mobil). Pe paginile deschise (produs, 404) navul are fond crem de la început, textul nu trece peste poze.
- [ ] Butoane: plum pe crem, crem pe plum. Accentul lemn de trandafir doar pe linkuri și stări active.
- [ ] Nicio etichetă sub 12px. Tap targets de cel puțin 44px (burger, chips, sloturi oră, linkuri footer, Închide).
- [ ] Fără overflow orizontal pe 320, 375, 390 și 430px pe toate rutele.

## Reduced motion (iOS: Accesibilitate > Mișcare > Reducere mișcare)
- [ ] Home și paginile de colecție: doar posterul, fără video și fără autoplay.
- [ ] Conținutul apare direct, fără animații de intrare.

## Rute
- [ ] Home: video hero vizibil (fără voal greu), colecțiile mari, banda statică, CTA final.
- [ ] /colectii: hero cu imagine dominantă, filtre pe un rând derulabil, grilă pe 2 coloane, TOATE 27 (7/5/10/5).
- [ ] /imperial, /anna, /mayra, /beverly și /colectia/:slug: hero, numărul de modele, grilă pe 2 coloane.
- [ ] Produs (Argente + un model cu o singură imagine): imagine principală de la margine la margine, nume, descriere, CTA, apoi galeria derulabilă orizontal; lightbox ok; prev/next ok.
- [ ] /atelier și /despre-noi: hero, manifest, pașii, poza atelierului la opacitate completă.
- [ ] /programare: calendar lizibil, sloturi 44px, harta, previzualizarea mesajului. Fără trimitere.
- [ ] Footer și bara de jos pe mobil: CTA crem pe plum, fără suprapuneri.

## Neschimbate (de confirmat)
- [ ] Catalogul de 27, retragerile, copy-ul neutru, SEO/canonical/sitemap/robots, booking, Meta Pixel, DB, contact.
- [ ] Adresa: neatinsă în acest PR (este în PR #5).
- [ ] Niciun font, imagine, video sau claim nou.
