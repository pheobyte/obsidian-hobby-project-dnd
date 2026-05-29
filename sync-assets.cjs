const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
// Update this to the absolute path of your real local Obsidian Vault
const VAULT_ROOT = "C:/Users/pheob/Documents/Obsidian Hobby Project/Obsidian Data/Project1dnd";

// Paths relative to your Vault and Quartz setup
const SOURCE_MD_FOLDER = path.join(VAULT_ROOT, "MetaData_Public");
const DEST_CONTENT_FOLDER = path.join(__dirname, "content");
const DEST_STATIC_IMAGES = path.join(DEST_CONTENT_FOLDER, "images");

// Ensure Quartz destination directories exist
if (!fs.existsSync(DEST_CONTENT_FOLDER)) fs.mkdirSync(DEST_CONTENT_FOLDER, { recursive: true });
if (!fs.existsSync(DEST_STATIC_IMAGES)) fs.mkdirSync(DEST_STATIC_IMAGES, { recursive: true });

console.log("🚀 Starting selective Sync to Quartz...");

// 1. Read all generated public markdown files
const files = fs.readdirSync(SOURCE_MD_FOLDER).filter(f => f.endsWith('.md'));

files.forEach(file => {
    const srcFilePath = path.join(SOURCE_MD_FOLDER, file);
    let content = fs.readFileSync(srcFilePath, 'utf8');
    
    // Regular Expression to find image paths in your frontmatter arrays or text
    // Matches patterns like: MetaData_Shop/_resources/xyz.avif or Attachments/Miniatures_Gallery/xyz.jpg
    const imageRegex = /(MetaData_Shop\/_resources\/[^\s,\]"'\n]+|Attachments\/Miniatures_Gallery\/[^\s,\]"'\n]+)/g;
    
    let match;
    const imagesToCopy = [];
    
    while ((match = imageRegex.exec(content)) !== null) {
        imagesToCopy.push(match[0]);
    }

    // 2. Copy the specific images used in this note
    imagesToCopy.forEach(relativeImgPath => {
        // Clean up formatting brackets or quotes if any snuck in
        const cleanRelativePath = relativeImgPath.replace(/[\[\]"']/g, '').trim();
        const absoluteSrcImgPath = path.join(VAULT_ROOT, cleanRelativePath);
        
        if (fs.existsSync(absoluteSrcImgPath)) {
            const imgFileName = path.basename(cleanRelativePath);
            const destinationImgPath = path.join(DEST_STATIC_IMAGES, imgFileName);
            
            // Only copy if file doesn't exist or is changed to save speed
            fs.copyFileSync(absoluteSrcImgPath, destinationImgPath);
            
            // 3. Rewrite the path inside the copied markdown content so Quartz can render it locally
            // Changes "Attachments/Miniatures_Gallery/pic.jpg" -> "images/pic.jpg"
            const escapedPath = cleanRelativePath.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            const replaceRegex = new RegExp(escapedPath, 'g');
            content = content.replace(replaceRegex, `images/${imgFileName}`);
        } else {
            console.warn(`⚠️ Image not found in vault: ${cleanRelativePath}`);
        }
    });

    // 4. Save the cleanly modified markdown file directly into the Quartz content folder
    const destFilePath = path.join(DEST_CONTENT_FOLDER, file);
    fs.writeFileSync(destFilePath, content, 'utf8');
});

console.log(`✅ Sync Complete! Processed ${files.length} notes. Only required images were copied.`);