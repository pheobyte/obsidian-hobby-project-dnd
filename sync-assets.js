import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp'; // 🛠️ Sharp for image optimization

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIGURATION ---
const VAULT_ROOT = "C:/Users/pheob/Documents/Obsidian Hobby Project/Obsidian Data/Project1dnd"; 
const SOURCE_MD_FOLDER = path.join(VAULT_ROOT, "MetaData_Public");
const DEST_CONTENT_ROOT = path.join(__dirname, "content");  // Destination for Markdown pages
const DEST_STATIC_ROOT = path.join(__dirname, "quartz", "static"); // 🛠️ Forced destination for Assets

console.log("🚀 Syncing Notes, converting images (including AVIF) to WebP, and formatting relative paths...");

if (!fs.existsSync(SOURCE_MD_FOLDER)) {
    console.error(`❌ Error: Source folder not found at ${SOURCE_MD_FOLDER}`);
    process.exit(1);
}

// Ensure markdown content destination folder exists
const publicDestFolder = path.join(DEST_CONTENT_ROOT, "MetaData_Public");
if (!fs.existsSync(publicDestFolder)) fs.mkdirSync(publicDestFolder, { recursive: true });

const markdownFiles = fs.readdirSync(SOURCE_MD_FOLDER).filter(f => f.endsWith('.md'));

// 🔄 Using a for...of loop to natively support top-level await for image processing
for (const file of markdownFiles) {
    const srcFilePath = path.join(SOURCE_MD_FOLDER, file);
    let content = fs.readFileSync(srcFilePath, 'utf8');

    const pathRegex = /(MetaData_Shop\/_resources\/[^\s,\]"'\n<>]+|Attachments\/Miniatures_Gallery\/[^\s,\]"'\n<>]+)/gi;
    let match;

    // Direct copy & optimization of assets from Vault straight into Quartz's native static/ directory
    while ((match = pathRegex.exec(content)) !== null) {
        const rawVaultPath = match[0].trim();
        const absoluteSrcImgPath = path.join(VAULT_ROOT, rawVaultPath);

        if (fs.existsSync(absoluteSrcImgPath)) {
            // 🛠️ CHANGED: Added 'avif' to the file extension match group
            const isConvertibleImage = /\.(png|jpg|jpeg|avif)$/i.test(rawVaultPath);
            let finalVaultPath = rawVaultPath;

            // If it's a standard image, change the target destination extension to .webp
            if (isConvertibleImage) {
                // 🛠️ CHANGED: Replaced the original extension with .webp for AVIF too
                finalVaultPath = rawVaultPath.replace(/\.(png|jpg|jpeg|avif)$/i, '.webp');
            }

            // Route assets directly into quartz/static/ instead of content/
            const absoluteDestStaticImgPath = path.join(DEST_STATIC_ROOT, finalVaultPath);
            const destStaticImgDir = path.dirname(absoluteDestStaticImgPath);
            
            if (!fs.existsSync(destStaticImgDir)) fs.mkdirSync(destStaticImgDir, { recursive: true });
            
            if (isConvertibleImage) {
                try {
                    // ⚡ Convert, resize, and compress the image on the fly
                    await sharp(absoluteSrcImgPath)
                        .resize({ width: 1400, withoutEnlargement: true }) // Resizes wide images; leaves small images alone
                        .webp({ quality: 75 })                             // 75% quality WebP is the golden sweet spot for size/clarity
                        .toFile(absoluteDestStaticImgPath);
                } catch (err) {
                    console.error(`⚠️ Failed to process image ${rawVaultPath}:`, err.message);
                    // Fallback: If sharp fails, copy original file as a safety net to static root
                    fs.copyFileSync(absoluteSrcImgPath, path.join(DEST_STATIC_ROOT, rawVaultPath));
                }
            } else {
                // Non-image assets (PDFs, SVGs, etc.) are copied over unchanged to static root
                fs.copyFileSync(absoluteSrcImgPath, absoluteDestStaticImgPath);
            }
        }
    }

    // 🎯 FIX: Convert image extensions to .webp AND prepend a relative step-back (../) 
    // This allows the browser to step out of 'MetaData_Public' and into 'MetaData_Shop' cleanly on GitHub Pages.
    content = content.replace(pathRegex, (m) => {
        let trimmed = m.trim();
        
        // 🛠️ CHANGED: Swaps .avif extensions inside markdown files to .webp as well
        if (/\.(png|jpg|jpeg|avif)$/i.test(trimmed)) {
            trimmed = trimmed.replace(/\.(png|jpg|jpeg|avif)$/i, '.webp');
        }
        
        // Strip out any accidental leading slash if it exists
        if (trimmed.startsWith('/')) {
            trimmed = trimmed.substring(1);
        }
        
        // Return relative structural stepback path
        return trimmed.startsWith('../') ? trimmed : `../${trimmed}`;
    });

    // Write the cleaned markdown document to the content folder
    const destFilePath = path.join(publicDestFolder, file);
    fs.writeFileSync(destFilePath, content, 'utf8');
}

console.log(`\n✅ Success! All markdown assets prepped in content/, and images (including AVIF) deployed safely to quartz/static/.`);