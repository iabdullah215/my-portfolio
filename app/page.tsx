'use client';

import { allPosts } from "@/.contentlayer/generated";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter posts based on the search term
  const filteredPosts = allPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.description && post.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort posts by date in descending order (newest first)
  const sortedPosts = filteredPosts.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="prose dark:prose-invert">
      {/* Heading */}
      <h1 className="text-3xl font-bold mt-4 mb-2 pt-6">Blogs</h1>
      {/* Description below the heading */}
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
        Collection of my thoughts on various topics
      </p>
      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

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
