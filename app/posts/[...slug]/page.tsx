import { notFound } from "next/navigation"
import Link from "next/link"
import { allPosts } from "contentlayer/generated"

import { Metadata } from "next"
import { Mdx } from "@/components/mdx-components"
import { TerminalBanner } from "@/components/terminal-banner"
import { ReadingProgress } from "@/components/reading-progress"
import { Toc, type TocHeading } from "@/components/toc"

interface PostProps {
  params: {
    slug: string[]
  }
}

async function getPostFromParams(params: PostProps["params"]) {
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
  const post = await getPostFromParams(params)

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

export async function generateStaticParams(): Promise<PostProps["params"][]> {
  return allPosts.map((post) => ({
    slug: post.slugAsParams.split("/"),
  }))
}

export default async function PostPage({ params }: PostProps) {
  const post = await getPostFromParams(params)

  if (!post) {
    notFound()
  }

  const words = post.body.raw.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 200))
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

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

  return (
    <article className="py-6 prose mx-auto max-w-[46rem]">
      <ReadingProgress />
      <Toc headings={(post.headings ?? []) as TocHeading[]} />
      <TerminalBanner
        label={`~/posts/${post.slugAsParams}.mdx`}
        command={`cat ${post.slugAsParams}.mdx`}
      />

      <div className="not-prose mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
        <span>
          <span className="text-accent">$</span> date → {formattedDate}
        </span>
        <span aria-hidden>·</span>
        <span>{minutes} min read</span>
        <span aria-hidden>·</span>
        <span>{words.toLocaleString("en-US")} words</span>
      </div>

      {seriesPosts.length > 1 && (
        <div className="not-prose mb-6 rounded-lg border border-accent/30 bg-accent/5 p-4">
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
                    {" "} {i + 1}. {p.title}
                  </Link>
                </li>
              )
            )}
          </ol>
        </div>
      )}

      <h1 className="mb-2">{post.title}</h1>
      {post.description && (
        <p className="text-xl mt-0 text-muted-foreground">
          {post.description}
        </p>
      )}
      <hr className="my-4" />
      <Mdx code={post.body.code} />

      <div className="not-prose mt-12 space-y-4 border-t border-border pt-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {olderPost ? (
            <Link
              href={olderPost.slug}
              className="group rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:border-accent/60"
            >
              <p className="font-mono text-xs text-muted-foreground">
                <span className="text-accent">$</span> cd ../previous
              </p>
              <p className="mt-1 truncate font-mono text-sm text-foreground transition-colors group-hover:text-accent">
                ← {olderPost.title}
              </p>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {newerPost && (
            <Link
              href={newerPost.slug}
              className="group rounded-lg border border-border bg-muted/30 p-4 text-left transition-colors hover:border-accent/60 sm:text-right"
            >
              <p className="font-mono text-xs text-muted-foreground">
                <span className="text-accent">$</span> cd ../next
              </p>
              <p className="mt-1 truncate font-mono text-sm text-foreground transition-colors group-hover:text-accent">
                {newerPost.title} →
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
    </article>
  )
}
