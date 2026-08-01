import * as fs from 'fs';
import * as path from 'path';

const catalogPath = path.join(process.cwd(), 'src/data/catalog.ts');
let content = fs.readFileSync(catalogPath, 'utf8');

const adjectives = ["Breathtaking", "Stunning", "Glamorous", "Ethereal", "Whimsical", "Opulent", "Luxurious", "Romantic", "Elegant", "Sophisticated", "Classic", "Modest", "Striking", "Sleek", "Dainty", "Delicate"];
const adjectivesRegex = new RegExp(`\\b(${adjectives.join('|')})\\b\\s*`, 'gi');

const collections = ['IMPERIAL', 'ANNA', 'MAYRA', 'BEVERLY'];

for (const col of collections) {
  const regex = new RegExp(`(const ${col}_SEEDS: (?:Dress)?Seed\\[\\] = \\s*\\[)([\\s\\S]*?)(\\];)`, 'g');
  
  content = content.replace(regex, (match, start, arrayContent, end) => {
    
    // Split into individual dress blocks roughly by name: '...'
    const nameRegex = /(name:\s*'([^']+)',[\s\S]*?description:\s*')([^']*)(')/g;
    
    let newArrayContent = arrayContent.replace(nameRegex, (m, p1, name, desc, p4) => {
        let newDesc = desc;
        
        // Remove adjectives
        newDesc = newDesc.replace(adjectivesRegex, '');
        // Clean up capitalization
        newDesc = newDesc.charAt(0).toUpperCase() + newDesc.slice(1);
        
        // Add prefix if not already present
        const prefix = `Wedding dress garment reference, not a person. Salon FYa Oradea, ${col} collection, model ${name}. `;
        if (!newDesc.startsWith("Wedding dress garment reference")) {
            newDesc = prefix + newDesc;
        }
        
        return `${p1}${newDesc}${p4}`;
    });
    
    return `${start}${newArrayContent}${end}`;
  });
}

fs.writeFileSync(catalogPath, content, 'utf8');
console.log("Descriptions cleaned and prefixed!");
