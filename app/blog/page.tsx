'use client';

import { allPosts } from "@/.contentlayer/generated";
import Link from "next/link";
import { useState } from "react";
import { track } from "@vercel/analytics";

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const allTags = Array.from(
    new Set(
      allPosts.flatMap((post) => post.tags ?? []).map((tag) => tag.trim())
    )
  ).filter(Boolean)
   .sort((a, b) => a.localeCompare(b));

  const allCategories = Array.from(
    new Set(
      allPosts
        .map((post) => post.category?.trim())
        .filter((category): category is string => Boolean(category))
    )
  ).sort((a, b) => a.localeCompare(b));

  const filteredPosts = allPosts.filter((post) =>
    (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.description &&
        post.description.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (selectedTag === "All" || (post.tags ?? []).includes(selectedTag)) &&
    (selectedCategory === "All" || post.category === selectedCategory)
  );

  const sortedPosts = filteredPosts.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="prose dark:prose-invert">
      <h1 className="text-3xl font-bold mt-4 mb-2 pt-6">Blogs</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        Collection of my thoughts on various topics
      </p>
      <form
        className="mb-4"
        onSubmit={(event) => {
          event.preventDefault();
          track("blog_search", {
            query: searchTerm,
            results: sortedPosts.length,
            tag: selectedTag,
            category: selectedCategory,
          });
        }}
      >
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </form>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
        <label className="text-sm font-medium">
          Category
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="ml-2 p-2 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="All">All</option>
            {allCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium">
          Tag
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="ml-2 p-2 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="All">All</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>
      </div>

      {sortedPosts.map((post, index) => (
        <div key={post._id} className="pt-6">
          <article className="grid grid-cols-3 gap-6 items-center py-4">
            <div className="text-gray-600 dark:text-gray-300 col-span-1">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="col-span-2">
              <Link href={post.slug}>
                <h2 className="text-xl font-bold">{post.title}</h2>
              </Link>
              {post.description && <p>{post.description}</p>}
              {(post.category || (post.tags && post.tags.length > 0)) && (
                <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-700 dark:text-gray-300">
                  {post.category && (
                    <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
                      {post.category}
                    </span>
                  )}
                  {(post.tags ?? []).map((tag) => (
                    <span
                      key={`${post._id}-${tag}`}
                      className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
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