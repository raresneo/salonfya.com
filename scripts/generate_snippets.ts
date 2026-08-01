import * as fs from 'fs';
import * as path from 'path';

const catalogPath = path.join(process.cwd(), 'src/data/catalog.ts');
const catalogContent = fs.readFileSync(catalogPath, 'utf8');

const collections = ['IMPERIAL', 'ANNA', 'MAYRA', 'BEVERLY'];
let markdown = '';
let count = 0;

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
    
    const descMatch = block.match(/description:\s*'([^']*)'/);
    if (!descMatch) continue;
    const desc = descMatch[1];
    
    markdown += `## ${name}\n\`${desc}\`\n\n`;
    count++;
  }
}

const outPath = path.join(process.cwd(), 'data/higgsfield-prompt-snippets.md');
fs.writeFileSync(outPath, markdown, 'utf8');
console.log(`Generated ${count} snippets in ${outPath}`);
