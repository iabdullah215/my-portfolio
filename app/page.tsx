import { allPosts } from "@/.contentlayer/generated"
import Link from "next/link"

export default function Home() {
  // Sort posts by date in descending order (newest first)
  const sortedPosts = allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="prose dark:prose-invert">
      {sortedPosts.map((post) => (
        <article key={post._id}>
          <Link href={post.slug}>
            <h2>{post.title}</h2>
          </Link>
          {post.description && <p>{post.description}</p>}
        </article>
      ))}
    </div>
  )
}
