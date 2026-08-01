import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { notes, has_face_cache } from './dress_notes';

const catalogPath = path.join(process.cwd(), 'src/data/catalog.ts');
const catalogContent = fs.readFileSync(catalogPath, 'utf8');

const collections = ['IMPERIAL', 'ANNA', 'MAYRA', 'BEVERLY'];
const elements: any[] = [];

for (const col of collections) {
  const regex = new RegExp(`const ${col}_SEEDS: (?:Dress)?Seed\\[\\] = \\s*\\[([\\s\\S]*?)\\];`, 'g');
  const match = regex.exec(catalogContent);
  if (!match) continue;
  
  const arrayContent = match[1];
  // Split by name: ' to get each dress block reliably
  const parts = arrayContent.split(/name:\s*'/);
  const dressBlocks = parts.slice(1).map(p => "name: '" + p);

  for (const block of dressBlocks) {
    const nameMatch = block.match(/name:\s*'([^']+)'/);
    if (!nameMatch) continue;
    const name = nameMatch[1];
    
    // Extract images
    const imagesMatch = block.match(/images:\s*\[([\s\S]*?)\]/);
    let imagePaths: string[] = [];
    if (imagesMatch) {
        const rawImages = imagesMatch[1];
        // find all p(...) or flat(...)
        const flatMatches = [...rawImages.matchAll(/flat\('([^']+)'\)/g)];
        const pMatches = [...rawImages.matchAll(/p\('([^']+)',\s*'([^']+)'(?:,\s*'([^']+)')?\)/g)];
        
        for (const m of flatMatches) {
            imagePaths.push(`public/images/${col}/${m[1]}`);
        }
        for (const m of pMatches) {
            if (m[3]) {
                imagePaths.push(`public/images/${m[1]}/${m[2]}/${m[3]}`);
            } else {
                imagePaths.push(`public/images/${m[1]}/${m[2]}`);
            }
        }
    }

    const imageArgs = imagePaths.map(p => `--image "${p}"`).join(' ');
    
    // create higgsfield element
    let soul_id = '';
    console.log(`Generating soul-id for ${name}...`);
    try {
      const output = execSync(`/Users/rarespantis/.hermes/node/bin/higgsfield soul-id create --name "${name} - ${col}" --soul-cinematic ${imageArgs}`, { encoding: 'utf8', stdio: 'pipe' });
      const lines = output.split('\n');
      for (const line of lines) {
         if (line.includes('Soul ID:') || line.includes('soul_id')) {
            soul_id = line.replace(/.*Soul ID:/, '').trim();
         }
      }
      if (!soul_id) soul_id = output.trim().split('\n').pop()?.trim() || 'unknown';
    } catch (e: any) {
      console.log(`Failed generating soul-id for ${name}. Error: ${e.stderr || e.message}`);
      soul_id = null;
    }

    const dressNotes = notes[name] || { notes: [], missing: [] };
    const has_face = has_face_cache[name] || false;

    elements.push({
      name: name,
      collection: col,
      soul_id: soul_id,
      has_face_in_primary: has_face,
      image_notes: dressNotes.notes,
      missing_shots: dressNotes.missing
    });
  }
}

const outPath = path.join(process.cwd(), 'data/higgsfield-elements.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(elements, null, 2), 'utf8');
console.log(`Wrote ${elements.length} elements to ${outPath}`);

console.log("\n| Dress | Collection | Soul ID |");
console.log("|-------|------------|---------|");
for (const el of elements) {
  console.log(`| ${el.name} | ${el.collection} | ${el.soul_id} |`);
}
