import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ANNA_DRESSES = [
  { name: 'Anais', images: ['ANNA/Anais/0A1909F0-C8B1-4B7C-AA3E-2514FAA0D407.jpg', 'ANNA/Anais/79DC5387-A233-4FAF-A400-365F22270EED.PNG', 'ANNA/Anais/A85332DF-BE08-4DA1-9DF5-CF48706FFDBF.PNG'] },
  { name: 'Anamara', images: ['IMPERIAL/Anamara/IMG_6316.jpg', 'IMPERIAL/Anamara/3D870093-9834-45A4-9A7A-821B9FFB6889.PNG', 'IMPERIAL/Anamara/744883C6-51FE-44AB-ADDD-D4F57FAFFF68.PNG'] },
  { name: 'Anamaria', images: ['ANNA/Anamaria/IMG_5829.jpg', 'ANNA/Anamaria/IMG_5841.jpg', 'ANNA/Anamaria/IMG_5843.jpg', 'ANNA/Anamaria/IMG_5845.jpg'] },
  { name: 'Anaria', images: ['ANNA/Anaria/48777E20-17E8-4147-8162-1DFA6FC8ED37.PNG', 'ANNA/Anaria/753C58D1-6014-43EF-B408-E9D5382C43EE.PNG', 'ANNA/Anaria/E110F78F-1AE3-4F76-9927-C1C38242F2B0.PNG'] },
  { name: 'Anastasia', images: ['ANNA/Anastasia/20FF0E7B-AEEA-4216-A8BD-DB3ED5252E97.PNG', 'ANNA/Anastasia/811DDE31-7EB2-44F1-8D33-920F6E536A1E.PNG', 'ANNA/Anastasia/9882240D-72F9-435F-9A1C-213C53DC6380.PNG'] },
  { name: 'Anastea', images: ['ANNA/Anastea/IMG_6002.jpg', 'ANNA/Anastea/162B7262-5C38-4385-9346-FDB3B1527BD4.PNG', 'ANNA/Anastea/22696034-4E9C-4BE8-AAE9-528DBC3C1ED7.PNG', 'ANNA/Anastea/C5E124D3-D23F-46C6-9FFF-B48DBC1B5C58.PNG'] },
  { name: 'Anatolia', images: ['ANNA/Anatolia/IMG_5851.jpg', 'ANNA/Anatolia/IMG_5855.jpg'] },
  { name: 'Anavelle', images: ['ANNA/Anavelle/A74C3A1A-C6FF-4C80-BBF4-6E3736B9F525.PNG', 'ANNA/Anavelle/F0984693-7165-430E-A06E-8451F8492F3A.PNG', 'ANNA/Anavelle/FC5646E0-8C55-4E53-B5C4-FE51E2B46449.PNG'] },
  { name: 'Anelie', images: ['ANNA/Anelie/309257BD-2244-49A4-A5D5-50358890D6D5.PNG', 'ANNA/Anelie/3F333F5B-B61B-4A2E-87D1-8325BBA0CBF7.PNG', 'ANNA/Anelie/B16FAF52-4CD5-4C75-A5D3-04E5ECE96EEB.PNG'] },
  { name: 'Annabelle', images: ['ANNA/Annabelle/IMG_5868.jpg', 'ANNA/Annabelle/IMG_5872.jpg', 'ANNA/Annabelle/IMG_5875.jpg', 'ANNA/Annabelle/IMG_5881.jpg'] },
  { name: 'Annador', images: ['ANNA/Annador/0DB5AAD1-EEE2-40B7-926B-403B31D9EEE2.PNG', 'ANNA/Annador/BBACE0F9-1649-4353-93B4-A7D453D0991C.PNG'] },
  { name: 'Annette', images: ['ANNA/Annette/IMG_5917.jpg', 'ANNA/Annette/IMG_5918.jpg', 'ANNA/Annette/IMG_5919.jpg', 'ANNA/Annette/35C61BE9-0D54-4949-881A-50C8B2229576.PNG'] },
  { name: 'Just Anna', images: ['ANNA/Just Anna/IMG_5889.jpg', 'ANNA/Just Anna/IMG_5890.jpg', 'ANNA/Just Anna/IMG_5908.jpg'] },
];

const ROOT_DIR = path.resolve(process.cwd(), 'public/images');
const CLEAN_DIR = path.resolve(process.cwd(), 'public/images/clean/ANNA');

async function processImages() {
  if (!fs.existsSync(CLEAN_DIR)) {
    fs.mkdirSync(CLEAN_DIR, { recursive: true });
  }

  const elements = [];

  for (const dress of ANNA_DRESSES) {
    const elementName = `FYA-DRESS-ANNA-${dress.name.replace(/\\s+/g, '')}`;
    const cleanImagePaths = [];

    for (const imageRelPath of dress.images) {
      const sourcePath = path.join(ROOT_DIR, imageRelPath);
      const filename = path.basename(imageRelPath);
      // Give each image a unique name inside CLEAN_DIR to avoid collisions (e.g. if Anamara is in IMPERIAL but processed as ANNA, or if filenames are identical)
      // Since filenames in these folders seem unique, we can just use filename. Wait, Anamara might have identical filenames to something else? 
      // Safest is to prefix with dress name
      const targetFilename = `${dress.name.replace(/\\s+/g, '')}_${filename}`;
      const targetPath = path.join(CLEAN_DIR, targetFilename);

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
        
        console.log(`Cropped: ${targetFilename}`);
        cleanImagePaths.push(`public/images/clean/ANNA/${targetFilename}`);
      } catch (e) {
        console.error(`Error processing ${sourcePath}:`, e);
      }
    }

    elements.push({
      element_name: elementName,
      collection: 'ANNA',
      images: cleanImagePaths
    });
  }

  // Update elements JSON
  const elementsJsonPath = path.resolve(process.cwd(), 'data/higgsfield-elements.json');
  let existingElements = [];
  if (fs.existsSync(elementsJsonPath)) {
    existingElements = JSON.parse(fs.readFileSync(elementsJsonPath, 'utf8'));
  }

  // Filter out any existing ANNA elements to avoid duplicates during re-runs
  existingElements = existingElements.filter(e => e.collection !== 'ANNA');
  const allElements = [...existingElements, ...elements];
  
  if (!fs.existsSync(path.dirname(elementsJsonPath))) {
    fs.mkdirSync(path.dirname(elementsJsonPath), { recursive: true });
  }

  fs.writeFileSync(elementsJsonPath, JSON.stringify(allElements, null, 2));
  console.log('Updated higgsfield-elements.json with ANNA elements');
}

processImages().catch(console.error);
