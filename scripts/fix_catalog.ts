import * as fs from 'fs';
import * as path from 'path';

const catalogPath = path.join(process.cwd(), 'src/data/catalog.ts');
let content = fs.readFileSync(catalogPath, 'utf8');

const adjectives = [
  'Breathtaking', 'Stunning', 'Glamorous', 'Ethereal',
  'Whimsical', 'Opulent', 'Luxurious', 'Romantic', 'Elegant',
  'Sophisticated', 'Classic', 'Modest', 'Striking', 'Sleek',
  'Dainty', 'Delicate',
  'breathtaking', 'stunning', 'glamorous', 'ethereal',
  'whimsical', 'opulent', 'luxurious', 'romantic', 'elegant',
  'sophisticated', 'classic', 'modest', 'striking', 'sleek',
  'dainty', 'delicate'
];

const collections = ['IMPERIAL', 'ANNA', 'MAYRA', 'BEVERLY'];

for (const col of collections) {
  // We need to parse out the seed blocks. We'll use a replacer over the whole file
  // but we need to know the current collection name.
  // The structure is `const IMPERIAL_SEEDS: Seed[] = [...]`
  const regex = new RegExp(`const ${col}_SEEDS: Seed\\[\\] = \\s*\\[([\\s\\S]*?)\\];`, 'g');
  
  content = content.replace(regex, (match, arrayContent) => {
    // inside the arrayContent, replace description
    let newArrayContent = arrayContent;
    
    // We match `name: 'Alma',` to get the name, and then `description: '...'`
    // Since objects can be multi-line, it's a bit tricky with regex. Let's use a split approach.
    const itemRegex = /{\s*name:\s*'([^']+)',\s*description:\s*'([^']*)'/g;
    newArrayContent = newArrayContent.replace(itemRegex, (m, name, oldDesc) => {
      // 1. Remove adjectives
      let newDesc = oldDesc;
      adjectives.forEach(adj => {
        const regex = new RegExp(`\\b${adj}\\b\\s*`, 'gi');
        newDesc = newDesc.replace(regex, '');
      });
      // capitalize first letter if it got lowercased or removed
      newDesc = newDesc.trim();
      if (newDesc.length > 0) {
         newDesc = newDesc.charAt(0).toUpperCase() + newDesc.slice(1);
      }
      
      // If it already has the prefix, don't add it again
      const prefix = `Wedding dress garment reference, not a person. Salon FYa Oradea, ${col.charAt(0).toUpperCase() + col.slice(1).toLowerCase()} collection, model ${name}. `;
      if (!newDesc.startsWith("Wedding dress")) {
        newDesc = prefix + newDesc;
      }

      return `{\n    name: '${name}',\n    description: '${newDesc}'`;
    });

    return `const ${col}_SEEDS: DressSeed[] = [${newArrayContent}];`;
  });
}

fs.writeFileSync(catalogPath, content, 'utf8');
console.log("Catalog updated successfully!");
