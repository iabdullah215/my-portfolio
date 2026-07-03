'use client';

import { allPosts } from "@/.contentlayer/generated";
import Link from "next/link";
import { useState } from "react";
import { track } from "@vercel/analytics";
import { SpotlightCard } from "@/components/spotlight-card";
import { Reveal } from "@/components/reveal";

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

  const chipClass = (active: boolean) =>
    `rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
      active
        ? "border-accent/60 bg-accent/15 text-accent"
        : "border-border bg-muted/40 text-muted-foreground hover:border-accent/50 hover:text-accent"
    }`;

  return (
    <div className="prose">
      <h1 className="font-mono text-3xl font-bold mt-4 mb-2 pt-6">Blogs</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Collection of my thoughts on various topics
      </p>

      {/* Terminal-prompt search */}
      <form
        className="not-prose mb-4"
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
        <label className="flex items-center gap-2 rounded-lg border border-border bg-muted/60 px-3 py-2.5 font-mono text-sm transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-ring/40">
          <span className="shrink-0 text-accent">$</span>
          <span className="hidden shrink-0 text-muted-foreground sm:inline">
            grep -i
          </span>
          <input
            type="text"
            aria-label="Search posts"
            placeholder='"search posts..."'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
          />
        </label>
      </form>

      {/* Filter chips — rendered only once posts carry categories/tags */}
      {allCategories.length > 0 && (
        <div className="not-prose mb-3 flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            category:
          </span>
          {["All", ...allCategories].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={chipClass(selectedCategory === category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {allTags.length > 0 && (
        <div className="not-prose mb-3 flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">tag:</span>
          {["All", ...allTags].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={chipClass(selectedTag === tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <p className="not-prose mb-5 font-mono text-xs text-muted-foreground">
        <span className="text-accent">❯</span> {sortedPosts.length} of{" "}
        {allPosts.length} posts
      </p>

      <div className="not-prose space-y-5">
        {sortedPosts.length === 0 && (
          <p className="font-mono text-sm text-muted-foreground">
            <span className="text-accent">$</span> no posts matched your query.
          </p>
        )}

        {sortedPosts.map((post, index) => (
          <Reveal key={post._id} delay={Math.min(index, 4) * 70}>
            <SpotlightCard>
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
                  <div className="mb-2 flex items-center justify-between gap-3 font-mono text-xs text-muted-foreground">
                    <span>
                      <span className="text-accent">$</span>{" "}
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="shrink-0 -translate-x-2 text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                      cat →
                    </span>
                  </div>
                  <h2 className="font-mono text-xl font-bold text-foreground transition-colors group-hover:text-accent">
                    {post.title}
                  </h2>
                  {post.description && (
                    <p className="mt-1 text-muted-foreground">
                      {post.description}
                    </p>
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
          </Reveal>
        ))}
      </div>
    </div>
  );
}
