"use client";

import { useEffect, useMemo, useState } from "react";

export interface TocHeading {
  level: number;
  text: string;
  slug: string;
}

interface PostSidebarProps {
  title: string;
  headings: TocHeading[];
  minutes: number;
  /** Site-relative path of the post, e.g. /posts/foo */
  path: string;
  /** Raw MDX body, for the "Copy markdown" action */
  markdown: string;
}

/** Distance from the viewport top at which a heading counts as "reached". */
const ACTIVE_OFFSET = 140;
const BAR_CELLS = 26;

interface TreeGroup {
  heading: TocHeading;
  children: TocHeading[];
}

/**
 * Nest h3/h4 under their preceding h2. Headings that appear before the first
 * h2 (or posts with no h2 at all) become top-level entries.
 */
function groupHeadings(headings: TocHeading[]): TreeGroup[] {
  const top = Math.min(...headings.map((h) => h.level));
  const groups: TreeGroup[] = [];
  for (const h of headings) {
    if (h.level === top || groups.length === 0) {
      groups.push({ heading: h, children: [] });
    } else {
      groups[groups.length - 1].children.push(h);
    }
  }
  return groups;
}

/**
 * Sticky left rail for blog posts: the post title (once the hero scrolls
 * away), a `└`-style section tree that expands the active section, an ASCII
 * reading-progress bar, and share actions. Desktop only; the sticky box lives
 * inside the article grid so it stops before the footer on its own.
 */
export function PostSidebar({
  title,
  headings,
  minutes,
  path,
  markdown,
}: PostSidebarProps) {
  const [activeSlug, setActiveSlug] = useState("");
  const [progress, setProgress] = useState(0);
  const [heroHidden, setHeroHidden] = useState(false);

  const groups = useMemo(() => groupHeadings(headings), [headings]);

  useEffect(() => {
    const hero = document.getElementById("post-hero");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroHidden(!entry.isIntersecting),
      { rootMargin: "-96px 0px 0px 0px" }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;

      // Active section: the last heading whose top has passed the offset.
      // At the very bottom the final headings can never reach the offset, so
      // there any heading on screen counts.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      const line = atBottom ? window.innerHeight : ACTIVE_OFFSET;
      let current = "";
      for (const h of headings) {
        const el = document.getElementById(h.slug);
        if (el && el.getBoundingClientRect().top <= line) {
          current = h.slug;
        } else if (el) {
          break;
        }
      }
      setActiveSlug(current);

      // Progress through the article body, not the whole page.
      const body = document.getElementById("post-body");
      if (body) {
        const rect = body.getBoundingClientRect();
        const span = rect.height - window.innerHeight + ACTIVE_OFFSET;
        const read = ACTIVE_OFFSET - rect.top;
        setProgress(span > 0 ? Math.min(1, Math.max(0, read / span)) : 1);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  // Which top-level group the active heading belongs to.
  const activeGroup = groups.findIndex(
    (g) =>
      g.heading.slug === activeSlug ||
      g.children.some((c) => c.slug === activeSlug)
  );

  const percent = Math.round(progress * 100);
  const filled = Math.round(progress * BAR_CELLS);

  return (
    <div className="sticky top-24 flex h-[calc(100vh-7rem)] flex-col font-mono text-[0.8rem] leading-relaxed">
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ${
          heroHidden ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
        aria-hidden={!heroHidden}
      >
        <div className="overflow-hidden">
          <a
            href="#post-hero"
            tabIndex={heroHidden ? 0 : -1}
            className="mb-6 block font-sans text-base font-medium leading-snug text-foreground transition-colors hover:text-accent"
          >
            {title}
          </a>
        </div>
      </div>

      {groups.length > 0 && (
        <nav aria-label="Table of contents" className="flex min-h-0 flex-col">
          <p className="mb-3 shrink-0 text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Tree
          </p>
          <ul className="min-h-0 space-y-1 overflow-y-auto overscroll-contain pr-2 [scrollbar-width:thin]">
            {groups.map((g, i) => (
              <li key={g.heading.slug}>
                <TreeLink heading={g.heading} active={activeSlug === g.heading.slug} />
                {i === activeGroup && g.children.length > 0 && (
                  <ul className="mt-1 space-y-1 pl-6">
                    {g.children.map((c) => (
                      <li
                        key={c.slug}
                        className={c.level > g.heading.level + 1 ? "pl-6" : ""}
                      >
                        <TreeLink heading={c} active={activeSlug === c.slug} />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="mt-8 shrink-0 text-xs text-muted-foreground">
        <div className="flex items-center gap-3" aria-label={`${percent}% read`}>
          <span aria-hidden className="select-none whitespace-nowrap tracking-[-0.12em]">
            <span className="text-foreground">{"▓".repeat(filled)}</span>
            <span className="text-muted-foreground/40">
              {"░".repeat(BAR_CELLS - filled)}
            </span>
          </span>
          <span className="tabular-nums">{String(percent).padStart(2, "0")}%</span>
        </div>
        <p className="mt-4 uppercase tracking-[0.12em]">{minutes} min read</p>
      </div>

      <ShareLinks title={title} path={path} markdown={markdown} />
    </div>
  );
}

function TreeLink({ heading, active }: { heading: TocHeading; active: boolean }) {
  return (
    <a
      href={`#${heading.slug}`}
      aria-current={active ? "location" : undefined}
      className={`group flex gap-2 transition-colors ${
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <span
        aria-hidden
        className={`shrink-0 ${active ? "text-accent" : "text-muted-foreground/50"}`}
      >
        └
      </span>
      <span>{heading.text}</span>
    </a>
  );
}

function ShareLinks({
  title,
  path,
  markdown,
}: {
  title: string;
  path: string;
  markdown: string;
}) {
  const [copied, setCopied] = useState<"url" | "md" | null>(null);
  const [url, setUrl] = useState(`https://iabdullah.vercel.app${path}`);

  // Prefer the real origin (preview deployments, localhost) once mounted.
  useEffect(() => setUrl(`${window.location.origin}${path}`), [path]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(null), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async (kind: "url" | "md") => {
    const text = kind === "url" ? url : `# ${title}\n\n${markdown.trim()}\n`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
    } catch {
      // Clipboard can be blocked (insecure context, permissions); fail quietly.
    }
  };

  const enc = encodeURIComponent;
  const links = [
    { label: "X.com", href: `https://x.com/intent/post?text=${enc(title)}&url=${enc(url)}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { label: "Email", href: `mailto:?subject=${enc(title)}&body=${enc(url)}` },
  ];

  const itemClass =
    "flex gap-2 text-muted-foreground transition-colors hover:text-foreground";

  return (
    <div className="mt-auto shrink-0 pt-8">
      <p className="mb-3 text-xs uppercase tracking-[0.12em] text-muted-foreground">
        Share
      </p>
      <ul className="space-y-1">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.label === "Email" ? undefined : "_blank"}
              rel="noopener noreferrer"
              className={itemClass}
            >
              <span aria-hidden className="text-muted-foreground/50">└</span>
              {l.label}
            </a>
          </li>
        ))}
        <li>
          <button type="button" onClick={() => copy("url")} className={itemClass}>
            <span aria-hidden className="text-muted-foreground/50">└</span>
            {copied === "url" ? <span className="text-accent">Copied URL</span> : "Copy URL"}
          </button>
        </li>
        <li>
          <button type="button" onClick={() => copy("md")} className={itemClass}>
            <span aria-hidden className="text-muted-foreground/50">└</span>
            {copied === "md" ? (
              <span className="text-accent">Copied markdown</span>
            ) : (
              "Copy markdown"
            )}
          </button>
        </li>
      </ul>
    </div>
  );
}
