import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const IMPERIAL_DRESSES = [
  {
    name: 'Alma',
    images: ['alma_front.jpg', 'alma_back.jpg', 'alma_detail.jpg']
  },
  {
    name: 'Argente',
    images: ['argente_front.jpg', 'argente_front_2.jpg', 'argente_back.jpg', 'argente_detail.jpg']
  },
  {
    name: 'Aurelia',
    images: ['aurelia_front.jpg', 'aurelia_back.jpg', 'aurelia_detail.jpg', 'aurelia_closeup.jpg']
  },
  {
    name: 'Daiana',
    images: ['daiana_front.jpg', 'daiana_side.jpg', 'daiana_back.jpg', 'daiana_detail_1.jpg', 'daiana_detail_2.jpg']
  },
  {
    name: 'Elia',
    images: ['IMPERIAL/Elia/IMG_5552.jpg', 'IMPERIAL/Elia/IMG_5553.jpg', 'IMPERIAL/Elia/IMG_5554.jpg', 'IMPERIAL/Elia/IMG_5414.jpg', 'IMPERIAL/Elia/IMG_5415.jpg']
  },
  {
    name: 'Elise',
    images: ['elise_front.jpg', 'elise_side.jpg', 'elise_back.jpg', 'elise_detail.jpg']
  },
  {
    name: 'Evora',
    images: ['IMPERIAL/Evora/IMG_5580.jpg', 'IMPERIAL/Evora/IMG_5581.jpg', 'IMPERIAL/Evora/IMG_5583.jpg', 'IMPERIAL/Evora/IMG_5587.jpg']
  },
  {
    name: 'Ivory Grace',
    images: ['IMPERIAL/Ivory Grace/IMG_5395.jpg', 'IMPERIAL/Ivory Grace/IMG_5399.jpg', 'IMPERIAL/Ivory Grace/f202fbc6-6dd7-442b-8121-0cc159e5ff40.JPG']
  },
  {
    name: 'Lumiere',
    images: ['IMPERIAL/Lumiere/IMG_5439.jpg']
  },
  {
    name: 'Mayson',
    images: ['IMPERIAL/Mayson/IMG_5364.jpg', 'IMPERIAL/Mayson/IMG_5366.jpg', 'IMPERIAL/Mayson/IMG_5369.jpg', 'IMPERIAL/Mayson/IMG_5370.jpg']
  },
  {
    name: 'Queen',
    images: ['IMPERIAL/Queen/IMG_5568.jpg', 'IMPERIAL/Queen/IMG_5571.jpg', 'IMPERIAL/Queen/IMG_5463.jpg']
  },
  {
    name: 'Serena',
    images: ['IMPERIAL/Serena/IMG_5423.jpg', 'IMPERIAL/Serena/IMG_5424.jpg', 'IMPERIAL/Serena/IMG_5573.jpg', 'IMPERIAL/Serena/IMG_5460.jpg']
  }
];

const ROOT_DIR = path.resolve(process.cwd(), 'public/images');
const CLEAN_DIR = path.resolve(process.cwd(), 'public/images/clean/IMPERIAL');

async function processImages() {
  if (!fs.existsSync(CLEAN_DIR)) {
    fs.mkdirSync(CLEAN_DIR, { recursive: true });
  }

  const elements = [];

  for (const dress of IMPERIAL_DRESSES) {
    const elementName = `FYA-DRESS-IMP-${dress.name.replace(/\s+/g, '')}`;
    const cleanImagePaths = [];

    for (const imageRelPath of dress.images) {
      const sourcePath = path.join(ROOT_DIR, imageRelPath);
      const filename = path.basename(imageRelPath);
      const targetPath = path.join(CLEAN_DIR, filename);

      if (!fs.existsSync(sourcePath)) {
        console.warn(`File not found: ${sourcePath}`);
        continue;
      }

      try {
        const metadata = await sharp(sourcePath).metadata();
        const cropTop = Math.floor(metadata.height * 0.20);
        const cropHeight = metadata.height - cropTop;

        await sharp(sourcePath)
          .extract({ left: 0, top: cropTop, width: metadata.width, height: cropHeight })
          .toFile(targetPath);
        
        console.log(`Cropped: ${filename}`);
        cleanImagePaths.push(`public/images/clean/IMPERIAL/${filename}`);
      } catch (e) {
        console.error(`Error processing ${sourcePath}:`, e);
      }
    }

    elements.push({
      element_name: elementName,
      collection: 'IMPERIAL',
      images: cleanImagePaths
    });
  }

  // Update elements JSON
  const elementsJsonPath = path.resolve(process.cwd(), 'data/higgsfield-elements.json');
  let existingElements = [];
  if (fs.existsSync(elementsJsonPath)) {
    existingElements = JSON.parse(fs.readFileSync(elementsJsonPath, 'utf8'));
  }

  // Filter out any existing IMPERIAL elements to avoid duplicates during re-runs
  existingElements = existingElements.filter(e => e.collection !== 'IMPERIAL');
  const allElements = [...existingElements, ...elements];
  
  if (!fs.existsSync(path.dirname(elementsJsonPath))) {
    fs.mkdirSync(path.dirname(elementsJsonPath), { recursive: true });
  }

  fs.writeFileSync(elementsJsonPath, JSON.stringify(allElements, null, 2));
  console.log('Updated higgsfield-elements.json');
}

processImages().catch(console.error);
