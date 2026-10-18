"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { categoryGlyph } from "@/components/category-glyph";

export interface BlogListPost {
  id: string;
  slug: string;
  title: string;
  description?: string;
  date: string;
  category?: string;
  tags: string[];
  minutes: number;
}

/** Delay before a hovered row zooms, so sweeping the cursor past rows doesn't. */
const ENTER_DELAY = 60;
/** Grace period after the cursor leaves the list before the row zooms out. */
const LEAVE_DELAY = 160;

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Blog index: title rail on the left, category tabs + a toggleable search
 * panel (S key) over a list of compact rows. Hovering a row zooms it into
 * the featured layout (large tile, badges, big title, description) and the
 * other rows dim; it zooms back out when the cursor moves on. The zoom
 * itself is CSS (.blog-row in globals.css); this component only decides
 * which row is active.
 */
export function BlogList({ posts }: { posts: BlogListPost[] }) {
  const [category, setCategory] = useState("All");
  const [tag, setTag] = useState("All");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  const timer = useRef<ReturnType<typeof setTimeout>>();
  const canHover = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(posts.map((p) => p.category?.trim()).filter(Boolean) as string[])
      ).sort((a, b) => a.localeCompare(b)),
    [posts]
  );

  const tags = useMemo(
    () =>
      Array.from(new Set(posts.flatMap((p) => p.tags))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [posts]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (tag === "All" || p.tags.includes(tag)) &&
        (!q ||
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q))
    );
  }, [posts, category, tag, query]);

  const filtersActive = category !== "All" || tag !== "All" || query !== "";
  const latestId = posts[0]?.id;

  // Touch devices fire mouseenter on tap; only real pointers get the zoom.
  useEffect(() => {
    canHover.current = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    return () => clearTimeout(timer.current);
  }, []);

  // Row indexes shift when the filters change.
  useEffect(() => setActive(null), [category, tag, query]);

  // S toggles the search panel, unless the reader is typing somewhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing =
        t &&
        (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.toLowerCase() === "s") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const hoverRow = (i: number) => {
    if (!canHover.current) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setActive(i), ENTER_DELAY);
  };

  const leaveList = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setActive(null), LEAVE_DELAY);
  };

  const clearFilters = () => {
    setCategory("All");
    setTag("All");
    setQuery("");
  };

  return (
    <div className="post-shell">
      <div className="post-grid gap-y-10 pt-4 lg:pt-10">
        <header className="lg:sticky lg:top-24 lg:self-start">
          <h1 className="font-mono text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            Blogs
          </h1>
          <p className="mt-5 max-w-sm text-lg leading-relaxed text-muted-foreground">
            Collection of my thoughts on various topics
          </p>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {filtersActive
              ? `${filtered.length} of ${posts.length} posts`
              : `${posts.length} posts`}
            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                className="ml-3 uppercase text-accent hover:underline"
              >
                Clear
              </button>
            )}
          </p>
        </header>

        <section className="min-w-0" aria-label="Posts">
          <div className="flex items-center gap-6 border-b border-border pb-4 font-mono text-xs uppercase tracking-[0.12em]">
            <div className="flex min-w-0 flex-1 gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {["All", ...categories].map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={category === c}
                  onClick={() => setCategory(c)}
                  className={`shrink-0 whitespace-nowrap py-1 uppercase transition-colors ${
                    category === c
                      ? "text-foreground shadow-[inset_0_-1px_0_rgb(var(--accent))]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-expanded={searchOpen}
              aria-controls="blog-search"
              onClick={() => setSearchOpen((o) => !o)}
              className={`shrink-0 whitespace-nowrap py-1 uppercase transition-colors ${
                searchOpen || query ? "text-accent" : "text-foreground hover:text-accent"
              }`}
            >
              <span className="hidden text-muted-foreground sm:inline">[S] </span>
              Search
            </button>
          </div>

          <div
            id="blog-search"
            className={`grid transition-[grid-template-rows] duration-300 ${
              searchOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            {/* Visible at once on open (so the input can take focus), hidden
                only after the collapse on close (so it stays out of the tab
                order without cutting the animation short). */}
            <div
              className={`min-h-0 overflow-hidden ${
                searchOpen ? "visible" : "invisible transition-[visibility] duration-300"
              }`}
            >
              <form
                className="border-b border-border py-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  track("blog_search", {
                    query,
                    results: filtered.length,
                    tag,
                    category,
                  });
                }}
              >
                <label className="flex items-center gap-2 font-mono text-sm">
                  <span className="shrink-0 text-accent">$</span>
                  <span className="hidden shrink-0 text-muted-foreground sm:inline">
                    grep -i
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    aria-label="Search posts"
                    placeholder='"search posts..."'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setSearchOpen(false);
                    }}
                    className="w-full min-w-0 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </label>
                {tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["All", ...tags].map((t) => (
                      <button
                        key={t}
                        type="button"
                        aria-pressed={tag === t}
                        onClick={() => setTag(t)}
                        className={`border px-2 py-0.5 font-mono text-xs transition-colors ${
                          tag === t
                            ? "border-accent/60 bg-accent/10 text-accent"
                            : "border-border text-muted-foreground hover:border-accent/50 hover:text-foreground"
                        }`}
                      >
                        {t === "All" ? "all tags" : t}
                      </button>
                    ))}
                  </div>
                )}
              </form>
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="py-8 font-mono text-sm text-muted-foreground">
              <span className="text-accent">$</span> no posts matched your query.
            </p>
          ) : (
            <ul
              onMouseLeave={leaveList}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                  setActive(null);
                }
              }}
            >
              {filtered.map((post, i) => {
                const isActive = active === i;
                const date = formatDate(post.date);
                return (
                  <li key={post.id} className="border-b border-border">
                    <Link
                      href={post.slug}
                      data-active={isActive}
                      onMouseEnter={() => hoverRow(i)}
                      onFocus={(e) => {
                        // Keyboard focus zooms too; a click's focus doesn't.
                        if (e.currentTarget.matches(":focus-visible")) setActive(i);
                      }}
                      className={`blog-row grid grid-cols-[2.75rem_minmax(0,1fr)_auto] items-start gap-x-4 py-5 transition-opacity duration-300 sm:grid-cols-[11rem_minmax(0,1fr)_auto] sm:gap-x-8 ${
                        active !== null && !isActive ? "opacity-40" : ""
                      }`}
                    >
                      <div className="relative min-h-[2.75rem]">
                        <span
                          aria-hidden
                          className="blog-tile flex h-11 w-11 items-center justify-center border border-border font-mono text-sm font-bold text-muted-foreground"
                        >
                          {categoryGlyph(post.category)}
                        </span>
                        <span className="blog-date absolute left-[3.75rem] top-0 hidden h-11 items-center whitespace-nowrap font-mono text-sm text-muted-foreground sm:flex">
                          {date}
                        </span>
                      </div>

                      <div className="min-w-0">
                        {/* Compact and featured layouts are separate layers
                            that crossfade; text never re-wraps mid-zoom. */}
                        <div className="blog-compact">
                          <div>
                            <div className="blog-compact-inner">
                              <h2 className="pt-2 text-lg leading-7 text-foreground">
                                {post.title}
                              </h2>
                              <span className="mt-1 block font-mono text-xs text-muted-foreground sm:hidden">
                                {date}
                              </span>
                              {post.description && (
                                <span className="sr-only">{post.description}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="blog-featured" aria-hidden>
                          <div>
                            <div className="blog-featured-inner min-h-[8rem]">
                              <span className="flex flex-wrap gap-px font-mono text-xs">
                                {post.id === latestId && (
                                  <span className="bg-foreground px-2 py-1 text-background">
                                    Latest
                                  </span>
                                )}
                                {post.category && (
                                  <span className="border border-border px-2 py-[3px] text-muted-foreground">
                                    {post.category}
                                  </span>
                                )}
                                <span className="px-2 py-1 text-muted-foreground">{date}</span>
                              </span>
                              <span className="mt-3 block text-4xl font-medium leading-[1.15] tracking-tight text-foreground">
                                {post.title}
                              </span>
                              {post.description && (
                                <span className="line-clamp-2 pt-3 text-base leading-relaxed text-muted-foreground">
                                  {post.description}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <span className="whitespace-nowrap pt-2 font-mono text-sm text-muted-foreground">
                        {post.minutes}
                        <span className="sm:hidden"> min</span>
                        <span className="hidden sm:inline"> minutes</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
