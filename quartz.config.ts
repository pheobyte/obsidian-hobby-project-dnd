import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Obsidian Hobby Project D&D",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "pheobyte.github.io/obsidian-hobby-project-dnd",
    ignorePatterns: [
      // Hide all system/utility folders
      "__INTEGRITY_CHECKS",
      "__METADATA_JS_QUERIES",
      "__SCRIPTS",
      "__UTILITY",
      ".obsidian",
      
      // Hide the entire TEMPLATES folder and everything inside it
      "__TEMPLATES", 

      // Hide MetaData folders EXCEPT MetaData_Public
      "MetaData_PriceHistory",
      "MetaData_References",
      "MetaData_Shop",
      "Attachments", 

      // Hide the "View" files at the root
      "MetaData_PriceHistory View.md",
      "MetaData_PriceHistory View Unavailable.md",
      "MetaData_Shop_Duplicate Spotter.md",
      "MetaData_Shop_No Image_Icon.md",
      "MetaData_Shop_NoREF Bought Items.md",
      "MetaData_Shop Card Bought Items.md",
      "MetaData_Shop Card View.md",
      "MetaData_Shop Card View Large.md",
      "MetaData_Shop Table Bought Items.md",
      "MetaData_Shop Table View.md",
      "Reference_Master_Assets.md",
    ],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#faf8f8",
          lightgray: "#e5e5e5",
          gray: "#b8b8b8",
          darkgray: "#4e4e4e",
          dark: "#2b2b2b",
          secondary: "#284b63",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#161618",
          lightgray: "#393639",
          gray: "#646464",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          secondary: "#7b97aa",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#b3aa0288",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [
      Plugin.RemoveDrafts(),
     // Plugin.ExplicitPublish(), //IF ADDED: Only notes with "publish: true" will show up
    ],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config