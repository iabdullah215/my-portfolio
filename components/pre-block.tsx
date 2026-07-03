"use client";

import { useRef, useState, type ComponentProps } from "react";

/**
 * Client wrapper for MDX <pre> blocks that adds a copy-to-clipboard button,
 * positioned up in the terminal-window header bar that globals.css draws on
 * the rehype-pretty-code fragment. The wrapper div carries the pre's
 * data-theme so CSS can hide the inactive dual-theme variant — pre and
 * button together — as one unit.
 */
export function PreBlock({ children, ...props }: ComponentProps<"pre">) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const theme = (props as Record<string, unknown>)["data-theme"] as
    | string
    | undefined;
  const language = (props as Record<string, unknown>)["data-language"] as
    | string
    | undefined;

  const handleCopy = async () => {
    const text = preRef.current?.innerText ?? "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable (permissions / insecure context) */
    }
  };

  return (
    <div className="relative" data-pre-theme={theme}>
      <pre ref={preRef} {...props}>
        {children}
      </pre>
      {/* Only fenced blocks processed by rehype-pretty-code get the header
          bar this sits in, and only those carry data-theme */}
      {theme && (
        <div className="absolute -top-8 right-3 flex items-center gap-2">
          {language && language !== "plaintext" && (
            <span className="font-mono text-[11px] text-muted-foreground">
              {language}
            </span>
          )}
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy code to clipboard"
            className="rounded border border-border bg-background/50 px-2 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-accent hover:text-accent"
          >
            {copied ? "copied ✓" : "copy"}
          </button>
        </div>
      )}
    </div>
  );
}
