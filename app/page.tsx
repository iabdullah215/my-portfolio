import { allPosts } from "@/.contentlayer/generated";
import Link from "next/link";

export default function Home() {
  // Sort posts by date in descending order (newest first)
  const sortedPosts = allPosts.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    return dateB.getTime() - dateA.getTime();
  });

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
  );
}
