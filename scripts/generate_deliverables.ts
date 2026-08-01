import * as fs from 'fs';
import * as path from 'path';
import { LOCAL_CATALOG } from '../src/data/catalog';

function removeDiacritics(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function cleanName(name: string) {
  return removeDiacritics(name).replace(/\s+/g, '-').slice(0, 32);
}

function getAbrev(collection: string) {
  switch (collection.toUpperCase()) {
    case 'IMPERIAL': return 'IMP';
    case 'ANNA': return 'ANN';
    case 'MAYRA': return 'MAY';
    case 'BEVERLY': return 'BEV';
    default: return 'UNK';
  }
}

function extractTechnicalDescription(description: string) {
  // Description format: "Wedding dress garment reference, not a person. Salon FYa Oradea, [Colecție] collection, model [Nume]. [descriere tehnică EN]"
  const parts = description.split('. ');
  if (parts.length >= 3) {
    return parts.slice(2).join('. ');
  }
  return description;
}

function extractSilhouette(techDesc: string) {
  const match = techDesc.match(/(A-line|ball gown|mermaid|sheath|trumpet|empire|fit and flare|fit-and-flare)/i);
  return match ? match[1].toLowerCase() : 'unknown';
}

function generate() {
  const elements = [];
  let mdContent = '';

  for (const dress of LOCAL_CATALOG) {
    const abrev = getAbrev(dress.collection);
    const elemName = `FYA-DRESS-${abrev}-${cleanName(dress.name)}`;
    
    // Absolute URLs, max 4 images
    const images = dress.images.slice(0, 4).map(img => {
      // img starts with '/'
      return `https://salonfya.com${img.replace(/ /g, '%20')}`;
    });

    const has_face = false; 

    elements.push({
      element_name: elemName,
      collection: dress.collection.charAt(0).toUpperCase() + dress.collection.slice(1).toLowerCase(),
      dress: dress.name,
      category: 'prop',
      description: dress.description || '',
      images: images,
      image_notes: "1 = cadru întreg față fără cap, 2 = spate", // Placeholder, since we just parsed
      has_face_in_primary: has_face,
      cleaned: false,
      missing_shots: []
    });

    const techDesc = extractTechnicalDescription(dress.description || '');
    const silhouette = extractSilhouette(techDesc);

    mdContent += `## ${dress.name} (${dress.collection.charAt(0).toUpperCase() + dress.collection.slice(1).toLowerCase()})\n`;
    mdContent += `Element: ${elemName}\n`;
    mdContent += `Garment: ${techDesc}\n`;
    mdContent += `Silhouette: ${silhouette}\n`;
    mdContent += `Key detail: ${techDesc.split(',')[0]}\n\n`; // just a guess for key detail
  }

  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  fs.writeFileSync(path.join(dataDir, 'higgsfield-elements.json'), JSON.stringify(elements, null, 2));
  fs.writeFileSync(path.join(dataDir, 'higgsfield-prompt-snippets.md'), mdContent.trim());
  
  console.log(`Generated ${elements.length} elements.`);
}

generate();
