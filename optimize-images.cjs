const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const directoryPath = path.join(__dirname, 'public/images');
const MAX_WIDTH = 1920; 
const QUALITY = 80;

async function optimizeImagesInDir(dir) {
    try {
        const files = await fs.promises.readdir(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = await fs.promises.stat(filePath);

            if (stat.isDirectory()) {
                await optimizeImagesInDir(filePath);
            } else {
                const ext = path.extname(file).toLowerCase();
                if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                    console.log(`Optimizing: ${filePath}`);
                    
                    const tempFilePath = `${filePath}.tmp`;

                    try {
                        const image = sharp(filePath);
                        const metadata = await image.metadata();

                        let processedImage = image;
                        if (metadata.width > MAX_WIDTH) {
                            processedImage = processedImage.resize({ width: MAX_WIDTH, withoutEnlargement: true });
                        }

                        if (['.jpg', '.jpeg'].includes(ext)) {
                            processedImage = processedImage.jpeg({ quality: QUALITY, progressive: true });
                        } else if (ext === '.png') {
                            // Convert standard PNGs to highly compressed PNGs 
                            processedImage = processedImage.png({ quality: QUALITY, compressionLevel: 9 });
                        }

                        await processedImage.toFile(tempFilePath);

                        // Compare sizes
                        const oldStat = await fs.promises.stat(filePath);
                        const newStat = await fs.promises.stat(tempFilePath);

                        if (newStat.size < oldStat.size) {
                            await fs.promises.rename(tempFilePath, filePath);
                            console.log(`Saved ${(oldStat.size - newStat.size) / 1024} KB`);
                        } else {
                            // If compression made it larger (rare but possible), discard temp file
                            await fs.promises.unlink(tempFilePath);
                            console.log(`Skipped (already optimized)`);
                        }
                    } catch (err) {
                        console.error(`Failed to optimize ${file}: ${err.message}`);
                        // Clean up temp file on failure
                        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
                    }
                }
            }
        }
    } catch (err) {
        console.error('Error walking directory:', err);
    }
}

console.log('Starting image optimization process...');
optimizeImagesInDir(directoryPath).then(() => {
    console.log('Optimization complete!');
});
