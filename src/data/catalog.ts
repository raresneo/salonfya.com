import { Collection, Dress, DressType } from '../types';

/**
 * Catalogul rochiilor, construit din fotografiile reale din `public/images`.
 *
 * Supabase rămâne sursa principală de adevăr (vezi `useCatalog`). Fișierul
 * acesta e plasa de siguranță: dacă tabela `dresses` e goală sau variabilele
 * de mediu lipsesc, site-ul afișează în continuare produsele.
 *
 * Reguli de catalogare:
 *  - orice model care începe cu "Ana" aparține colecției Anna, indiferent în ce
 *    folder stau fotografiile în repo
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
    description: seed.description || '',
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

const IMPERIAL_SEEDS: DressSeed[] = [
  {
    name: 'Alma',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Imperial collection, model Alma. A-line gown with spaghetti straps, fully embellished shimmering lace bodice, and a flowing minimalist skirt with an train.',
    images: [p('clean', 'alma_front_nohead.jpg'), flat('alma_back.jpg'), flat('alma_detail.jpg')],
    sketches: [flat('alma_sketch_front.png'), flat('alma_sketch_back.png'), flat('alma_sketch_movement.png')],
  },
  {
    name: 'Argente',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Imperial collection, model Argente. Strapless fitted mermaid silhouette with intricate beadwork and floral lace on a sheer bodice, ending in a dramatic flared tulle skirt.',
    images: [
      p('clean', 'argente_front_nohead.jpg'),
      flat('argente_front_2.jpg'),
      flat('argente_back.jpg'),
      flat('argente_detail.jpg'),
    ],
    sketches: [p('IMPERIAL', 'Argente', 'argente_sketch.png')],
  },
  {
    name: 'Aurelia',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Imperial collection, model Aurelia. Sweetheart neckline ballgown featuring a structured boned corset bodice adorned with floral lace appliques that trail down a voluminous tulle skirt.',
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
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Imperial collection, model Daiana. Plunging V-neckline A-line gown with shimmering patterned lace, spaghetti straps, an illusion open back, and a flowing sheer skirt with a subtle train.',
    images: [
      p('clean', 'daiana_front_nohead.jpg'),
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
    description: 'Sleek mermaid silhouette gown featuring a structured lace bodice with pearl detailing, available with an illusion plunging V-neck or strapless sweetheart neckline.',
    images: [
      p('clean', 'IMG_5552_nohead.jpg'),
      p('IMPERIAL', 'Elia', 'IMG_5553.jpg'),
      p('IMPERIAL', 'Elia', 'IMG_5554.jpg'),
      p('IMPERIAL', 'Elia', 'IMG_5414.jpg'),
      p('IMPERIAL', 'Elia', 'IMG_5415.jpg'),
    ],
    sketches: [p('IMPERIAL', 'Elia', 'elia_sketch.png')],
  },
  {
    name: 'Elise',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Imperial collection, model Elise. Off-the-shoulder ballgown with intricate silver beading, lace embroidery across the bodice, and a voluminous cascading tulle skirt with a long train.',
    images: [p('clean', 'elise_front_nohead.jpg'), flat('elise_side.jpg'), flat('elise_back.jpg'), flat('elise_detail.jpg')],
    sketches: [p('IMPERIAL', 'Elise', 'elise_sketch.png')],
  },
  {
    name: 'Evora',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Imperial collection, model Evora. A-line gown with illusion long bishop sleeves, a deep V-neckline, fully beaded floral applique bodice, and a pure white flowing tulle skirt.',
    images: [
      p('clean', 'IMG_5580_nohead.jpg'),
      p('IMPERIAL', 'Evora', 'IMG_5581.jpg'),
      p('IMPERIAL', 'Evora', 'IMG_5583.jpg'),
      p('IMPERIAL', 'Evora', 'IMG_5587.jpg'),
    ],
    sketches: [p('IMPERIAL', 'Evora', 'evora_sketch.png')],
  },
  {
    name: 'Ivory Grace',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Imperial collection, model Ivory Grace. And long-sleeve ballgown with a high bateau neckline, minimalist skirt, pearl waist belt, and subtle embroidery on the bodice.',
    images: [
      p('clean', 'IMG_5395_nohead.jpg'),
      p('IMPERIAL', 'Ivory Grace', 'IMG_5399.jpg'),
      p('IMPERIAL', 'Ivory Grace', 'f202fbc6-6dd7-442b-8121-0cc159e5ff40.JPG'),
    ],
    sketches: [flat('ivory_grace_sketch.png')],
  },
  {
    name: 'Lumiere',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Imperial collection, model Lumiere. A-line gown featuring illusion lace long sleeves, a sweetheart neckline beneath sheer lace, and a soft, flowing tulle skirt.',
    images: [p('clean', 'IMG_5439_nohead.jpg')],
    sketches: [p('IMPERIAL', 'Lumiere', 'lumiere_sketch.png')],
  },
  {
    name: 'Mayson',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Imperial collection, model Mayson. Long-sleeve V-neck ballgown crafted from textured shimmering fabric, featuring a pleated voluminous skirt and a wide structured waistband.',
    images: [
      p('clean', 'IMG_5364_nohead.jpg'),
      p('IMPERIAL', 'Mayson', 'IMG_5366.jpg'),
      p('IMPERIAL', 'Mayson', 'IMG_5369.jpg'),
      p('IMPERIAL', 'Mayson', 'IMG_5370.jpg'),
    ],
    sketches: [p('IMPERIAL', 'Mayson', 'mayson_sketch.png')],
  },
  {
    name: 'Queen',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Imperial collection, model Queen. Minimalist and sleeveless scoop-neck ballgown made from , unembellished fabric with a smooth, drape.',
    images: [
      p('clean', 'IMG_5568_nohead.jpg'),
      p('IMPERIAL', 'Queen', 'IMG_5571.jpg'),
      p('IMPERIAL', 'Queen', 'IMG_5463.jpg'),
    ],
    sketches: [p('IMPERIAL', 'Queen', 'queen_sketch.png')],
  },
  {
    name: 'Serena',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Imperial collection, model Serena. Form-fitting mermaid gown with long sleeves, a deep V-neckline, and sheer lace illusion details on the shoulders and back.',
    images: [
      p('clean', 'IMG_5423_nohead.jpg'),
      p('IMPERIAL', 'Serena', 'IMG_5424.jpg'),
      p('IMPERIAL', 'Serena', 'IMG_5573.jpg'),
      p('IMPERIAL', 'Serena', 'IMG_5460.jpg'),
    ],
    sketches: [p('IMPERIAL', 'Serena', 'serena_sketch.png')],
  },
];

/* ------------------------------------ ANNA ----------------------------------- */

/**
 * Toate modelele care încep cu "Ana" stau aici, inclusiv Anamara, care avea
 * fotografiile în folderul IMPERIAL. Folderul din repo nu decide colecția.
 */
const ANNA_SEEDS: DressSeed[] = [
  {
    name: 'Anais',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Anna collection, model Anais. Plunging deep V-neckline, long sheer puffy bishop sleeves with dotted pattern, beaded lace bodice, soft flowing sparkly tulle skirt.',
    images: [
      p('clean', '0A1909F0-C8B1-4B7C-AA3E-2514FAA0D407_nohead.jpg'),
      p('ANNA', 'Anais', '79DC5387-A233-4FAF-A400-365F22270EED.PNG'),
      p('ANNA', 'Anais', 'A85332DF-BE08-4DA1-9DF5-CF48706FFDBF.PNG'),
    ],
    sketches: [p('ANNA', 'Anais', 'anna_anais_sketch.png')],
  },
  {
    name: 'Anamara',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Anna collection, model Anamara. Mermaid silhouette, high illusion neckline over sweetheart bodice, sheer long sleeves, intricate lace appliques covering bodice and skirt, illusion back with button closure down the middle.',
    images: [
      p('IMPERIAL', 'Anamara', 'IMG_6316.jpg'),
      p('IMPERIAL', 'Anamara', '3D870093-9834-45A4-9A7A-821B9FFB6889.PNG'),
      p('IMPERIAL', 'Anamara', '744883C6-51FE-44AB-ADDD-D4F57FAFFF68.PNG'),
    ],
  },
  {
    name: 'Anamaria',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Anna collection, model Anamaria. High illusion neckline over sweetheart bodice, sheer long sleeves, intricate linear beading on bodice and sleeves, full sparkly tulle skirt, illusion back with button closure.',
    images: [
      p('ANNA', 'Anamaria', 'IMG_5829.jpg'),
      p('ANNA', 'Anamaria', 'IMG_5841.jpg'),
      p('ANNA', 'Anamaria', 'IMG_5843.jpg'),
      p('ANNA', 'Anamaria', 'IMG_5845.jpg'),
    ],
  },
  {
    name: 'Anaria',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Anna collection, model Anaria. Plunging V-neckline, sheer long bishop sleeves with beaded lace cuffs, heavily beaded patterned bodice, full shimmering sparkly tulle skirt.',
    images: [
      p('clean', '48777E20-17E8-4147-8162-1DFA6FC8ED37_nohead.PNG'),
      p('ANNA', 'Anaria', '753C58D1-6014-43EF-B408-E9D5382C43EE.PNG'),
      p('ANNA', 'Anaria', 'E110F78F-1AE3-4F76-9927-C1C38242F2B0.PNG'),
    ],
    sketches: [p('ANNA', 'Anaria', 'anna_anaria_sketch.png')],
  },
  {
    name: 'Anastasia',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Anna collection, model Anastasia. Cap sleeves with lace, sweetheart bodice with lace appliques, sheer illusion back with button closure down the middle, full soft plain tulle skirt.',
    images: [
      p('ANNA', 'Anastasia', '20FF0E7B-AEEA-4216-A8BD-DB3ED5252E97.PNG'),
      p('ANNA', 'Anastasia', '811DDE31-7EB2-44F1-8D33-920F6E536A1E.PNG'),
      p('ANNA', 'Anastasia', '9882240D-72F9-435F-9A1C-213C53DC6380.PNG'),
    ],
  },
  {
    name: 'Anastea',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Anna collection, model Anastea. Smooth satin fabric, off-the-shoulder straps, draped sweetheart bodice, short puffed sleeves, full pleated satin skirt, corset lacing on back.',
    images: [
      p('ANNA', 'Anastea', 'IMG_6002.jpg'),
      p('ANNA', 'Anastea', '162B7262-5C38-4385-9346-FDB3B1527BD4.PNG'),
      p('ANNA', 'Anastea', '22696034-4E9C-4BE8-AAE9-528DBC3C1ED7.PNG'),
      p('ANNA', 'Anastea', 'C5E124D3-D23F-46C6-9FFF-B48DBC1B5C58.PNG'),
    ],
  },
  {
    name: 'Anatolia',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Anna collection, model Anatolia. Illusion long sleeves, plunging V-neckline with scalloped lace edge, lace appliques cascading down the bodice and skirt, full tulle skirt.',
    images: [p('clean', 'IMG_5851_nohead.jpg'), p('ANNA', 'Anatolia', 'IMG_5855.jpg')],
  },
  {
    name: 'Anavelle',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Anna collection, model Anavelle. Long sheer sleeves, fully beaded bodice and sleeves, deep V-back with button closure down the middle, full sparkly tulle skirt with train.',
    images: [
      p('ANNA', 'Anavelle', 'A74C3A1A-C6FF-4C80-BBF4-6E3736B9F525.PNG'),
      p('ANNA', 'Anavelle', 'F0984693-7165-430E-A06E-8451F8492F3A.PNG'),
      p('ANNA', 'Anavelle', 'FC5646E0-8C55-4E53-B5C4-FE51E2B46449.PNG'),
    ],
  },
  {
    name: 'Anelie',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Anna collection, model Anelie. Off-the-shoulder draped tulle straps, sweetheart neckline, heavily beaded bodice with pearls and crystals, full sparkly tulle skirt.',
    images: [
      p('clean', '309257BD-2244-49A4-A5D5-50358890D6D5_nohead.PNG'),
      p('ANNA', 'Anelie', '3F333F5B-B61B-4A2E-87D1-8325BBA0CBF7.PNG'),
      p('ANNA', 'Anelie', 'B16FAF52-4CD5-4C75-A5D3-04E5ECE96EEB.PNG'),
    ],
  },
  {
    name: 'Annabelle',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Anna collection, model Annabelle. High illusion neckline over sweetheart bodice, long sheer lace sleeves with puffed shoulders, deep V front illusion, full tulle skirt with lace appliques cascading down, deep V-back.',
    images: [
      p('ANNA', 'Annabelle', 'IMG_5868.jpg'),
      p('ANNA', 'Annabelle', 'IMG_5872.jpg'),
      p('ANNA', 'Annabelle', 'IMG_5875.jpg'),
      p('ANNA', 'Annabelle', 'IMG_5881.jpg'),
    ],
  },
  {
    name: 'Annador',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Anna collection, model Annador. Off-the-shoulder draped soft tulle straps, sweetheart neckline, lace appliques on bodice, full soft tulle skirt.',
    images: [
      p('clean', '0DB5AAD1-EEE2-40B7-926B-403B31D9EEE2_nohead.PNG'),
      p('ANNA', 'Annador', 'BBACE0F9-1649-4353-93B4-A7D453D0991C.PNG'),
    ],
    sketches: [p('ANNA', 'Annador', 'anna_annador_sketch.png')],
  },
  {
    name: 'Annette',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Anna collection, model Annette. Off-the-shoulder sheer tulle straps, plunging sweetheart neckline, intricately beaded and crystal-embellished bodice, soft plain tulle skirt.',
    images: [
      p('clean', 'IMG_5917_nohead.jpg'),
      p('ANNA', 'Annette', 'IMG_5918.jpg'),
      p('ANNA', 'Annette', 'IMG_5919.jpg'),
      p('ANNA', 'Annette', '35C61BE9-0D54-4949-881A-50C8B2229576.PNG'),
    ],
  },
  {
    name: 'Just Anna',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Anna collection, model Just Anna. Off-the-shoulder puffed sheer sleeves, draped sweetheart neckline, intricately beaded bodice with crystals, full sparkly tulle skirt.',
    images: [
      p('clean', 'IMG_5889_nohead.jpg'),
      p('ANNA', 'Just Anna', 'IMG_5890.jpg'),
      p('ANNA', 'Just Anna', 'IMG_5908.jpg'),
    ],
  },
];

/* ------------------------------------ MAYRA ---------------------------------- */

const MAYRA_SEEDS: DressSeed[] = [
  {
    name: 'Adania',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Mayra collection, model Adania. Ornate fit-and-flare gown densely covered in pearls, beads, and sequins in a symmetrical butterfly-like pattern. The bodice has a sweetheart neckline with thin beaded straps. The gown has a deep V-neckline at the back and flows into a subtle train, with the pearled detailing continuing densely over the skirt.',
    images: [
      p('clean', 'IMG_5591_nohead.jpg'),
      p('MAYRA', 'Adania', 'IMG_5597.jpg'),
      p('MAYRA', 'Adania', 'IMG_5603.jpg'),
      p('MAYRA', 'Adania', 'IMG_5607.jpg'),
    ],
  },
  {
    name: 'Celina',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Mayra collection, model Celina. Minimalist and fit-and-flare gown crafted from smooth crepe. The bodice features a clean, high boat neckline and solid white front. The long sleeves are made of sheer illusion mesh embellished with lace appliqué and beadwork. The back features a deep V-cut down to the waistline.',
    images: [
      p('clean', 'IMG_5616_nohead.jpg'),
      p('MAYRA', 'Celina', 'IMG_5618.jpg'),
      p('MAYRA', 'Celina', 'IMG_5620.jpg'),
      p('MAYRA', 'Celina', 'IMG_5626.JPEG'),
    ],
  },
  {
    name: 'Desideria',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Mayra collection, model Desideria. A-line gown covered entirely in intricate glittering botanical lace. The bodice features a plunging illusion V-neckline and sheer long sleeves adorned with the same matching lace pattern. The back showcases a deep V-cut matching the front, and the skirt flows gently to a small train.',
    images: [
      p('clean', 'IMG_5631_nohead.jpg'),
      p('MAYRA', 'Desideria', 'IMG_5637.jpg'),
      p('MAYRA', 'Desideria', 'IMG_5638.jpg'),
      p('MAYRA', 'Desideria', 'IMG_5640.jpg'),
    ],
  },
  {
    name: 'Elvira',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Mayra collection, model Elvira. A-line gown featuring an illusion bodice adorned with floral lace appliqué and off-the-shoulder draped lace sleeves. The sweetheart neckline is softened by the illusion mesh. The lightweight tulle skirt flows beautifully into a long train. The back features a scoop cut framed by matching floral lace.',
    images: [
      p('clean', 'IMG_5648_nohead.jpg'),
      p('MAYRA', 'Elvira', 'IMG_5651.jpg'),
      p('MAYRA', 'Elvira', 'IMG_5652.jpg'),
    ],
  },
  {
    name: 'Grazia',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Mayra collection, model Grazia. Flowing A-line gown with a smooth, draped skirt featuring a high side slit. The corset-style bodice showcases exposed boning and a sweetheart neckline, decorated with sparkling beaded lace appliqué that extends delicately down onto the skirt. The back features a low scoop neckline and thin straps.',
    images: [
      p('clean', 'IMG_5668_nohead.jpg'),
      p('MAYRA', 'Grazia', 'IMG_5669.jpg'),
      p('MAYRA', 'Grazia', 'ED2F8FEC-0716-44BC-B7C6-29E39267E930.jpg'),
    ],
  },
  {
    name: 'Isadora',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Mayra collection, model Isadora. Fit-and-flare gown heavily embellished with beaded botanical lace over a sheer bodice. The gown features a plunging V-neckline and is paired with matching detachable long sheer sleeves. The back showcases a deep open V-cut framed by intricate lace, flowing into a dramatic train.',
    images: [
      p('clean', 'IMG_5681_nohead.jpg'),
      p('MAYRA', 'Isadora', 'IMG_5682.jpg'),
      p('MAYRA', 'Isadora', 'IMG_5691.jpg'),
    ],
  },
  {
    name: 'Luminia',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Mayra collection, model Luminia. A-line gown with a flowing, soft tulle skirt. The bodice features a deep plunging V-neckline with illusion mesh paneling and thick straps, adorned with swirling symmetrical lace appliqué. The gown can be paired with an optional sheer high-neck cape that drapes elegantly over the shoulders. The back of the gown itself features a deep V-shape.',
    images: [
      p('clean', 'IMG_5697_nohead.jpg'),
      p('MAYRA', 'Luminia', 'IMG_5698.jpg'),
      p('MAYRA', 'Luminia', 'IMG_5699.jpg'),
      p('MAYRA', 'Luminia', 'IMG_5709.jpg'),
      p('MAYRA', 'Luminia', 'IMG_5710.jpg'),
    ],
  },
  {
    name: 'Miracle',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Mayra collection, model Miracle. A-line gown with a structured satin skirt and a long train. The bodice features a sheer illusion neckline and long sheer sleeves, fully embellished with intricate beaded lace appliques that trail down onto the waist. The back is a deep illusion V-shape framed by matching lace details.',
    images: [
      p('clean', 'IMG_5714_nohead.jpg'),
      p('MAYRA', 'Miracle', 'IMG_5715.jpg'),
      p('MAYRA', 'Miracle', 'IMG_5717.jpg'),
      p('MAYRA', 'Miracle', 'IMG_5718.jpg'),
      p('MAYRA', 'Miracle', 'IMG_5727.jpg'),
      p('MAYRA', 'Miracle', 'IMG_5729.jpg'),
    ],
  },
  {
    name: 'Roze',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Mayra collection, model Roze. Voluminous blush pink ballgown made entirely of heavily textured, ruffled tulle rosettes. The bodice features a deep plunging V-neckline with ruffled tulle shoulder details and a matching deep V open back, finished with a ribbon sash at the waist.',
    images: [p('clean', 'IMG_5735_nohead.jpg'), p('MAYRA', 'Roze', 'IMG_5736.jpg')],
  },
  {
    name: 'Snow',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Mayra collection, model Snow. Minimalist A-line gown crafted from smooth satin. The structured bodice features a square neckline and wide straps, leading to a deep V-back. A large structured bow accents the back waistline with trailing tails over the flowing skirt and train.',
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
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Mayra collection, model Tania. Flowing A-line gown with long bishop sleeves. The bodice features pleating and a scoop neckline, accented with pink and green floral embroidery along the neckline, waistline, and cuffs. The back is closed with matching floral embroidery details.',
    images: [
      p('clean', 'IMG_5764_nohead.jpg'),
      p('MAYRA', 'Tania', 'IMG_5767.jpg'),
      p('MAYRA', 'Tania', 'IMG_5771.jpg'),
      p('MAYRA', 'Tania', 'IMG_5781.jpg'),
    ],
  },
  {
    name: 'Taniana',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Mayra collection, model Taniana. Flowing A-line gown featuring unique cape sleeves that drape to the floor. The bodice features pleating and a scoop neckline, accented with intricate 3D floral appliques along the neckline and shoulders. The back features a deep V-shape adorned with matching floral appliques.',
    images: [
      p('clean', 'IMG_5785_nohead.jpg'),
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
const BEVERLY_SEEDS: DressSeed[] = [
  {
    name: 'Aveline',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Beverly collection, model Aveline. A-line gown with a flowing tulle skirt. The corset bodice is slightly sheer with visible boning, featuring a subtle sweetheart neckline and beaded off-the-shoulder drape sleeves. 3D floral appliques and beadwork decorate the bodice and trail onto the top of the skirt. The back is an open corset style with matching floral details.',
    images: [
      p('clean', '115CCF60-8679-410A-8370-63E6A9F89212_nohead.PNG'),
      p('BEVERLY', 'Aveline', 'AAAF1202-841B-4ECB-99D7-288B50AB6844.PNG'),
    ],
  },
  {
    name: 'Beauty',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Beverly collection, model Beauty. Fitted trumpet gown completely covered in intricate geometric and floral beadwork. The bodice features a sweetheart neckline with thin spaghetti straps that lead to a dramatic open criss-cross back. A voluminous detachable tulle overskirt with matching beadwork at the waist adds a layer of grandeur.',
    images: [
      p('clean', '2C8B1C4E-9132-4164-A376-2CA5D84F83B2_nohead.PNG'),
      p('BEVERLY', 'Beauty', '38BFFE6C-B36C-4166-A82C-A9FD2EE8C200.PNG'),
      p('BEVERLY', 'Beauty', '1ED51795-BB30-42F8-9E60-27A53172F5C5.jpg'),
    ],
  },
  {
    name: 'Bety',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Beverly collection, model Bety. Flowing A-line gown with a thigh-high slit. The corset bodice features a sweetheart neckline with thin spaghetti straps and off-the-shoulder tulle drape sleeves. The bodice and top of the skirt are adorned with intricate trailing beadwork and tiny 3D floral appliques. The back features a deep open V-shape.',
    images: [
      p('clean', '40C0C4BB-6FFA-4766-9C74-936E4B33A0B7_nohead.PNG'),
      p('BEVERLY', 'Bety', '7C7BAEA6-5AA1-47F0-AB66-0932F85F1BFC.PNG'),
      p('BEVERLY', 'Bety', 'D890182A-3BF8-4437-BE26-D4BE930405DF.PNG'),
    ],
  },
  {
    name: 'Candy',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Beverly collection, model Candy. A-line gown with a softly pleated tulle skirt. The bodice has a deep plunging V-neckline with a sheer insert and long fitted sleeves. The entire bodice and sleeves are adorned with bold floral lace appliques that trail slightly past the waist. The back features a sheer illusion panel with matching lace appliques and a row of buttons down the center.',
    images: [
      p('clean', '25F6D5C5-6164-469C-8EE4-7DCEF85EEF14_nohead.PNG'),
      p('BEVERLY', 'Candy', '658A28B1-4FB0-476A-8E4C-681794EDDC36.PNG'),
      p('BEVERLY', 'Candy', 'C646F8AC-F3B2-4131-B600-918E762A84B9.PNG'),
    ],
  },
  {
    name: 'Cediz',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Beverly collection, model Cediz. A-line gown with a flowing tulle skirt. The corset bodice is ruched and draped, featuring a sweetheart neckline and beaded shoulder straps that form a sheer drape effect over the shoulders. Intricate vine-like beading and floral appliques accent the waist, bustline, and back. The back features a deep open V-shape with a row of buttons down the center.',
    images: [
      p('clean', '7BDA1B11-69AA-4CF2-8B80-2DF0FB5B0305_nohead.PNG'),
      p('BEVERLY', 'Cediz', 'AC2C54DB-1A39-402F-BAAB-C1A39DDE0C8C.PNG'),
      p('BEVERLY', 'Cediz', 'CDC70D0B-80B0-436E-A138-4A64FE5051B2.PNG'),
    ],
  },
  {
    name: 'Celestia',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Beverly collection, model Celestia. Fitted column gown completely covered in wavy, intricate beadwork. The straight off-the-shoulder neckline features dramatic beaded fringe that drapes over the upper arms. The back matches the front with an open upper back and a line of buttons trailing down to a sweep train.',
    images: [
      p('clean', '2107F38F-0DD1-4497-BF3E-6AFFCB417580_nohead.PNG'),
      p('BEVERLY', 'Celestia', 'B5632105-393D-4F7E-B4D3-DB5FD9F935FF.PNG'),
    ],
  },
  {
    name: 'Fyona',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Beverly collection, model Fyona. Flowing A-line gown with a voluminous layered tulle skirt. The corset bodice is sheer with visible boning, featuring a sweetheart neckline and off-the-shoulder draped tulle sleeves. The bodice is densely covered in intricate 3D floral appliques and lace that cascade down into the skirt. The back is an open corset style with matching floral details.',
    images: [
      p('clean', '59B72D64-68F1-4BFD-8C16-8A65FFCD7366_nohead.PNG'),
      p('BEVERLY', 'Fyona', 'E325D880-0FDD-42A5-A4E6-3731EFEBBF8A.PNG'),
      p('BEVERLY', 'Fyona', '44F1F915-D193-41D9-A6E3-1CAA83D39058.jpg'),
    ],
  },
  {
    name: 'Marisa',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Beverly collection, model Marisa. Fitted trumpet gown with a unique geometric grid and large scroll lace pattern. The sweetheart neckline features a deep plunging slit and thin straps, along with off-the-shoulder lace sleeves. The bodice is structured with visible boning. The back is an open corset style.',
    images: [
      p('clean', '230565A2-30C0-42B2-9489-FE788A454878_nohead.PNG'),
      p('BEVERLY', 'Marisa', '38B36E35-0C78-4040-BD34-0179CA259ED4.PNG'),
      p('BEVERLY', 'Marisa', '3C36FB67-DB80-4606-B3FF-D1C53E7638C2.PNG'),
      p('BEVERLY', 'Marisa', 'B6C95714-06F6-44F8-8FD9-8D534D00AB86.PNG'),
    ],
  },
  {
    name: 'Nolli',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Beverly collection, model Nolli. A-line gown with a softly pleated tulle skirt. The bodice features a sweetheart neckline with a sheer illusion panel creating a high scoop neckline and long sheer sleeves with subtle wrist appliques. floral lace appliques decorate the bodice and trail gently onto the upper skirt. The back features a sheer illusion panel with matching lace appliques and a row of buttons down the center.',
    images: [
      p('clean', '1AF62A14-D463-4296-996D-4407D0D05C0C_nohead.PNG'),
      p('BEVERLY', 'Nolli', '791B9E80-C741-4596-9D8B-98B623FF0BF9.PNG'),
      p('BEVERLY', 'Nolli', '788465EE-72EB-4D98-AF47-976F66A94BE3.jpg'),
      p('BEVERLY', 'Nolli', '8B0FFD39-1E26-4F31-B784-AE7BA3AF65B4.jpg'),
    ],
  },
  {
    name: 'Solea',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Beverly collection, model Solea. A-line gown made entirely of shimmering star-patterned tulle. The bodice features a deep plunging V-neckline down to the waist and voluminous sheer long sleeves gathered at the wrists. The back is completely open in a deep V-shape. The lightweight skirt flows fluidly to a long sheer train.',
    images: [
      p('clean', '1F094A24-E99A-40BC-82F4-0FA8E7DC3167_nohead.PNG'),
      p('BEVERLY', 'Solea', '9018FCB1-33DE-486D-9511-C42292ED2A65.PNG'),
      p('BEVERLY', 'Solea', 'B9A677F9-769E-452A-91B7-93DC86E26CC2.PNG'),
    ],
  },
  {
    name: 'Valensia',
    description: 'Wedding dress garment reference, not a person. Salon FYa Oradea, Beverly collection, model Valensia. Long-sleeve A-line gown made entirely of dense floral and nature-inspired lace. The bodice features a high mock neckline and long fitted sleeves. The back is fully covered in the same intricate lace with a row of small buttons down the center.',
    images: [
      p('clean', '8FC77535-6FF4-4D57-AB1F-9CAE439BEA3B_nohead.PNG'),
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
