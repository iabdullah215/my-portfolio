'use client';

import { allPosts } from "@/.contentlayer/generated";
import Link from "next/link";
import { useState } from "react";
import { track } from "@vercel/analytics";
import { SpotlightCard } from "@/components/spotlight-card";

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
    <div className="prose">
      <h1 className="font-mono text-3xl font-bold mt-4 mb-2 pt-6">Blogs</h1>
      <p className="text-lg text-muted-foreground mb-6">
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
          className="w-full p-2 rounded border border-border bg-muted text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-ring/40"
        />
      </form>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
        <label className="text-sm font-medium">
          Category
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="ml-2 p-2 rounded border border-border bg-muted text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-ring/40"
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
            className="ml-2 p-2 rounded border border-border bg-muted text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-ring/40"
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

      <div className="not-prose space-y-5">
        {sortedPosts.length === 0 && (
          <p className="font-mono text-sm text-muted-foreground">
            <span className="text-accent">$</span> no posts matched your query.
          </p>
        )}

        {sortedPosts.map((post) => (
          <SpotlightCard key={post._id}>
            <Link href={post.slug} className="block no-underline">
              {/* Window chrome with filename */}
              <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
                <span className="ml-2 truncate font-mono text-xs text-muted-foreground">
                  ~{post.slug}.mdx
                </span>
              </div>

              <div className="p-5">
                <div className="mb-2 font-mono text-xs text-muted-foreground">
                  <span className="text-accent">$</span>{" "}
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <h2 className="font-mono text-xl font-bold text-foreground transition-colors group-hover:text-accent">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="mt-1 text-muted-foreground">{post.description}</p>
                )}
                {(post.category || (post.tags && post.tags.length > 0)) && (
                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    {post.category && (
                      <span className="rounded border border-accent/30 bg-accent/10 px-2 py-1 text-accent">
                        {post.category}
                      </span>
                    )}
                    {(post.tags ?? []).map((tag) => (
                      <span
                        key={`${post._id}-${tag}`}
                        className="rounded border border-border bg-muted px-2 py-1 text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
}