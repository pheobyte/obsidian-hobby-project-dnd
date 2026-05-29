import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { pathToRoot, resolveRelative } from "../util/path"

// 🛠️ Added 'fileData' to the destructured props to know the current page's position
const CardGrid: QuartzComponent = ({ allFiles, displayClass, fileData }: QuartzComponentProps) => {
  const galleryFiles = allFiles.filter((file) => 
    file.slug?.startsWith("MetaData_Public/") && file.frontmatter?.PUB_IMG_Icon
  )

  if (galleryFiles.length === 0) return null

  // 1. Calculate the relative path back to the root directory from the current note
  const baseDir = pathToRoot(fileData.slug!)

  return (
    <div className={`card-grid ${displayClass ?? ""}`}>
      {galleryFiles.map((file) => {
        const rawIconPath = file.frontmatter?.PUB_IMG_Icon as string
        
        // 2. Strip away any leading '../', './', or '/' to normalize the inner path
        const cleanIconPath = rawIconPath.replace(/^(\.\.\/|\.\/|\/)+/, "")
        
        // 3. Match the image path to your sync strategy:
        // 👉 Use this line if you kept the images in quartz/static/:
        const imgSrc = `${baseDir}/static/${cleanIconPath}`
        
        // 👉 Use this line instead if you decide to move them back to content/:
        // const imgSrc = `${baseDir}/${cleanIconPath}`

        // 4. Use resolveRelative so the card click URLs never break on local or live links
        const cardLink = resolveRelative(fileData.slug!, file.slug!)

        return (
          <a href={cardLink} className="card-item" key={file.slug}>
            <div className="card-image-container">
              <img src={imgSrc} alt={file.frontmatter?.title} />
            </div>
            <div className="card-caption">
              <h3>{file.frontmatter?.title}</h3>
            </div>
          </a>
        )
      })}
    </div>
  )
}

export default (() => CardGrid) satisfies QuartzComponentConstructor