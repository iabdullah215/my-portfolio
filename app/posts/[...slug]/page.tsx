import { notFound } from "next/navigation"
import Link from "next/link"
import { allPosts } from "contentlayer/generated"

import { Metadata } from "next"
import { Mdx } from "@/components/mdx-components"
import { ReadingProgress } from "@/components/reading-progress"
import { PostSidebar, type TocHeading } from "@/components/post-sidebar"

type PostParams = {
  slug: string[]
}

// Next 15 hands `params` to pages and generateMetadata as a Promise.
interface PostProps {
  params: Promise<PostParams>
}

// Glyph shown in the hero tile, keyed by post category.
const categoryGlyphs: Record<string, string> = {
  "CTF Writeup": ">_",
  "Security Research": "{}",
  "Cert Review": "[✓]",
  Guide: "##",
}

async function getPostFromParams(params: PostParams) {
  const slug = params?.slug?.join("/")
  const post = allPosts.find((post) => post.slugAsParams === slug)

  if (!post) {
    null
  }

  return post
}

export async function generateMetadata({
  params,
}: PostProps): Promise<Metadata> {
  const post = await getPostFromParams(await params)

  if (!post) {
    return {}
  }

  const siteUrl = "https://iabdullah.vercel.app"
  const postUrl = `${siteUrl}/posts/${post.slugAsParams}`
  const ogImage = `/og/${post.slugAsParams}`

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: postUrl,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  }
}

export async function generateStaticParams(): Promise<PostParams[]> {
  return allPosts.map((post) => ({
    slug: post.slugAsParams.split("/"),
  }))
}

export default async function PostPage({ params }: PostProps) {
  const post = await getPostFromParams(await params)

  if (!post) {
    notFound()
  }

  const words = post.body.raw.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 200))
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  })
  const headings = (post.headings ?? []) as TocHeading[]
  const category = post.category ?? "Blog"

  // Prev/next by date (newest first)
  const sorted = [...allPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const currentIndex = sorted.findIndex((p) => p._id === post._id)
  const newerPost = currentIndex > 0 ? sorted[currentIndex - 1] : null
  const olderPost =
    currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null

  // Sibling posts in the same series, ordered by part
  const seriesPosts = post.series
    ? allPosts
        .filter((p) => p.series === post.series)
        .sort((a, b) => (a.seriesPart ?? 0) - (b.seriesPart ?? 0))
    : []

  const meta = [
    { label: "Author", value: "Hwat Sauce" },
    { label: "Category", value: category },
    { label: "Published", value: formattedDate },
  ]

  return (
    <article className="post-shell">
      {/* The sidebar carries its own progress bar on desktop */}
      <div className="lg:hidden">
        <ReadingProgress />
      </div>

      <header id="post-hero" className="post-grid pb-14 pt-4 lg:pb-20 lg:pt-10">
        <div className="lg:col-start-2">
          <div
            aria-hidden
            className="mb-8 flex h-16 w-16 items-center justify-center bg-accent font-mono text-xl font-bold text-accent-foreground sm:h-20 sm:w-20 sm:text-2xl"
          >
            {categoryGlyphs[category] ?? "#"}
          </div>
          <h1 className="max-w-[22ch] text-balance text-4xl [overflow-wrap:anywhere] font-medium leading-[1.12] tracking-tight text-foreground sm:text-5xl">
            {post.title}
          </h1>
          {post.description && (
            <p className="mt-6 max-w-[46rem] text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {post.description}
            </p>
          )}
          <dl className="mt-10 grid max-w-[46rem] grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {m.label}
                </dt>
                <dd className="mt-2 flex gap-2 text-foreground">
                  <span aria-hidden className="font-mono text-muted-foreground/50">
                    └
                  </span>
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="post-grid border-t border-border pt-12 lg:pt-16">
        <aside className="hidden lg:block">
          <PostSidebar
            title={post.title}
            headings={headings}
            minutes={minutes}
            path={post.slug}
            markdown={post.body.raw}
          />
        </aside>

        <div className="min-w-0 max-w-[46rem]">
          {headings.length > 1 && (
            <details className="group mb-10 border border-border bg-muted/30 px-4 py-3 font-mono text-sm lg:hidden">
              <summary className="cursor-pointer list-none text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <span className="mr-2 inline-block transition-transform group-open:rotate-90">
                  ▸
                </span>
                Tree · {minutes} min read
              </summary>
              <ul className="mt-3 space-y-1">
                {headings
                  .filter((h) => h.level === Math.min(...headings.map((x) => x.level)))
                  .map((h) => (
                    <li key={h.slug}>
                      <a
                        href={`#${h.slug}`}
                        className="flex gap-2 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <span aria-hidden className="text-muted-foreground/50">
                          └
                        </span>
                        {h.text}
                      </a>
                    </li>
                  ))}
              </ul>
            </details>
          )}

          {seriesPosts.length > 1 && (
            <div className="mb-10 border border-accent/30 bg-accent/5 p-4">
              <p className="font-mono text-xs text-accent">
                {"//"} {post.series} — part {post.seriesPart ?? "?"} of{" "}
                {seriesPosts.length}
              </p>
              <ol className="mt-2 space-y-1">
                {seriesPosts.map((p, i) =>
                  p._id === post._id ? (
                    <li key={p._id} className="font-mono text-sm text-foreground">
                      <span className="text-accent">▸</span> {i + 1}. {p.title}{" "}
                      <span className="text-muted-foreground">
                        (you are here)
                      </span>
                    </li>
                  ) : (
                    <li key={p._id} className="font-mono text-sm">
                      <Link
                        href={p.slug}
                        className="text-muted-foreground transition-colors hover:text-accent"
                      >
                        {" "} {i + 1}. {p.title}
                      </Link>
                    </li>
                  )
                )}
              </ol>
            </div>
          )}

          <div id="post-body" className="prose post-body">
            <Mdx code={post.body.code} />
          </div>

          <div className="mt-16 space-y-4 border-t border-border pt-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {olderPost ? (
                <Link
                  href={olderPost.slug}
                  className="group border border-border bg-muted/30 p-4 transition-colors hover:border-accent/60"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    ← Previous
                  </p>
                  <p className="mt-1 truncate text-sm text-foreground transition-colors group-hover:text-accent">
                    {olderPost.title}
                  </p>
                </Link>
              ) : (
                <span className="hidden sm:block" />
              )}
              {newerPost && (
                <Link
                  href={newerPost.slug}
                  className="group border border-border bg-muted/30 p-4 text-left transition-colors hover:border-accent/60 sm:text-right"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    Next →
                  </p>
                  <p className="mt-1 truncate text-sm text-foreground transition-colors group-hover:text-accent">
                    {newerPost.title}
                  </p>
                </Link>
              )}
            </div>

            <p className="text-center">
              <Link
                href="/blog"
                className="font-mono text-sm text-muted-foreground transition-colors hover:text-accent"
              >
                <span className="text-accent">$</span> cd ~/blog
              </Link>
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
