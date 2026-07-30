/**
 * Datele publice ale salonului, într-un singur loc.
 *
 * Sursa: fișa WhatsApp Business a salonului. Dacă se schimbă numărul sau
 * adresa, se schimbă doar aici.
 *
 * `instagram` și `facebook` sunt goale intenționat până primim linkurile
 * reale. Componentele verifică valoarea înainte de a afișa linkul, deci nu
 * trimitem nimeni pe o pagină inexistentă.
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

  instagram: '',
  facebook: '',

  /** Județele din care vin miresele, folosite în textele de acoperire locală. */
  reach: ['Bihor', 'Cluj', 'Arad', 'Timiș', 'Sălaj', 'Satu Mare', 'Maramureș'],
} as const;
