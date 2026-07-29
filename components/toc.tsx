"use client";

import { useEffect, useState } from "react";

export interface TocHeading {
  level: number;
  text: string;
  slug: string;
}

interface TocProps {
  headings: TocHeading[];
}

/**
 * Floating table of contents for blog posts. Renders in the empty right
 * margin on xl: screens only; tracks the reading position with an
 * IntersectionObserver and highlights the active section in the accent color.
 */
export function Toc({ headings }: TocProps) {
  const [activeSlug, setActiveSlug] = useState<string>("");
  // Hide the TOC once the footer scrolls into view so the two never overlap
  // at the bottom of long posts.
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { rootMargin: "0px 0px -32px 0px" }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Highlight the first (topmost) visible heading; when none are in
        // the band, keep the last active one so the highlight never flickers.
        for (const h of headings) {
          if (visible.has(h.slug)) {
            setActiveSlug(h.slug);
            return;
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    const observed: Element[] = [];
    for (const h of headings) {
      const el = document.getElementById(h.slug);
      if (el) {
        observer.observe(el);
        observed.push(el);
      }
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav
      aria-label="Table of contents"
      className={`fixed left-[calc(50%+24rem)] top-32 hidden max-h-[calc(100vh-10rem)] w-60 flex-col transition-opacity duration-300 xl:flex ${
        footerVisible ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <p className="mb-3 shrink-0 font-mono text-xs text-muted-foreground">
        <span className="text-accent">$</span> grep &quot;^#&quot; post.mdx
      </p>
      <ul className="min-h-0 space-y-1 overflow-y-auto overscroll-contain border-l border-border [scrollbar-width:thin]">
        {headings.map((h) => (
          <li key={h.slug}>
            <a
              href={`#${h.slug}`}
              className={`-ml-px block border-l py-0.5 pr-2 font-mono text-xs leading-relaxed transition-colors ${
                h.level === 3 ? "pl-6" : h.level === 4 ? "pl-9" : "pl-3"
              } ${
                activeSlug === h.slug
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
