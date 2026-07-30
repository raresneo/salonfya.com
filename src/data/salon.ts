/**
 * Datele publice ale salonului.
 *
 * TODO Rareș: înlocuiește telefonul, adresa exactă și linkurile de social cu
 * cele reale. Sunt centralizate aici ca să nu fie împrăștiate prin componente.
 */
export const SALON = {
  name: 'Salon FYA',
  city: 'Oradea',
  county: 'Bihor',
  address: 'Oradea, județul Bihor',
  phone: '+40 359 000 000',
  phoneHref: '+40359000000',
  whatsapp: '40359000000',
  email: 'contact@salonfya.com',
  hours: 'Luni până sâmbătă, 10:00 la 18:00',
  instagram: 'https://www.instagram.com/',
  facebook: 'https://www.facebook.com/',
  /** Județele din care vin miresele, folosite în textele de acoperire locală. */
  reach: ['Bihor', 'Cluj', 'Arad', 'Timiș', 'Sălaj', 'Satu Mare', 'Maramureș'],
} as const;
