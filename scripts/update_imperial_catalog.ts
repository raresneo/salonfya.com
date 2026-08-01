
import * as fs from 'fs';
import * as path from 'path';

const catalogPath = path.join(process.cwd(), 'src/data/catalog.ts');
let content = fs.readFileSync(catalogPath, 'utf8');

const updates = {"Alma": {"has_face": true, "new_img": "/images/clean/alma_front_nohead.jpg"}, "Argente": {"has_face": true, "new_img": "/images/clean/argente_front_nohead.jpg"}, "Aurelia": {"has_face": false}, "Daiana": {"has_face": true, "new_img": "/images/clean/daiana_front_nohead.jpg"}, "Elia": {"has_face": true, "new_img": "/images/clean/IMG_5552_nohead.jpg"}, "Elise": {"has_face": true, "new_img": "/images/clean/elise_front_nohead.jpg"}, "Evora": {"has_face": true, "new_img": "/images/clean/IMG_5580_nohead.jpg"}, "Ivory Grace": {"has_face": true, "new_img": "/images/clean/IMG_5395_nohead.jpg"}, "Lumina": {"has_face": true}, "Mayson": {"has_face": true, "new_img": "/images/clean/IMG_5364_nohead.jpg"}, "Queen": {"has_face": true, "new_img": "/images/clean/IMG_5568_nohead.jpg"}, "Selena": {"has_face": true}};

const col = 'IMPERIAL';
const regex = new RegExp(`const ${col}_SEEDS: Seed\[\] = \\s*\\[([\\s\\S]*?)\\];`, 'g');

content = content.replace(regex, (match, arrayContent) => {
  let newArrayContent = arrayContent;
  
  for (const name in updates) {
    if (updates[name].new_img) {
      const newImg = updates[name].new_img;
      // find the dress block
      // regex to find `name: 'name', ... images: [ ... ]`
      const dressRegex = new RegExp(`(name:\s*'${name}',[\\s\\S]*?images:\s*\[\s*)([^,]+)(,[\\s\\S]*?\])`, 'g');
      newArrayContent = newArrayContent.replace(dressRegex, (m, p1, p2, p3) => {
        // p2 is the first image, e.g. flat('alma_front.jpg')
        // we replace it with `p('${newImg}')` wait no, `flat` or `p` are helpers.
        // It's better to just put `flat('clean/${out_name}')` if we saved to clean/
        const baseName = newImg.split('/').pop();
        return `${p1}p('clean', '${baseName}')${p3}`;
      });
    }
  }
  return `const ${col}_SEEDS: Seed[] = [${newArrayContent}];`;
});

fs.writeFileSync(catalogPath, content, 'utf8');
console.log("Catalog updated!");
