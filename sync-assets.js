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

console.log("🚀 Syncing Notes, converting images (handling Windows paths) to WebP...");

if (!fs.existsSync(SOURCE_MD_FOLDER)) {
    console.error(`❌ Error: Source folder not found at ${SOURCE_MD_FOLDER}`);
    process.exit(1);
}

// Ensure markdown content destination folder exists
const publicDestFolder = path.join(DEST_CONTENT_ROOT, "MetaData_Public");
if (!fs.existsSync(publicDestFolder)) fs.mkdirSync(publicDestFolder, { recursive: true });

const markdownFiles = fs.readdirSync(SOURCE_MD_FOLDER).filter(f => f.endsWith('.md'));

// 🛠️ FIX: Regular expression handles both forward slashes (/) and Windows backslashes (\)
const pathRegex = /(MetaData_Shop[\/\\]_resources[\/\\][^\s,\]"'\n<>]+|Attachments[\/\\]Miniatures_Gallery[\/\\][^\s,\]"'\n<>]+)/gi;

for (const file of markdownFiles) {
    const srcFilePath = path.join(SOURCE_MD_FOLDER, file);
    let content = fs.readFileSync(srcFilePath, 'utf8');

    let match;
    while ((match = pathRegex.exec(content)) !== null) {
        // 🛠️ FIX: Normalize backslashes to forward slashes immediately for processing
        const rawVaultPath = match[0].trim().replace(/\\/g, '/');
        const absoluteSrcImgPath = path.join(VAULT_ROOT, rawVaultPath);

        if (fs.existsSync(absoluteSrcImgPath)) {
            const isConvertibleImage = /\.(png|jpg|jpeg|avif)$/i.test(rawVaultPath);
            let finalVaultPath = rawVaultPath;

            if (isConvertibleImage) {
                finalVaultPath = rawVaultPath.replace(/\.(png|jpg|jpeg|avif)$/i, '.webp');
            }

            const absoluteDestStaticImgPath = path.join(DEST_STATIC_ROOT, finalVaultPath);
            const destStaticImgDir = path.dirname(absoluteDestStaticImgPath);
            
            if (!fs.existsSync(destStaticImgDir)) fs.mkdirSync(destStaticImgDir, { recursive: true });
            
            if (isConvertibleImage) {
                try {
                    await sharp(absoluteSrcImgPath)
                        .resize({ width: 1400, withoutEnlargement: true })
                        .webp({ quality: 75 })
                        .toFile(absoluteDestStaticImgPath);
                } catch (err) {
                    console.error(`⚠️ Failed to process image ${rawVaultPath}:`, err.message);
                    fs.copyFileSync(absoluteSrcImgPath, path.join(DEST_STATIC_ROOT, rawVaultPath));
                }
            } else {
                fs.copyFileSync(absoluteSrcImgPath, absoluteDestStaticImgPath);
            }
        }
    }

    // Rewrite image references inside the markdown document
    content = content.replace(pathRegex, (m) => {
        // 🛠️ FIX: Clean up Windows paths inside your notes to use web-safe forward slashes
        let trimmed = m.trim().replace(/\\/g, '/');
        
        if (/\.(png|jpg|jpeg|avif)$/i.test(trimmed)) {
            trimmed = trimmed.replace(/\.(png|jpg|jpeg|avif)$/i, '.webp');
        }
        
        if (trimmed.startsWith('/')) {
            trimmed = trimmed.substring(1);
        }
        
        return trimmed.startsWith('../') ? trimmed : `../${trimmed}`;
    });

    const destFilePath = path.join(publicDestFolder, file);
    fs.writeFileSync(destFilePath, content, 'utf8');
}

console.log(`\n✅ Success! All Windows-formatted image paths converted to WebP and deployed safely.`);