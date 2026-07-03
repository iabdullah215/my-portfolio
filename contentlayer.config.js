import { defineDocumentType, makeSource } from "contentlayer2/source-files"
import rehypePrettyCode from "rehype-pretty-code"

/** @type {import('rehype-pretty-code').Options} */
const prettyCodeOptions = {
  // Dual themes: emits --shiki-light / --shiki-dark vars consumed in globals.css
  theme: {
    light: "github-light",
    dark: "github-dark-dimmed",
  },
  // We paint the <pre> background ourselves with theme tokens
  keepBackground: false,
}

/**
 * GitHub-style slug from heading text. Shared by the rehype plugin (element
 * ids) and the `headings` computed field (TOC data) so anchors always match.
 */
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function hastText(node) {
  if (node.type === "text") return node.value
  return (node.children ?? []).map(hastText).join("")
}

/**
 * Tiny dependency-free rehype plugin: gives h2–h4 an id and appends a
 * hover-revealed `#` anchor link (styled via .heading-anchor in globals.css).
 */
function rehypeHeadingAnchors() {
  return (tree) => {
    const seen = new Map()

    const visit = (node) => {
      if (node.type === "element" && /^h[2-4]$/.test(node.tagName)) {
        let slug = slugify(hastText(node))
        const count = seen.get(slug) ?? 0
        seen.set(slug, count + 1)
        if (count > 0) slug = `${slug}-${count}`

        node.properties = { ...node.properties, id: slug }
        node.children = [
          ...node.children,
          {
            type: "element",
            tagName: "a",
            properties: {
              href: `#${slug}`,
              className: ["heading-anchor"],
              ariaLabel: "Link to this section",
            },
            children: [{ type: "text", value: "#" }],
          },
        ]
      }
      ;(node.children ?? []).forEach(visit)
    }

    visit(tree)
  }
}

/**
 * Pull h2–h4 headings out of the raw MDX (skipping fenced code) for the
 * table of contents. Mirrors the id assignment in rehypeHeadingAnchors,
 * including duplicate-slug numbering.
 */
function extractHeadings(raw) {
  const headings = []
  const seen = new Map()
  let inFence = false

  for (const line of raw.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const match = line.match(/^(#{2,4})\s+(.+?)\s*#*\s*$/)
    if (!match) continue

    const text = match[2]
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1") // links/images → label
      .replace(/[`*_~]/g, "")
      .trim()

    let slug = slugify(text)
    const count = seen.get(slug) ?? 0
    seen.set(slug, count + 1)
    if (count > 0) slug = `${slug}-${count}`

    headings.push({ level: match[1].length, text, slug })
  }

  return headings
}

/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
  slug: {
    type: "string",
    resolve: (doc) => `/${doc._raw.flattenedPath}`,
  },
  slugAsParams: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
  },
}

export const Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: `pages/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
    },
  },
  computedFields,
}))

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `posts/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
    },
    date: {
      type: "date",
      required: true,
    },
    tags: {
      type: "list",
      of: { type: "string" },
    },
    category: {
      type: "string",
    },
    series: {
      type: "string",
    },
    seriesPart: {
      type: "number",
    },
  },
  computedFields: {
    ...computedFields,
    headings: {
      type: "json",
      resolve: (doc) => extractHeadings(doc.body.raw),
    },
  },
}))

export default makeSource({
  contentDirPath: "./content",
  documentTypes: [Post, Page],
  mdx: {
    rehypePlugins: [rehypeHeadingAnchors, [rehypePrettyCode, prettyCodeOptions]],
  },
})
