#!/usr/bin/env node
// Optimize one supplied image without changing existing catalogue images.
const sharp = require('sharp');
const path = require('node:path');
const fs = require('node:fs/promises');
async function optimize(input, output) {
  if (!input || !output) throw new Error('Usage: node scripts/optimize-images.cjs INPUT OUTPUT');
  if (path.resolve(input) === path.resolve(output)) throw new Error('Input and output must differ');
  await fs.mkdir(path.dirname(output), { recursive: true });
  await sharp(input).rotate().resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
    .flatten({ background: '#ffffff' }).jpeg({ quality: 80, mozjpeg: true }).toFile(output);
}
if (require.main === module) optimize(process.argv[2], process.argv[3]).catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = optimize;
