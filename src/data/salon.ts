/**
 * Datele publice ale salonului, într-un singur loc.
 *
 * Sursa: fișa WhatsApp Business și paginile sociale conectate ale salonului.
 * Dacă se schimbă numărul, adresa sau un profil, se schimbă doar aici.
 */
export const SALON = {
  name: 'Salon FYA',
  legalName: 'Salon Fya',
  tagline: 'Fancy, Young & Admired',

  city: 'Oradea',
  county: 'Bihor',
  street: 'Strada Vasile Alecsandri 21',
  postalCode: '410072',
  address: 'Strada Vasile Alecsandri 21, Oradea',
  addressFull: 'Strada Vasile Alecsandri 21, 410072 Oradea, Bihor',

  phone: '+40 727 844 228',
  phoneHref: '+40727844228',
  whatsapp: '40727844228',
  email: 'contact@salonfya.com',

  hours: 'Doar pe bază de programare',
  hoursNote: 'Ne potrivim după programul tău, inclusiv în weekend.',

  maps: 'https://maps.google.com/?q=Strada+Vasile+Alecsandri+21,+410072+Oradea,+Romania',
  mapsEmbed:
    'https://www.google.com/maps?q=Strada+Vasile+Alecsandri+21,+410072+Oradea,+Romania&output=embed',

  /**
   * Profilurile sociale. Facebook e legat prin ID-ul paginii, care rezolvă
   * corect indiferent de cum se schimbă numele sau handle-ul paginii.
   */
  facebook: 'https://www.facebook.com/461693320575514',
  instagram: 'https://www.instagram.com/salonfya/',

  /** Județele din care vin miresele, folosite în textele de acoperire locală. */
  reach: ['Bihor', 'Cluj', 'Arad', 'Timiș', 'Sălaj', 'Satu Mare', 'Maramureș'],
} as const;
