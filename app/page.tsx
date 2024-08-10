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
      {sortedPosts.map((post, index) => (
        <div key={post._id}>
          <article className="flex justify-between items-start py-4">
            <div className="text-gray-500 dark:text-gray-400">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div className="ml-6">
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
