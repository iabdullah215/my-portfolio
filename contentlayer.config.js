import { defineDocumentType, makeSource } from "contentlayer/source-files"
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
  },
  computedFields,
}))

export default makeSource({
  contentDirPath: "./content",
  documentTypes: [Post, Page],
  mdx: {
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
  },
})
