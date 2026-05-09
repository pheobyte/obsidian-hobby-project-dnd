import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

export default ((userOpts?: any) => {
  const PublicAssets: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    const fm = fileData.frontmatter
    if (!fm) return null

    const prepImgs = (val: any) => {
      if (!val) return []
      return Array.isArray(val) ? val : [val]
    }

    const officialGallery = prepImgs(fm.official_gallery)
    const personalGallery = prepImgs(fm.personal_gallery)

    if (officialGallery.length === 0 && personalGallery.length === 0) return null

    const boxWidth = 300
    const boxHeight = 450

    return (
      <div class={classNames(displayClass, "public-assets-container")}>
        <style dangerouslySetInnerHTML={{ __html: `
          .pub-asset-grid { 
            display: grid; 
            grid-template-columns: ${boxWidth}px 1fr; 
            gap: 30px; 
            width: 100%; 
            margin-top: 30px;
            border-top: 1px solid var(--lightgray);
            padding-top: 20px;
          }
          
          /* OFFICIAL GALLERY - FORCE TOP-FLUSH */
          .carousel-box { 
            width: ${boxWidth}px; 
            height: ${boxHeight}px; 
            overflow: hidden; 
            border-radius: 12px; 
            background: #000; 
            position: relative;
            display: block !important;
          }
          
          .carousel-track { 
            display: flex; 
            width: max-content; 
            height: 100%; 
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .carousel-item { 
            width: ${boxWidth}px !important; 
            height: ${boxHeight}px !important; 
            min-height: 100% !important;
            object-fit: cover !important; 
            object-position: top center !important; 
            display: block !important;
            margin: 0 !important;
          }

          @keyframes snap_pub { 
            0% { transform: translateX(0); } 
            100% { transform: translateX(-${officialGallery.length * boxWidth}px); } 
          }

          /* MY COLLECTION - FORCE SCROLLBAR */
          .personal-scroll { 
            display: flex !important; 
            overflow-x: scroll !important; 
            overflow-y: hidden !important;
            gap: 15px; 
            height: ${boxHeight + 40}px !important; /* Extra room for scrollbar */
            padding-bottom: 20px !important;
            width: 100%;
            -webkit-overflow-scrolling: touch;
          }
          
          /* Force scrollbar visibility for Chrome/Safari */
          .personal-scroll::-webkit-scrollbar {
            height: 12px !important;
            display: block !important;
          }
          .personal-scroll::-webkit-scrollbar-track {
            background: var(--lightgray) !important;
            border-radius: 10px;
          }
          .personal-scroll::-webkit-scrollbar-thumb {
            background: var(--secondary) !important;
            border-radius: 10px;
            border: 2px solid var(--lightgray);
          }

          .personal-img { 
            height: ${boxHeight}px !important; 
            border-radius: 8px; 
            object-fit: contain; 
            background: #1a1a1a;
            flex-shrink: 0;
          }
        `}} />

        <div class="pub-asset-grid">
          <div class="asset-col">
            <div style="font-weight:bold; color:var(--gray); text-transform:uppercase; font-size:0.7em; margin-bottom:10px;">Official Gallery</div>
            <div class="carousel-box">
              {officialGallery.length > 0 ? (
                <div 
                  class="carousel-track" 
                  style={{ 
                    animation: `snap_pub ${officialGallery.length * 5}s steps(${officialGallery.length}) infinite` 
                  }}
                >
                  {officialGallery.map((u) => (
                    <img src={u} class="carousel-item" />
                  ))}
                </div>
              ) : (
                <div style={{ color: "gray", padding: "20px", textAlign: "center" }}>No Reference Image</div>
              )}
            </div>
          </div>

          <div class="asset-col">
            <div style="font-weight:bold; color:var(--gray); text-transform:uppercase; font-size:0.7em; margin-bottom:10px;">My Collection</div>
            <div class="personal-scroll">
              {personalGallery.map((u) => (
                <img src={u} class="personal-img" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return PublicAssets
}) satisfies QuartzComponentConstructor