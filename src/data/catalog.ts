import { Collection, Dress, DressType } from '../types';

/**
 * Catalogul rochiilor, construit din fotografiile reale din `public/images`.
 *
 * Supabase rămâne sursa principală de adevăr (vezi `useCatalog`). Fișierul
 * acesta e plasa de siguranță: dacă tabela `dresses` e goală sau variabilele
 * de mediu lipsesc, site-ul afișează în continuare produsele.
 *
 * Reguli respectate la alegerea imaginilor:
 *  - fără .heic / .HEIC, browserele nu le randează
 *  - unde există varianta optimizată la nivel de /images, o folosim în loc de
 *    PNG-ul original de 2 MB din folderul colecției
 *  - prima imagine din listă e coperta folosită în grid
 *
 * Atenție la fișierele plate din rădăcina /images: unele sunt copii redenumite
 * ale altei rochii. Verificat prin SHA de blob, nu vizual. Elia primea pozele
 * lui Daiana exact așa. Când adaugi un model nou, compară fișierele înainte de
 * a te încrede în denumire.
 */

/** Construiește o cale publică sigură, cu spațiile encodate (ex. "Ivory Grace"). */
const p = (...parts: string[]): string =>
  '/' + ['images', ...parts].map((s) => encodeURIComponent(s)).join('/');

/** Scurtătură pentru imaginile deja optimizate din rădăcina /images. */
const flat = (file: string): string => p(file);

type Seed = {
  /** Numele rochiei, exact cum e în atelier. */
  name: string;
  images: string[];
  sketches?: string[];
};

const slug = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const build = (collection: Collection, seeds: Seed[]): Dress[] =>
  seeds.map((seed) => ({
    id: `${slug(collection)}-${slug(seed.name)}`,
    name: seed.name,
    description: '',
    type: DressType.BUY,
    currency: 'RON',
    imageUrl: seed.images[0],
    images: seed.images,
    sketches: seed.sketches,
    sizes: [],
    colors: [],
    collection,
  }));

/* ---------------------------------- IMPERIAL --------------------------------- */

const IMPERIAL_SEEDS: Seed[] = [
  {
    name: 'Alma',
    images: [flat('alma_front.jpg'), flat('alma_back.jpg'), flat('alma_detail.jpg')],
    sketches: [flat('alma_sketch_front.png'), flat('alma_sketch_back.png'), flat('alma_sketch_movement.png')],
  },
  {
    name: 'Anamara',
    images: [
      p('IMPERIAL', 'Anamara', 'IMG_6316.jpg'),
      p('IMPERIAL', 'Anamara', '3D870093-9834-45A4-9A7A-821B9FFB6889.PNG'),
      p('IMPERIAL', 'Anamara', '744883C6-51FE-44AB-ADDD-D4F57FAFFF68.PNG'),
    ],
  },
  {
    name: 'Argente',
    images: [
      flat('argente_front.jpg'),
      flat('argente_front_2.jpg'),
      flat('argente_back.jpg'),
      flat('argente_detail.jpg'),
    ],
    sketches: [p('IMPERIAL', 'Argente', 'argente_sketch.png')],
  },
  {
    name: 'Aurelia',
    images: [
      flat('aurelia_front.jpg'),
      flat('aurelia_back.jpg'),
      flat('aurelia_detail.jpg'),
      flat('aurelia_closeup.jpg'),
    ],
    sketches: [p('IMPERIAL', 'Aurelia', 'aurelia_sketch.png')],
  },
  {
    name: 'Daiana',
    images: [
      flat('daiana_front.jpg'),
      flat('daiana_side.jpg'),
      flat('daiana_back.jpg'),
      flat('daiana_detail_1.jpg'),
      flat('daiana_detail_2.jpg'),
    ],
    sketches: [p('IMPERIAL', 'Daiana', 'daiana_sketch.png')],
  },
  {
    // Fișierele plate elia_*.jpg sunt copii ale lui Daiana (SHA identic),
    // deci folosim exclusiv folderul colecției.
    name: 'Elia',
    images: [
      p('IMPERIAL', 'Elia', 'IMG_5552.jpg'),
      p('IMPERIAL', 'Elia', 'IMG_5553.jpg'),
      p('IMPERIAL', 'Elia', 'IMG_5554.jpg'),
      p('IMPERIAL', 'Elia', 'IMG_5414.jpg'),
      p('IMPERIAL', 'Elia', 'IMG_5415.jpg'),
    ],
    sketches: [p('IMPERIAL', 'Elia', 'elia_sketch.png')],
  },
  {
    name: 'Elise',
    images: [flat('elise_front.jpg'), flat('elise_side.jpg'), flat('elise_back.jpg'), flat('elise_detail.jpg')],
    sketches: [p('IMPERIAL', 'Elise', 'elise_sketch.png')],
  },
  {
    name: 'Evora',
    images: [
      p('IMPERIAL', 'Evora', 'IMG_5580.jpg'),
      p('IMPERIAL', 'Evora', 'IMG_5581.jpg'),
      p('IMPERIAL', 'Evora', 'IMG_5583.jpg'),
      p('IMPERIAL', 'Evora', 'IMG_5587.jpg'),
    ],
    sketches: [p('IMPERIAL', 'Evora', 'evora_sketch.png')],
  },
  {
    name: 'Ivory Grace',
    images: [
      p('IMPERIAL', 'Ivory Grace', 'IMG_5395.jpg'),
      p('IMPERIAL', 'Ivory Grace', 'IMG_5399.jpg'),
      p('IMPERIAL', 'Ivory Grace', 'f202fbc6-6dd7-442b-8121-0cc159e5ff40.JPG'),
    ],
    sketches: [flat('ivory_grace_sketch.png')],
  },
  {
    name: 'Lumiere',
    images: [p('IMPERIAL', 'Lumiere', 'IMG_5439.jpg')],
    sketches: [p('IMPERIAL', 'Lumiere', 'lumiere_sketch.png')],
  },
  {
    name: 'Mayson',
    images: [
      p('IMPERIAL', 'Mayson', 'IMG_5364.jpg'),
      p('IMPERIAL', 'Mayson', 'IMG_5366.jpg'),
      p('IMPERIAL', 'Mayson', 'IMG_5369.jpg'),
      p('IMPERIAL', 'Mayson', 'IMG_5370.jpg'),
    ],
    sketches: [p('IMPERIAL', 'Mayson', 'mayson_sketch.png')],
  },
  {
    name: 'Queen',
    images: [
      p('IMPERIAL', 'Queen', 'IMG_5568.jpg'),
      p('IMPERIAL', 'Queen', 'IMG_5571.jpg'),
      p('IMPERIAL', 'Queen', 'IMG_5463.jpg'),
    ],
    sketches: [p('IMPERIAL', 'Queen', 'queen_sketch.png')],
  },
  {
    name: 'Serena',
    images: [
      p('IMPERIAL', 'Serena', 'IMG_5423.jpg'),
      p('IMPERIAL', 'Serena', 'IMG_5424.jpg'),
      p('IMPERIAL', 'Serena', 'IMG_5573.jpg'),
      p('IMPERIAL', 'Serena', 'IMG_5460.jpg'),
    ],
    sketches: [p('IMPERIAL', 'Serena', 'serena_sketch.png')],
  },
];

/* ------------------------------------ ANNA ----------------------------------- */

const ANNA_SEEDS: Seed[] = [
  {
    name: 'Anais',
    images: [
      p('ANNA', 'Anais', '0A1909F0-C8B1-4B7C-AA3E-2514FAA0D407.jpg'),
      p('ANNA', 'Anais', '79DC5387-A233-4FAF-A400-365F22270EED.PNG'),
      p('ANNA', 'Anais', 'A85332DF-BE08-4DA1-9DF5-CF48706FFDBF.PNG'),
    ],
    sketches: [p('ANNA', 'Anais', 'anna_anais_sketch.png')],
  },
  {
    name: 'Anamaria',
    images: [
      p('ANNA', 'Anamaria', 'IMG_5829.jpg'),
      p('ANNA', 'Anamaria', 'IMG_5841.jpg'),
      p('ANNA', 'Anamaria', 'IMG_5843.jpg'),
      p('ANNA', 'Anamaria', 'IMG_5845.jpg'),
    ],
  },
  {
    name: 'Anaria',
    images: [
      p('ANNA', 'Anaria', '48777E20-17E8-4147-8162-1DFA6FC8ED37.PNG'),
      p('ANNA', 'Anaria', '753C58D1-6014-43EF-B408-E9D5382C43EE.PNG'),
      p('ANNA', 'Anaria', 'E110F78F-1AE3-4F76-9927-C1C38242F2B0.PNG'),
    ],
    sketches: [p('ANNA', 'Anaria', 'anna_anaria_sketch.png')],
  },
  {
    name: 'Anastasia',
    images: [
      p('ANNA', 'Anastasia', '20FF0E7B-AEEA-4216-A8BD-DB3ED5252E97.PNG'),
      p('ANNA', 'Anastasia', '811DDE31-7EB2-44F1-8D33-920F6E536A1E.PNG'),
      p('ANNA', 'Anastasia', '9882240D-72F9-435F-9A1C-213C53DC6380.PNG'),
    ],
  },
  {
    name: 'Anastea',
    images: [
      p('ANNA', 'Anastea', 'IMG_6002.jpg'),
      p('ANNA', 'Anastea', '162B7262-5C38-4385-9346-FDB3B1527BD4.PNG'),
      p('ANNA', 'Anastea', '22696034-4E9C-4BE8-AAE9-528DBC3C1ED7.PNG'),
      p('ANNA', 'Anastea', 'C5E124D3-D23F-46C6-9FFF-B48DBC1B5C58.PNG'),
    ],
  },
  {
    name: 'Anatolia',
    images: [p('ANNA', 'Anatolia', 'IMG_5851.jpg'), p('ANNA', 'Anatolia', 'IMG_5855.jpg')],
  },
  {
    name: 'Anavelle',
    images: [
      p('ANNA', 'Anavelle', 'A74C3A1A-C6FF-4C80-BBF4-6E3736B9F525.PNG'),
      p('ANNA', 'Anavelle', 'F0984693-7165-430E-A06E-8451F8492F3A.PNG'),
      p('ANNA', 'Anavelle', 'FC5646E0-8C55-4E53-B5C4-FE51E2B46449.PNG'),
    ],
  },
  {
    name: 'Anelie',
    images: [
      p('ANNA', 'Anelie', '309257BD-2244-49A4-A5D5-50358890D6D5.PNG'),
      p('ANNA', 'Anelie', '3F333F5B-B61B-4A2E-87D1-8325BBA0CBF7.PNG'),
      p('ANNA', 'Anelie', 'B16FAF52-4CD5-4C75-A5D3-04E5ECE96EEB.PNG'),
    ],
  },
  {
    name: 'Annabelle',
    images: [
      p('ANNA', 'Annabelle', 'IMG_5868.jpg'),
      p('ANNA', 'Annabelle', 'IMG_5872.jpg'),
      p('ANNA', 'Annabelle', 'IMG_5875.jpg'),
      p('ANNA', 'Annabelle', 'IMG_5881.jpg'),
    ],
  },
  {
    name: 'Annador',
    images: [
      p('ANNA', 'Annador', '0DB5AAD1-EEE2-40B7-926B-403B31D9EEE2.PNG'),
      p('ANNA', 'Annador', 'BBACE0F9-1649-4353-93B4-A7D453D0991C.PNG'),
    ],
    sketches: [p('ANNA', 'Annador', 'anna_annador_sketch.png')],
  },
  {
    name: 'Annette',
    images: [
      p('ANNA', 'Annette', 'IMG_5917.jpg'),
      p('ANNA', 'Annette', 'IMG_5918.jpg'),
      p('ANNA', 'Annette', 'IMG_5919.jpg'),
      p('ANNA', 'Annette', '35C61BE9-0D54-4949-881A-50C8B2229576.PNG'),
    ],
  },
  {
    name: 'Just Anna',
    images: [
      p('ANNA', 'Just Anna', 'IMG_5889.jpg'),
      p('ANNA', 'Just Anna', 'IMG_5890.jpg'),
      p('ANNA', 'Just Anna', 'IMG_5908.jpg'),
    ],
  },
];

/* ------------------------------------ MAYRA ---------------------------------- */

const MAYRA_SEEDS: Seed[] = [
  {
    name: 'Adania',
    images: [
      p('MAYRA', 'Adania', 'IMG_5591.jpg'),
      p('MAYRA', 'Adania', 'IMG_5597.jpg'),
      p('MAYRA', 'Adania', 'IMG_5603.jpg'),
      p('MAYRA', 'Adania', 'IMG_5607.jpg'),
    ],
  },
  {
    name: 'Celina',
    images: [
      p('MAYRA', 'Celina', 'IMG_5616.jpg'),
      p('MAYRA', 'Celina', 'IMG_5618.jpg'),
      p('MAYRA', 'Celina', 'IMG_5620.jpg'),
      p('MAYRA', 'Celina', 'IMG_5626.JPEG'),
    ],
  },
  {
    name: 'Desideria',
    images: [
      p('MAYRA', 'Desideria', 'IMG_5631.jpg'),
      p('MAYRA', 'Desideria', 'IMG_5637.jpg'),
      p('MAYRA', 'Desideria', 'IMG_5638.jpg'),
      p('MAYRA', 'Desideria', 'IMG_5640.jpg'),
    ],
  },
  {
    name: 'Elvira',
    images: [
      p('MAYRA', 'Elvira', 'IMG_5648.jpg'),
      p('MAYRA', 'Elvira', 'IMG_5651.jpg'),
      p('MAYRA', 'Elvira', 'IMG_5652.jpg'),
    ],
  },
  {
    name: 'Grazia',
    images: [
      p('MAYRA', 'Grazia', 'IMG_5668.jpg'),
      p('MAYRA', 'Grazia', 'IMG_5669.jpg'),
      p('MAYRA', 'Grazia', 'ED2F8FEC-0716-44BC-B7C6-29E39267E930.jpg'),
    ],
  },
  {
    name: 'Isadora',
    images: [
      p('MAYRA', 'Isadora', 'IMG_5681.jpg'),
      p('MAYRA', 'Isadora', 'IMG_5682.jpg'),
      p('MAYRA', 'Isadora', 'IMG_5691.jpg'),
    ],
  },
  {
    name: 'Luminia',
    images: [
      p('MAYRA', 'Luminia', 'IMG_5697.jpg'),
      p('MAYRA', 'Luminia', 'IMG_5698.jpg'),
      p('MAYRA', 'Luminia', 'IMG_5699.jpg'),
      p('MAYRA', 'Luminia', 'IMG_5709.jpg'),
      p('MAYRA', 'Luminia', 'IMG_5710.jpg'),
    ],
  },
  {
    name: 'Miracle',
    images: [
      p('MAYRA', 'Miracle', 'IMG_5714.jpg'),
      p('MAYRA', 'Miracle', 'IMG_5715.jpg'),
      p('MAYRA', 'Miracle', 'IMG_5717.jpg'),
      p('MAYRA', 'Miracle', 'IMG_5718.jpg'),
      p('MAYRA', 'Miracle', 'IMG_5727.jpg'),
      p('MAYRA', 'Miracle', 'IMG_5729.jpg'),
    ],
  },
  {
    name: 'Roze',
    images: [p('MAYRA', 'Roze', 'IMG_5735.jpg'), p('MAYRA', 'Roze', 'IMG_5736.jpg')],
  },
  {
    name: 'Snow',
    images: [
      p('MAYRA', 'Snow', 'IMG_5743.jpg'),
      p('MAYRA', 'Snow', 'IMG_5744.jpg'),
      p('MAYRA', 'Snow', 'IMG_5748.jpg'),
      p('MAYRA', 'Snow', 'IMG_5753.jpg'),
      p('MAYRA', 'Snow', 'IMG_5757.jpg'),
    ],
  },
  {
    name: 'Tania',
    images: [
      p('MAYRA', 'Tania', 'IMG_5764.jpg'),
      p('MAYRA', 'Tania', 'IMG_5767.jpg'),
      p('MAYRA', 'Tania', 'IMG_5771.jpg'),
      p('MAYRA', 'Tania', 'IMG_5781.jpg'),
    ],
  },
  {
    name: 'Taniana',
    images: [
      p('MAYRA', 'Taniana', 'IMG_5785.jpg'),
      p('MAYRA', 'Taniana', 'IMG_5788.jpg'),
      p('MAYRA', 'Taniana', 'IMG_5796.jpg'),
    ],
  },
];

/* ----------------------------------- BEVERLY --------------------------------- */

/**
 * Notă: folderul BEVERLY/Evora conține exact aceleași fișiere ca IMPERIAL/Evora
 * (SHA identic), deci nu îl mai listăm aici. Evora apare o singură dată, în
 * Imperial.
 */
const BEVERLY_SEEDS: Seed[] = [
  {
    name: 'Aveline',
    images: [
      p('BEVERLY', 'Aveline', '115CCF60-8679-410A-8370-63E6A9F89212.PNG'),
      p('BEVERLY', 'Aveline', 'AAAF1202-841B-4ECB-99D7-288B50AB6844.PNG'),
    ],
  },
  {
    name: 'Beauty',
    images: [
      p('BEVERLY', 'Beauty', '2C8B1C4E-9132-4164-A376-2CA5D84F83B2.PNG'),
      p('BEVERLY', 'Beauty', '38BFFE6C-B36C-4166-A82C-A9FD2EE8C200.PNG'),
      p('BEVERLY', 'Beauty', '1ED51795-BB30-42F8-9E60-27A53172F5C5.jpg'),
    ],
  },
  {
    name: 'Bety',
    images: [
      p('BEVERLY', 'Bety', '40C0C4BB-6FFA-4766-9C74-936E4B33A0B7.PNG'),
      p('BEVERLY', 'Bety', '7C7BAEA6-5AA1-47F0-AB66-0932F85F1BFC.PNG'),
      p('BEVERLY', 'Bety', 'D890182A-3BF8-4437-BE26-D4BE930405DF.PNG'),
    ],
  },
  {
    name: 'Candy',
    images: [
      p('BEVERLY', 'Candy', '25F6D5C5-6164-469C-8EE4-7DCEF85EEF14.PNG'),
      p('BEVERLY', 'Candy', '658A28B1-4FB0-476A-8E4C-681794EDDC36.PNG'),
      p('BEVERLY', 'Candy', 'C646F8AC-F3B2-4131-B600-918E762A84B9.PNG'),
    ],
  },
  {
    name: 'Cediz',
    images: [
      p('BEVERLY', 'Cediz', '7BDA1B11-69AA-4CF2-8B80-2DF0FB5B0305.PNG'),
      p('BEVERLY', 'Cediz', 'AC2C54DB-1A39-402F-BAAB-C1A39DDE0C8C.PNG'),
      p('BEVERLY', 'Cediz', 'CDC70D0B-80B0-436E-A138-4A64FE5051B2.PNG'),
    ],
  },
  {
    name: 'Celestia',
    images: [
      p('BEVERLY', 'Celestia', '2107F38F-0DD1-4497-BF3E-6AFFCB417580.PNG'),
      p('BEVERLY', 'Celestia', 'B5632105-393D-4F7E-B4D3-DB5FD9F935FF.PNG'),
    ],
  },
  {
    name: 'Fyona',
    images: [
      p('BEVERLY', 'Fyona', '59B72D64-68F1-4BFD-8C16-8A65FFCD7366.PNG'),
      p('BEVERLY', 'Fyona', 'E325D880-0FDD-42A5-A4E6-3731EFEBBF8A.PNG'),
      p('BEVERLY', 'Fyona', '44F1F915-D193-41D9-A6E3-1CAA83D39058.jpg'),
    ],
  },
  {
    name: 'Marisa',
    images: [
      p('BEVERLY', 'Marisa', '230565A2-30C0-42B2-9489-FE788A454878.PNG'),
      p('BEVERLY', 'Marisa', '38B36E35-0C78-4040-BD34-0179CA259ED4.PNG'),
      p('BEVERLY', 'Marisa', '3C36FB67-DB80-4606-B3FF-D1C53E7638C2.PNG'),
      p('BEVERLY', 'Marisa', 'B6C95714-06F6-44F8-8FD9-8D534D00AB86.PNG'),
    ],
  },
  {
    name: 'Nolli',
    images: [
      p('BEVERLY', 'Nolli', '1AF62A14-D463-4296-996D-4407D0D05C0C.PNG'),
      p('BEVERLY', 'Nolli', '791B9E80-C741-4596-9D8B-98B623FF0BF9.PNG'),
      p('BEVERLY', 'Nolli', '788465EE-72EB-4D98-AF47-976F66A94BE3.jpg'),
      p('BEVERLY', 'Nolli', '8B0FFD39-1E26-4F31-B784-AE7BA3AF65B4.jpg'),
    ],
  },
  {
    name: 'Solea',
    images: [
      p('BEVERLY', 'Solea', '1F094A24-E99A-40BC-82F4-0FA8E7DC3167.PNG'),
      p('BEVERLY', 'Solea', '9018FCB1-33DE-486D-9511-C42292ED2A65.PNG'),
      p('BEVERLY', 'Solea', 'B9A677F9-769E-452A-91B7-93DC86E26CC2.PNG'),
    ],
  },
  {
    name: 'Valensia',
    images: [
      p('BEVERLY', 'Valensia', '8FC77535-6FF4-4D57-AB1F-9CAE439BEA3B.PNG'),
      p('BEVERLY', 'Valensia', 'E91DF7E3-18B8-482B-8F6A-E1ABDCF9F46F.PNG'),
    ],
  },
];

/** Toate rochiile, în ordinea colecțiilor. */
export const LOCAL_CATALOG: Dress[] = [
  ...build(Collection.IMPERIAL, IMPERIAL_SEEDS),
  ...build(Collection.ANNA, ANNA_SEEDS),
  ...build(Collection.MAYRA, MAYRA_SEEDS),
  ...build(Collection.BEVERLY, BEVERLY_SEEDS),
];

/** Metadate de colecție, folosite pe homepage și pe paginile de colecție. */
export type CollectionMeta = {
  collection: Collection;
  slug: string;
  path: string;
  note: string;
  intro: string;
  cover: string;
  video?: string;
};

export const COLLECTIONS: CollectionMeta[] = [
  {
    collection: Collection.IMPERIAL,
    slug: 'imperial',
    path: '/imperial',
    note: 'Volum, trene lungi, prezență în cadru',
    intro:
      'Colecția cu cea mai multă substanță. Trene lungi, corsete construite și volume care se văd din capătul bisericii.',
    cover: flat('aurelia_front.jpg'),
    video: p('IMPERIAL', 'Generare_Video_Rochii_Fashion.mp4'),
  },
  {
    collection: Collection.ANNA,
    slug: 'anna',
    path: '/anna',
    note: 'Dantelă aplicată manual, detaliu fin',
    intro:
      'Aici lucrăm dantela aplicată manual, bucată cu bucată. Modele pentru mirese care se uită de aproape la cusături.',
    cover: p('ANNA', 'Annabelle', 'IMG_5868.jpg'),
    video: p('ANNA', 'Video_Generat_La_Cerere.mp4'),
  },
  {
    collection: Collection.MAYRA,
    slug: 'mayra',
    path: '/mayra',
    note: 'Linii curate, satin greu, minimalism',
    intro:
      'Croieli curate, fără ornament în plus. Satin greu care cade singur și siluete care nu au nevoie de explicații.',
    cover: p('MAYRA', 'Snow', 'IMG_5743.jpg'),
    video: p('MAYRA', 'colectia mayra.mp4'),
  },
  {
    collection: Collection.BEVERLY,
    slug: 'beverly',
    path: '/beverly',
    note: 'Siluete lejere, spate deschis',
    intro:
      'Cea mai lejeră dintre colecții. Spate deschis, materiale ușoare, potrivite și pentru nunți de vară sau petreceri în aer liber.',
    cover: p('BEVERLY', 'Marisa', '230565A2-30C0-42B2-9489-FE788A454878.PNG'),
    video: p('BEVERLY', 'berverly_cover.mp4'),
  },
];

export const collectionBySlug = (value?: string): CollectionMeta | undefined =>
  COLLECTIONS.find((item) => item.slug === (value || '').toLowerCase());
