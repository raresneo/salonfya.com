import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const dresses = {
    'Alma': { has_face: true },
    'Argente': { has_face: true },
    'Aurelia': { has_face: false },
    'Daiana': { has_face: true },
    'Elia': { has_face: true },
    'Elise': { has_face: true },
    'Evora': { has_face: true },
    'Ivory Grace': { has_face: true },
    'Lumiere': { has_face: true },
    'Mayson': { has_face: true },
    'Queen': { has_face: true },
    'Serena': { has_face: true },
};

const catalogPath = path.join(process.cwd(), 'src/data/catalog.ts');
let content = fs.readFileSync(catalogPath, 'utf8');

const col = 'IMPERIAL';
const regex = new RegExp(`const ${col}_SEEDS: (?:Dress)?Seed\\[\\] = \\s*\\[([\\s\\S]*?)\\];`, 'g');

content = content.replace(regex, (match, arrayContent) => {
  let newArrayContent = arrayContent;
  
  for (const name in dresses) {
    const hasFace = dresses[name].has_face;
    
    // find the dress block
    const dressRegex = new RegExp(`(name:\\s*'${name}',[\\s\\S]*?images:\\s*\\[\\s*)([^\\]]+)(\\])`, 'g');
    let found = false;
    
    newArrayContent = newArrayContent.replace(dressRegex, (m, p1, p2, p3) => {
      found = true;
      if (!hasFace) {
         return m; // unchanged
      }
      
      let firstItem = '';
      let rest = '';
      let matchFirst = p2.match(/^\s*(flat\('[^']+'\)|p\('[^']+',\s*'[^']+',\s*'[^']+'\))(.*)$/s);
      if (!matchFirst) {
          matchFirst = p2.match(/^\s*(p\('[^']+',\s*'[^']+'\))(.*)$/s);
      }
      
      if (matchFirst) {
          firstItem = matchFirst[1];
          rest = matchFirst[2];
      } else {
          console.log(`Could not parse first item for ${name}: ${p2}`);
          return m;
      }
      
      let oldImgPath = '';
      if (firstItem.includes("flat('")) {
          const m = firstItem.match(/flat\('([^']+)'\)/);
          if (m) oldImgPath = 'public/images/' + m[1];
      } else if (firstItem.includes("p('")) {
          const matches = [...firstItem.matchAll(/'([^']+)'/g)].map(x => x[1]);
          oldImgPath = 'public/images/' + matches.join('/');
      }
      
      if (!oldImgPath) {
          console.log(`Could not parse path for ${name}: ${firstItem}`);
          return m;
      }
      
      const baseName = path.basename(oldImgPath);
      const ext = path.extname(baseName);
      const nameNoExt = path.basename(baseName, ext);
      const outName = `${nameNoExt}_nohead${ext}`;
      const outPath = `public/images/clean/${outName}`;
      
      // crop if not exists
      if (!fs.existsSync(outPath)) {
         console.log(`Cropping ${oldImgPath} -> ${outPath}`);
         try {
           execSync(`python3 scripts/crop_head.py "${oldImgPath}" "${outPath}"`);
         } catch (e) {
           console.log(`Failed cropping ${oldImgPath}`);
         }
      }
      
      return `${p1}p('clean', '${outName}')${rest}${p3}`;
    });
    
    if (!found) console.log(`Dress ${name} not found in catalog string replacement`);
  }
  return `const ${col}_SEEDS: DressSeed[] = [${newArrayContent}];`;
});

fs.writeFileSync(catalogPath, content, 'utf8');
console.log("Catalog updated!");
