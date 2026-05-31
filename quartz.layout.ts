import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
//Custom import here:
import IdentityTable from "./quartz/components/IdentityTable"
import PublicAssets from "./quartz/components/PublicAssets"
import CardGrid from "./quartz/components/CardGrid"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    
    // Show technical details ONLY on individual notes, NOT index
    Component.ConditionalRender({
      component: IdentityTable(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: PublicAssets(),
      condition: (page) => page.fileData.slug !== "index",
    }),

    // Show the Card Gallery ONLY on the index page
    Component.ConditionalRender({
      component: CardGrid(),
      condition: (page) => page.fileData.slug === "index",
    }),
  ],
  left: [
    Component.PageTitle(),
    // 🛠️ UNLOCKED: Removed MobileOnly wrapper so the hamburger menu toggle loads on desktop
    Component.Spacer(),
    Component.Flex({
      components: [
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
  ],
}

// components for pages that display lists of pages (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    // 🛠️ UNLOCKED: Removed MobileOnly wrapper from list pages too for global design consistency
    Component.Spacer(),
    Component.Flex({
      components: [
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
}