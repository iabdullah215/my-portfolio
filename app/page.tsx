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
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-8 pt-6">Blogs</h1>

      {/* Blog posts */}
      {sortedPosts.map((post, index) => (
        <div key={post._id} className="pt-6">
          <article className="grid grid-cols-3 gap-6 items-center py-4">
            <div className="text-gray-500 dark:text-gray-400 col-span-1">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div className="col-span-2">
              <Link href={post.slug}>
                <h2 className="text-xl font-bold">{post.title}</h2>
              </Link>
              {post.description && <p>{post.description}</p>}
            </div>
          </article>
          {index < sortedPosts.length - 1 && (
            <hr className="border-t border-gray-300 dark:border-gray-700 my-4" />
          )}
        </div>
      ))}
    </div>
  );
}
