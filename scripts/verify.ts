import * as fs from 'fs';
import * as path from 'path';
import { has_face_cache } from './dress_notes';

const catalogPath = path.join(process.cwd(), 'src/data/catalog.ts');
const catalogContent = fs.readFileSync(catalogPath, 'utf8');

const elementsPath = path.join(process.cwd(), 'data/higgsfield-elements.json');
const elements = JSON.parse(fs.readFileSync(elementsPath, 'utf8'));

let errors = 0;
let dressCount = 0;
const collections = ['IMPERIAL', 'ANNA', 'MAYRA', 'BEVERLY'];

for (const col of collections) {
  const regex = new RegExp(`const ${col}_SEEDS: (?:Dress)?Seed\\[\\] = \\s*\\[([\\s\\S]*?)\\];`, 'g');
  const match = regex.exec(catalogContent);
  if (!match) continue;
  
  const arrayContent = match[1];
  const parts = arrayContent.split(/name:\s*'/);
  const dressBlocks = parts.slice(1).map(p => "name: '" + p);

  for (const block of dressBlocks) {
    const nameMatch = block.match(/name:\s*'([^']+)'/);
    if (!nameMatch) continue;
    const name = nameMatch[1];
    dressCount++;
    
    // Check 1: PREFIX in description
    const descMatch = block.match(/description:\s*'([^']*)'/);
    if (!descMatch) {
       console.log(`❌ ${name}: No description found`);
       errors++;
    } else {
       const desc = descMatch[1].toLowerCase();
       const expectedPrefix = `Wedding dress garment reference, not a person. Salon FYa Oradea, ${col} collection, model ${name}.`.toLowerCase();
       if (!desc.startsWith(expectedPrefix)) {
          console.log(`❌ ${name}: Missing or incorrect prefix. Found: ${desc.substring(0, 50)}...`);
          errors++;
       }
    }
    
    // Check 2: 'clean' in images if has_face
    const has_face = has_face_cache[name];
    if (has_face) {
        const imagesMatch = block.match(/images:\s*\[([\s\S]*?)\]/);
        if (imagesMatch) {
            const rawImages = imagesMatch[1];
            if (!rawImages.includes("'clean'")) {
                console.log(`❌ ${name}: Expected 'clean' in images since has_face is true, but not found.`);
                errors++;
            }
        }
    }
  }
}

console.log(`\nCatalog contains ${dressCount} dresses.`);
console.log(`higgsfield-elements.json contains ${elements.length} elements.`);

if (dressCount !== 48) {
   console.log(`❌ Expected 48 dresses in catalog, found ${dressCount}`);
   errors++;
}
if (elements.length !== 48) {
   console.log(`❌ Expected 48 dresses in JSON, found ${elements.length}`);
   errors++;
}

// Cross-check missing
for (const el of elements) {
    const foundInCatalog = catalogContent.includes(`name: '${el.name}'`);
    if (!foundInCatalog) {
       console.log(`❌ ${el.name} from JSON not found in catalog!`);
       errors++;
    }
}

if (errors === 0) {
    console.log(`✅ All checks passed successfully!`);
} else {
    console.log(`❌ Failed with ${errors} errors.`);
}
