import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { _simplifySlug } from "../util/path"

// Ensure the function is wrapped and exported exactly like this
const CardGrid: QuartzComponent = ({ allFiles, displayClass }: QuartzComponentProps) => {
  const galleryFiles = allFiles.filter((file) => 
    file.slug?.startsWith("MetaData_Public/") && file.frontmatter?.PUB_IMG_Icon
  )

  if (galleryFiles.length === 0) return null

  return (
    <div className={`card-grid ${displayClass ?? ""}`}>
      {galleryFiles.map((file) => (
        <a href={`./${file.slug}`} className="card-item" key={file.slug}>
          <div className="card-image-container">
            <img src={file.frontmatter?.PUB_IMG_Icon as string} alt={file.frontmatter?.title} />
          </div>
          <div className="card-caption">
            <h3>{file.frontmatter?.title}</h3>
          </div>
        </a>
      ))}
    </div>
  )
}

export default (() => CardGrid) satisfies QuartzComponentConstructor