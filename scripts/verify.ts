import * as fs from 'fs';
import * as path from 'path';

async function verify() {
  const dataPath = path.join(process.cwd(), 'data/higgsfield-elements.json');
  if (!fs.existsSync(dataPath)) {
    console.error('File not found:', dataPath);
    return;
  }

  const elements = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log(`Verifying ${elements.length} elements...`);
  
  if (elements.length !== 48) {
    console.error(`EXPECTED 48 elements, got ${elements.length}`);
  }

  const names = new Set();
  const errors = [];
  
  let validUrlCount = 0;

  for (const el of elements) {
    // Check element_name
    if (el.element_name.length >= 32) {
      errors.push(`[${el.element_name}] Name >= 32 chars: ${el.element_name.length}`);
    }
    if (/[ăâîșțĂÂÎȘȚ]/.test(el.element_name)) {
      errors.push(`[${el.element_name}] Contains diacritics`);
    }
    if (names.has(el.element_name)) {
      errors.push(`[${el.element_name}] Duplicate name`);
    }
    names.add(el.element_name);

    // Check images
    if (el.images.length > 4) {
      errors.push(`[${el.element_name}] Has ${el.images.length} images (max 4)`);
    }
    
    // Check face
    if (el.has_face_in_primary !== false) {
      errors.push(`[${el.element_name}] has_face_in_primary is not false`);
    }

    // Check URLs
    for (const url of el.images) {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        if (res.status !== 200) {
          errors.push(`[${el.element_name}] URL failed with ${res.status}: ${url}`);
        } else {
          validUrlCount++;
        }
      } catch (e: any) {
        errors.push(`[${el.element_name}] URL fetch error: ${e.message} for ${url}`);
      }
    }
  }

  console.log(`Found ${errors.length} errors.`);
  if (errors.length > 0) {
    console.log(errors.join('\n'));
  }
  console.log(`Verified ${validUrlCount} valid image URLs.`);
}

verify();
