import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const IdentityTable: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const fm = fileData.frontmatter
  if (!fm) return null

  // Helpers to match your script's logic
  const renderList = (val: any) => {
    if (!val || (Array.isArray(val) && val.length === 0)) return "-"
    return (Array.isArray(val) ? val : [val]).map(v => <span class="tech-value">{v}</span>)
  }

  const name = fm.name || fileData.slug?.split('/').pop() || "Unnamed"
  const tags = (fm.tags as string[]) || []

  return (
    <div class={classNames(displayClass, "identity-container")}>
      <table class="pub-table">
        <colgroup>
          <col style="width: 25%;" />
          <col style="width: 75%;" />
        </colgroup>
        <thead>
          <tr>
            <th>Identity</th>
            <th>Technical Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div class="vertical-cell">
                <div class="identity-name">{name}</div>
                <div class="tag-container">
                  {tags.map(t => <span class="tag-pill">#{t}</span>)}
                </div>
              </div>
            </td>
            <td>
              <div class="vertical-cell tech-container">
                <div class="qty-header">
                   <span class="qty-label">COLLECTION QTY</span>
                   <span class="qty-badge">{fm.qty || 0}</span>
                </div>
                
                {fm.is_nsfw && <div class="nsfw-banner">NSFW VERSION</div>}
                
                <span class="tech-label">Race / Class</span>
                <span class="tech-value">{fm.race || "-"} / {fm.class || "-"}</span>
                
                <span class="tech-label">Scale/Size</span>
                {renderList(fm.sizes)}
                
                <span class="tech-label">Weapons</span>
                {renderList(fm.weapons)}
                
                <span class="tech-label">Categories</span>
                {renderList(fm.categories)}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

IdentityTable.css = `
.identity-container { margin-top: 2rem; }
.pub-table { width: 100%; border-collapse: collapse; table-layout: fixed; border: 1px solid var(--lightgray); }
.pub-table th, .pub-table td { border: 1px solid var(--lightgray); padding: 15px; vertical-align: top; }
.pub-table th { background: var(--lightgray); text-align: left; font-size: 0.8rem; text-transform: uppercase; color: var(--gray); }

.vertical-cell { display: flex; flex-direction: column; gap: 12px; justify-content: flex-start; }
.identity-name { font-weight: bold; font-size: 1.2em; color: var(--tertiary); line-height: 1.2; }

.tag-container { 
  display: flex; 
  flex-direction: column; /* This forces the one-under-the-other look */
  gap: 8px; 
  align-items: flex-start; /* Keeps them aligned to the left */
}

.tag-pill { 
  background: var(--secondary); /* Switched to a bolder background color */
  border: 1px solid var(--tertiary); 
  color: var(--light); /* High contrast text color */
  padding: 4px 10px; 
  border-radius: 4px; 
  font-size: 0.8rem; 
  font-weight: 600; /* Makes the text pop more */
  width: fit-content;
  white-space: nowrap;
}

.tech-container { font-size: 0.85em; }
.tech-label { font-weight: bold; color: var(--gray); text-transform: uppercase; font-size: 0.7em; display: block; margin-top: 10px; border-bottom: 1px solid var(--lightgray); margin-bottom: 4px; }
.tech-value { display: block; padding-left: 6px; border-left: 2px solid var(--tertiary); margin-bottom: 3px; }

.qty-header { 
  background: var(--lightgray); 
  /* Changed from 100% to fit-content to stop the stretching */
  width: fit-content; 
  /* Gives it a consistent base size so it doesn't look too cramped */
  min-width: 150px; 
  padding: 6px 10px; 
  border-radius: 6px; 
  display: flex; 
  /* Gap helps space out the text and the number */
  gap: 20px; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 5px; 
  box-sizing: border-box; 
}
.qty-label { font-size: 0.7em; font-weight: bold; color: var(--gray); }
.qty-badge { background: var(--tertiary); color: white !important; padding: 2px 10px; border-radius: 4px; font-weight: bold; font-size: 0.9em; }

.nsfw-banner { background: #b30000; color: white; font-weight: 800; font-size: 0.75em; text-align: center; padding: 6px; border-radius: 6px; margin-bottom: 5px; text-transform: uppercase; }
`

export default (() => IdentityTable) satisfies QuartzComponentConstructor