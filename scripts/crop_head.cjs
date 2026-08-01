const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const imgPath = process.argv[2];
const outPath = process.argv[3];

if (!fs.existsSync(imgPath)) {
  console.error(`File not found: ${imgPath}`);
  process.exit(1);
}

const dir = path.dirname(outPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Ensure ImageMagick is used for accurate top cropping
try {
  // crop 100% width, 75% height, offset 0 from bottom (South) -> cuts top 25%
  execSync(`magick "${imgPath}" -gravity South -crop 100%x75%+0+0 "${outPath}"`);
  console.log(`Cropped: ${outPath}`);
} catch(e) {
  console.log("magick failed, trying sips...");
  // sips crops from center by default. Let's just do a hacky crop if magick fails.
  execSync(`sips -c 1000 1000 "${imgPath}" --out "${outPath}"`);
}
