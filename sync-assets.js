import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp'; // 🛠️ Added Sharp for image optimization

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIGURATION ---
const VAULT_ROOT = "C:/Users/pheob/Documents/Obsidian Hobby Project/Obsidian Data/Project1dnd"; 
const SOURCE_MD_FOLDER = path.join(VAULT_ROOT, "MetaData_Public");
const DEST_CONTENT_ROOT = path.join(__dirname, "content"); 

console.log("🚀 Syncing Notes, converting images to WebP, and formatting paths...");

if (!fs.existsSync(SOURCE_MD_FOLDER)) {
    console.error(`❌ Error: Source folder not found at ${SOURCE_MD_FOLDER}`);
    process.exit(1);
}

const publicDestFolder = path.join(DEST_CONTENT_ROOT, "MetaData_Public");
if (!fs.existsSync(publicDestFolder)) fs.mkdirSync(publicDestFolder, { recursive: true });

const markdownFiles = fs.readdirSync(SOURCE_MD_FOLDER).filter(f => f.endsWith('.md'));

// 🔄 Switched to a for...of loop to natively support top-level await for image processing
for (const file of markdownFiles) {
    const srcFilePath = path.join(SOURCE_MD_FOLDER, file);
    let content = fs.readFileSync(srcFilePath, 'utf8');

    const pathRegex = /(MetaData_Shop\/_resources\/[^\s,\]"'\n<>]+|Attachments\/Miniatures_Gallery\/[^\s,\]"'\n<>]+)/gi;
    let match;

    // Direct copy & optimization of assets from Vault straight into your content/ root folder
    while ((match = pathRegex.exec(content)) !== null) {
        const rawVaultPath = match[0].trim();
        const absoluteSrcImgPath = path.join(VAULT_ROOT, rawVaultPath);

        if (fs.existsSync(absoluteSrcImgPath)) {
            const isConvertibleImage = /\.(png|jpg|jpeg)$/i.test(rawVaultPath);
            let finalVaultPath = rawVaultPath;

            // If it's a standard image, change the target destination extension to .webp
            if (isConvertibleImage) {
                finalVaultPath = rawVaultPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
            }

            const absoluteDestContentImgPath = path.join(DEST_CONTENT_ROOT, finalVaultPath);
            const destContentImgDir = path.dirname(absoluteDestContentImgPath);
            
            if (!fs.existsSync(destContentImgDir)) fs.mkdirSync(destContentImgDir, { recursive: true });
            
            if (isConvertibleImage) {
                try {
                    // ⚡ Convert, resize, and compress the image on the fly
                    await sharp(absoluteSrcImgPath)
                        .resize({ width: 1400, withoutEnlargement: true }) // Resizes wide images; leaves small images alone
                        .webp({ quality: 75 })                            // 75% quality WebP is the golden sweet spot for size/clarity
                        .toFile(absoluteDestContentImgPath);
                } catch (err) {
                    console.error(`⚠️ Failed to process image ${rawVaultPath}:`, err.message);
                    // Fallback: If sharp fails, just copy the original file as a safety net
                    fs.copyFileSync(absoluteSrcImgPath, path.join(DEST_CONTENT_ROOT, rawVaultPath));
                }
            } else {
                // Non-image assets (PDFs, SVGs, etc.) are copied over unchanged
                fs.copyFileSync(absoluteSrcImgPath, absoluteDestContentImgPath);
            }
        }
    }

    // 🎯 FIX: Prepend leading slash AND replace file extensions to .webp for converted images
    content = content.replace(pathRegex, (m) => {
        let trimmed = m.trim();
        
        // Swap extension to .webp in the markdown string if it matches an image type
        if (/\.(png|jpg|jpeg)$/i.test(trimmed)) {
            trimmed = trimmed.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        }
        
        return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    });

    const destFilePath = path.join(publicDestFolder, file);
    fs.writeFileSync(destFilePath, content, 'utf8');
}

console.log(`\n✅ Success! All markdown assets prepped, and images optimized to WebP.`);