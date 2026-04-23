const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function optimizeAtelierImage(inputPath, outputPath) {
    try {
        console.log(`🎨 Optimizing image: ${inputPath}`);
        
        const image = sharp(inputPath);
        const metadata = await image.metadata();
        
        console.log(`📊 Original dimensions: ${metadata.width}x${metadata.height}`);
        console.log(`📦 Original size: ${(fs.statSync(inputPath).size / 1024).toFixed(2)} KB`);
        
        // Resize to max width of 1920px (responsive)
        const MAX_WIDTH = 1920;
        
        let processedImage = image;
        if (metadata.width > MAX_WIDTH) {
            processedImage = processedImage.resize({
                width: MAX_WIDTH,
                withoutEnlargement: true
            });
        }
        
        // Convert PNG to optimized format
        if (inputPath.toLowerCase().endsWith('.png')) {
            processedImage = processedImage.png({
                quality: 80,
                compressionLevel: 9,
                progressive: true
            });
        } else {
            // For JPEGs
            processedImage = processedImage.jpeg({
                quality: 80,
                progressive: true
            });
        }
        
        await processedImage.toFile(outputPath);
        
        const newSize = fs.statSync(outputPath).size;
        const oldSize = fs.statSync(inputPath).size;
        const saved = ((oldSize - newSize) / 1024).toFixed(2);
        const percentage = ((oldSize - newSize) / oldSize * 100).toFixed(1);
        
        console.log(`✅ Optimized size: ${(newSize / 1024).toFixed(2)} KB`);
        console.log(`💾 Saved: ${saved} KB (${percentage}%)`);
        console.log(`📍 Output: ${outputPath}`);
        
    } catch (error) {
        console.error('❌ Error optimizing image:', error.message);
        process.exit(1);
    }
}

// Usage
const inputPath = process.argv[2];
const outputPath = process.argv[3] || inputPath;

if (!inputPath) {
    console.error('❌ Usage: node optimize-atelier-image.cjs <input-path> [output-path]');
    process.exit(1);
}

if (!fs.existsSync(inputPath)) {
    console.error(`❌ File not found: ${inputPath}`);
    process.exit(1);
}

optimizeAtelierImage(inputPath, outputPath);
