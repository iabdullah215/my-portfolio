"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

/** Custom event so any component (e.g. the header trigger) can open us */
const OPEN_EVENT = "open-cmdk";

/**
 * Lean post index passed down from the server layout — importing allPosts
 * here would ship every compiled MDX body in the client bundle of every page.
 */
export interface PaletteBlogPost {
  id: string;
  title: string;
  slug: string;
  slugAsParams: string;
  date: string;
  description?: string;
  category?: string;
  tags?: string[];
}

interface Item {
  id: string;
  kind: "post" | "page" | "cmd";
  label: string;
  hint?: string;
  keywords: string;
  run: () => void;
}

/**
 * Substring match scores highest (earlier = better), then in-order
 * subsequence (tighter = better). -1 means no match.
 */
function fuzzyScore(query: string, text: string): number {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (!q) return 0;

  const idx = t.indexOf(q);
  if (idx >= 0) return 1000 - idx;

  let ti = 0;
  let gaps = 0;
  for (const ch of q) {
    const found = t.indexOf(ch, ti);
    if (found === -1) return -1;
    gaps += found - ti;
    ti = found + 1;
  }
  return 500 - gaps;
}

/** Header button that opens the palette (also serves touch devices) */
export function CommandPaletteTrigger() {
  return (
    <button
      type="button"
      aria-label="Open terminal (Ctrl+K or `)"
      title="Terminal — Ctrl+K or `"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className="flex h-8 items-center justify-center rounded-md border border-border px-2 font-mono text-xs text-muted-foreground transition-all hover:border-accent hover:text-accent hover:shadow-[0_0_12px_-2px_rgb(var(--accent)/0.5)] active:scale-90"
    >
      &gt;_
    </button>
  );
}

export function CommandPalette({ posts }: { posts: PaletteBlogPost[] }) {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelected(0);
  }, []);

  const print = useCallback((...out: string[]) => {
    setLines((prev) => [...prev, ...out].slice(-40));
    setQuery("");
  }, []);

  // Global shortcuts: Ctrl/Cmd+K or ` open, Escape closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "`" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape" && open) {
        close();
      }
    };

    const onOpenEvent = () => setOpen(true);

    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpenEvent);
    };
  }, [open, close]);

  // Focus input and lock body scroll while open
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const items = useMemo<Item[]>(() => {
    const go = (href: string) => () => {
      close();
      router.push(href);
    };

    const commands: Item[] = [
      {
        id: "cmd-help",
        kind: "cmd",
        label: "help",
        hint: "list available commands",
        keywords: "help man ?",
        run: () =>
          print(
            "available commands:",
            "  ls posts          list every post",
            "  open <query>      fuzzy-open a post",
            "  cd blog|cert|about|~   navigate",
            "  theme dark|light  switch color scheme",
            "  whoami            about the operator",
            "  clear             clear terminal",
            "  exit              close terminal",
            "…or just type to search posts."
          ),
      },
      {
        id: "cmd-whoami",
        kind: "cmd",
        label: "whoami",
        hint: "about the operator",
        keywords: "whoami who about me",
        run: () =>
          print(
            "hwat.sauce — Muhammad Abdullah",
            "offensive security · red team · ctf player",
            "appsec @ ABHI — from the shadows, I control."
          ),
      },
      {
        id: "cmd-ls",
        kind: "cmd",
        label: "ls posts",
        hint: `${posts.length} entries`,
        keywords: "ls list posts dir",
        run: () =>
          print(
            ...posts
              .slice()
              .sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((p) => `  ${p.slugAsParams}.mdx`),
            "type `open <name>` to read one."
          ),
      },
      {
        id: "cmd-cd-home",
        kind: "cmd",
        label: "cd ~",
        hint: "go to profile",
        keywords: "cd ~ home profile root",
        run: go("/profile"),
      },
      {
        id: "cmd-cd-blog",
        kind: "cmd",
        label: "cd blog",
        hint: "go to the blog",
        keywords: "cd blog blogs posts",
        run: go("/blog"),
      },
      {
        id: "cmd-cd-cert",
        kind: "cmd",
        label: "cd cert",
        hint: "go to certifications",
        keywords: "cd cert certs certifications",
        run: go("/cert"),
      },
      {
        id: "cmd-cd-about",
        kind: "cmd",
        label: "cd about",
        hint: "go to about",
        keywords: "cd about",
        run: go("/about"),
      },
      {
        id: "cmd-theme-dark",
        kind: "cmd",
        label: "theme dark",
        hint: "lights out",
        keywords: "theme dark night",
        run: () => {
          setTheme("dark");
          print("theme set to dark.");
        },
      },
      {
        id: "cmd-theme-light",
        kind: "cmd",
        label: "theme light",
        hint: "flashbang",
        keywords: "theme light day toggle",
        run: () => {
          setTheme("light");
          print("theme set to light.");
        },
      },
      {
        id: "cmd-clear",
        kind: "cmd",
        label: "clear",
        hint: "clear terminal output",
        keywords: "clear cls reset",
        run: () => {
          setLines([]);
          setQuery("");
        },
      },
      {
        id: "cmd-exit",
        kind: "cmd",
        label: "exit",
        hint: "close terminal",
        keywords: "exit quit close logout",
        run: close,
      },
    ];

    const postItems: Item[] = posts
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((p) => ({
        id: p.id,
        kind: "post" as const,
        label: p.title,
        hint: new Date(p.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        }),
        keywords: `${p.title} ${p.slugAsParams} ${p.category ?? ""} ${(
          p.tags ?? []
        ).join(" ")} ${p.description ?? ""}`,
        run: go(p.slug),
      }));

    // `open <query>` narrows to posts only
    const openMatch = query.match(/^open\s+(.*)$/i);
    const effectiveQuery = (openMatch ? openMatch[1] : query).trim();
    const pool = openMatch ? postItems : [...commands, ...postItems];

    if (!effectiveQuery) {
      return openMatch
        ? postItems
        : [...commands.slice(0, 4), ...postItems.slice(0, 5)];
    }

    return pool
      .map((item) => ({ item, score: fuzzyScore(effectiveQuery, item.keywords) }))
      .filter(({ score }) => score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map(({ item }) => item);
  }, [query, posts, close, print, router, setTheme]);

  // Keep selection valid and visible as the list changes
  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${selected}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => (items.length ? (s + 1) % items.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => (items.length ? (s - 1 + items.length) % items.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (items[selected]) {
        items[selected].run();
      } else if (query.trim()) {
        print(`bash: ${query.trim().split(/\s+/)[0]}: command not found`);
      }
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-background/60 px-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-background shadow-[0_20px_70px_-15px_rgb(var(--accent)/0.35)]">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
          <span className="ml-2 truncate font-mono text-xs text-muted-foreground">
            hwat.sauce — terminal ({resolvedTheme ?? "dark"})
          </span>
        </div>

        {/* Output history (help / whoami / ls) */}
        {lines.length > 0 && (
          <div className="max-h-44 overflow-y-auto border-b border-border px-4 py-3 font-mono text-xs leading-relaxed text-muted-foreground">
            {lines.map((line, i) => (
              <p key={i} className="whitespace-pre-wrap">
                {line}
              </p>
            ))}
          </div>
        )}

        {/* Prompt */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3 font-mono text-sm">
          <span className="shrink-0 text-accent">$</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="type a command or search…"
            aria-label="Command input"
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>

        {/* Results */}
        <ul
          ref={listRef}
          className="max-h-72 overflow-y-auto py-2"
          role="listbox"
        >
          {items.length === 0 && (
            <li className="px-4 py-2 font-mono text-xs text-muted-foreground">
              bash: no match — press Enter anyway for the full effect.
            </li>
          )}
          {items.map((item, i) => (
            <li key={item.id} data-index={i} role="option" aria-selected={i === selected}>
              <button
                type="button"
                onClick={item.run}
                onMouseMove={() => setSelected(i)}
                className={`flex w-full items-center gap-3 px-4 py-2 text-left font-mono text-sm transition-colors ${
                  i === selected
                    ? "bg-accent/10 text-accent"
                    : "text-foreground hover:bg-muted/60"
                }`}
              >
                <span
                  className={`w-10 shrink-0 text-[10px] uppercase ${
                    i === selected ? "text-accent" : "text-muted-foreground"
                  }`}
                >
                  {item.kind}
                </span>
                <span className="truncate">{item.label}</span>
                {item.hint && (
                  <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                    {item.hint}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Footer hints */}
        <div className="flex items-center gap-4 border-t border-border bg-muted/40 px-4 py-2 font-mono text-[10px] text-muted-foreground">
          <span>↑↓ navigate</span>
          <span>↵ run</span>
          <span>esc exit</span>
          <span className="ml-auto">try: help</span>
        </div>
      </div>
    </div>
  );
}
