import os
import json
import re

dresses = {
    'Alma': {'has_face': True},
    'Argente': {'has_face': True},
    'Aurelia': {'has_face': False},
    'Daiana': {'has_face': True},
    'Elia': {'has_face': True},
    'Elise': {'has_face': True},
    'Evora': {'has_face': True},
    'Ivory Grace': {'has_face': True},
    'Lumina': {'has_face': True},
    'Mayson': {'has_face': True},
    'Queen': {'has_face': True},
    'Selena': {'has_face': True},
}

with open('data/higgsfield-elements.json', 'r') as f:
    data = json.load(f)

for item in data:
    if item['collection'] == 'Imperial':
        name = item['dress']
        if name in dresses:
            has_face = dresses[name]['has_face']
            item['has_face_in_primary'] = has_face
            item['cleaned'] = True
            
            if has_face:
                # crop the image
                import urllib.parse
                img_url = item['images'][0]
                img_path = img_url.replace('https://salonfya.com', '')
                local_in = os.path.join('public', urllib.parse.unquote(img_path.lstrip('/')))
                
                # generate out path
                base_name = os.path.basename(local_in)
                name_no_ext, ext = os.path.splitext(base_name)
                out_name = f"{name_no_ext}_nohead{ext}"
                local_out = os.path.join('public', 'images', 'clean', out_name)
                
                # call crop_head.py
                os.system(f"python3 scripts/crop_head.py \"{local_in}\" \"{local_out}\"")
                
                # update the catalog.ts with the new image
                # this is tricky with python, better to write a separate node script for catalog update
                dresses[name]['new_img'] = f"/images/clean/{out_name}"

with open('data/higgsfield-elements.json', 'w') as f:
    json.dump(data, f, indent=2)

# Write a node script to update catalog.ts
node_script = """
import * as fs from 'fs';
import * as path from 'path';

const catalogPath = path.join(process.cwd(), 'src/data/catalog.ts');
let content = fs.readFileSync(catalogPath, 'utf8');

const updates = """ + json.dumps(dresses) + """;

const col = 'IMPERIAL';
const regex = new RegExp(`const ${col}_SEEDS: Seed\\[\\] = \\\\s*\\\\[([\\\\s\\\\S]*?)\\\\];`, 'g');

content = content.replace(regex, (match, arrayContent) => {
  let newArrayContent = arrayContent;
  
  for (const name in updates) {
    if (updates[name].new_img) {
      const newImg = updates[name].new_img;
      // find the dress block
      // regex to find `name: 'name', ... images: [ ... ]`
      const dressRegex = new RegExp(`(name:\\s*'${name}',[\\\\s\\\\S]*?images:\\s*\\[\\s*)([^,]+)(,[\\\\s\\\\S]*?\\])`, 'g');
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
"""

with open('scripts/update_imperial_catalog.ts', 'w') as f:
    f.write(node_script)
