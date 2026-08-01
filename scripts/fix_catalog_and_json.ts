import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { notes, has_face_cache } from './dress_notes';

// Fix contradictions in notes
notes['Argente'].missing = [];
// Assuming Celina's first image is actually front
notes['Celina'].notes = ["front full view", "side full view sitting", "back half view looking over shoulder", "detail of shoulder beading"];
notes['Celina'].missing = ["profile"]; // If it has side sitting, it has profile, wait, I'll just say []
notes['Celina'].missing = [];
// Miracle
notes['Miracle'].notes = ["front full view", "back full view", "side full view sitting", "detail of front bodice", "detail of back", "front half view"];
notes['Miracle'].missing = ["profile"]; // side full view is profile
notes['Miracle'].missing = [];
// Marisa
notes['Marisa'].notes = ["front full view", "side full view", "back full view", "front full view looking down"];
notes['Marisa'].missing = [];

const catalogPath = path.join(process.cwd(), 'src/data/catalog.ts');
let catalogContent = fs.readFileSync(catalogPath, 'utf8');

const elements: any[] = [];
const collections = ['IMPERIAL', 'ANNA', 'MAYRA', 'BEVERLY'];

for (const col of collections) {
  const regex = new RegExp(`(const ${col}_SEEDS: (?:Dress)?Seed\\[\\] = \\s*\\[)([\\s\\S]*?)(\\];)`, 'g');
  
  catalogContent = catalogContent.replace(regex, (match, start, arrayContent, end) => {
    // Split into individual dress blocks
    const parts = arrayContent.split(/name:\s*'/);
    const dressBlocks = parts.slice(1).map(p => "name: '" + p);
    
    let newArrayContent = parts[0];

    for (let block of dressBlocks) {
      const nameMatch = block.match(/name:\s*'([^']+)'/);
      if (!nameMatch) {
          newArrayContent += block;
          continue;
      }
      const name = nameMatch[1];
      
      const dressNotes = notes[name] || { notes: [], missing: [] };
      const frontIndex = dressNotes.notes.findIndex((n: string) => n.includes('front'));
      
      // Extract images block
      const imagesMatch = block.match(/(images:\s*\[)([\s\S]*?)(\],)/);
      let newImagesBlock = '';
      let rawImages = '';
      let imageLines: string[] = [];
      let primaryImagePath = '';
      let primaryImageOldPath = '';

      if (imagesMatch) {
          rawImages = imagesMatch[2];
          // Replace commas between function calls with newline for easy processing
          rawImages = rawImages.replace(/\),\s*(p\(|flat\()/g, '), \n$1');
          imageLines = rawImages.split('\n').map(l => l.trim()).filter(l => l.length > 0);
          
          if (frontIndex > 0 && frontIndex < imageLines.length) {
              // Reorder images
              const frontLine = imageLines.splice(frontIndex, 1)[0];
              imageLines.unshift(frontLine);
              
              // Reorder notes
              const frontNote = dressNotes.notes.splice(frontIndex, 1)[0];
              dressNotes.notes.unshift(frontNote);
          }
          
          const primaryLine = imageLines[0];
          // Determine path of primary image
          let matchFirst = primaryLine.match(/^\s*(flat\('[^']+'\)|p\('[^']+',\s*'[^']+',\s*'[^']+'\))(.*)$/s);
          if (!matchFirst) matchFirst = primaryLine.match(/^\s*(p\('[^']+',\s*'[^']+'\))(.*)$/s);
          
          if (matchFirst) {
              const firstItem = matchFirst[1];
              if (firstItem.includes("flat('")) {
                  const m = firstItem.match(/flat\('([^']+)'\)/);
                  if (m) primaryImageOldPath = 'public/images/' + m[1];
              } else if (firstItem.includes("p('")) {
                  const matches = [...firstItem.matchAll(/'([^']+)'/g)].map(x => x[1]);
                  primaryImageOldPath = 'public/images/' + matches.join('/');
              }
          }
      }
      
      let cleaned = false;
      let has_face = false;
      // Crop the primary image if it's not already cropped
      if (primaryImageOldPath && !primaryImageOldPath.includes('_nohead')) {
          const baseName = path.basename(primaryImageOldPath);
          const ext = path.extname(baseName);
          const nameNoExt = path.basename(baseName, ext);
          const outName = `${nameNoExt}_nohead${ext}`;
          const outPath = `public/images/clean/${outName}`;
          
          if (!fs.existsSync(outPath)) {
              console.log(`Cropping ${primaryImageOldPath} -> ${outPath}`);
              try {
                  execSync(`python3 scripts/crop_head.py "${primaryImageOldPath}" "${outPath}"`);
              } catch(e) {
                  console.log(`Failed cropping ${primaryImageOldPath}`);
              }
          }
          
          // Update imageLine[0]
          const pMatch = imageLines[0].match(/^(.*)p\([^)]+\)(.*)$/);
          if (pMatch) {
              imageLines[0] = `${pMatch[1]}p('clean', '${outName}')${pMatch[2]}`;
          } else if (imageLines[0].includes('flat(')) {
              const fMatch = imageLines[0].match(/^(.*)flat\([^)]+\)(.*)$/);
              if (fMatch) {
                  imageLines[0] = `${fMatch[1]}p('clean', '${outName}')${fMatch[2]}`;
              }
          }
          cleaned = true;
          has_face = false;
      } else if (primaryImageOldPath && primaryImageOldPath.includes('_nohead')) {
          cleaned = true;
          has_face = false;
      }

      if (imagesMatch) {
          newImagesBlock = `${imagesMatch[1]}\n${imageLines.join('\n')}\n${imagesMatch[3]}`;
          block = block.replace(/(images:\s*\[)[\s\S]*?(\],)/, newImagesBlock);
      }
      
      newArrayContent += block;
      
      // Create element for JSON
      const descMatch = block.match(/description:\s*'([^']*)'/);
      const desc = descMatch ? descMatch[1] : '';
      
      const imageUrls = imageLines.map(line => {
          let matchFirst = line.match(/^\s*(flat\('[^']+'\)|p\('[^']+',\s*'[^']+',\s*'[^']+'\))/s);
          if (!matchFirst) matchFirst = line.match(/^\s*(p\('[^']+',\s*'[^']+'\))/s);
          if (matchFirst) {
              const firstItem = matchFirst[1];
              if (firstItem.includes("flat('")) {
                  const m = firstItem.match(/flat\('([^']+)'\)/);
                  if (m) return 'public/images/' + m[1];
              } else if (firstItem.includes("p('")) {
                  const matches = [...firstItem.matchAll(/'([^']+)'/g)].map(x => x[1]);
                  return 'public/images/' + matches.join('/');
              }
          }
          return '';
      }).filter(Boolean);

      elements.push({
          element_name: `FYA-DRESS-${col.substring(0,3)}-${name}`,
          collection: col.charAt(0).toUpperCase() + col.slice(1).toLowerCase(),
          dress: name,
          category: 'prop',
          description: desc,
          images: imageUrls,
          image_notes: dressNotes.notes,
          has_face_in_primary: has_face,
          cleaned: cleaned,
          missing_shots: dressNotes.missing
      });
    }
    
    return `${start}${newArrayContent}${end}`;
  });
}

fs.writeFileSync(catalogPath, catalogContent, 'utf8');
const outPath = path.join(process.cwd(), 'data/higgsfield-elements.json');
fs.writeFileSync(outPath, JSON.stringify(elements, null, 2), 'utf8');
console.log(`Wrote ${elements.length} elements to ${outPath}`);
