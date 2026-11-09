/**
 * Datele publice ale salonului, într-un singur loc.
 *
 * Adresa actuală: confirmată de Rareș la 9 noiembrie 2026.
 * Hărțile caută adresa completă; fără coordonate sau cod poștal neverificate.
 * Celelalte date: fișa WhatsApp Business și paginile sociale conectate.
 */
export const SALON = {
  name: 'Salon FYA',
  legalName: 'Salon Fya',
  tagline: 'Fancy, Young & Admired',

  city: 'Oradea',
  county: 'Bihor',
  street: 'Mihail Kogălniceanu nr. 44',
  address: 'Mihail Kogălniceanu nr. 44, Oradea',
  addressFull: 'Mihail Kogălniceanu nr. 44, Oradea, Bihor',

  phone: '+40 727 844 228',
  phoneHref: '+40727844228',
  whatsapp: '40727844228',
  email: 'contact@salonfya.com',

  hours: 'Doar pe bază de programare',
  hoursNote: 'Ne potrivim după programul tău, inclusiv în weekend.',

  maps: 'https://maps.google.com/?q=Mihail+Kog%C4%83lniceanu+nr.+44,+Oradea,+Romania',
  mapsEmbed:
    'https://www.google.com/maps?q=Mihail+Kog%C4%83lniceanu+nr.+44,+Oradea,+Romania&output=embed',

  /**
   * Profilurile sociale, linkuri curate.
   *
   * Facebook e legat prin ID-ul paginii, care rezolvă corect indiferent de cum
   * se schimbă numele sau handle-ul. Instagram: @salonfyaromania.
   */
  facebook: 'https://www.facebook.com/461693320575514',
  instagram: 'https://www.instagram.com/salonfyaromania/',

  /** Județele din care vin miresele, folosite în textele de acoperire locală. */
  reach: ['Bihor', 'Cluj', 'Arad', 'Timiș', 'Sălaj', 'Satu Mare', 'Maramureș'],
} as const;
