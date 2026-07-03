"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface ImageZoomProps {
  /** Full-size image source shown in the lightbox */
  src: string;
  alt?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Wraps any image in a click-to-zoom lightbox. The overlay is rendered
 * through a portal to <body> so transformed ancestors (e.g. Tilt cards)
 * can't trap the fixed positioning. Close via click, Escape, or the button.
 */
export function ImageZoom({ src, alt, children, className = "" }: ImageZoomProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <span
        role="button"
        tabIndex={0}
        aria-label={`Zoom image${alt ? `: ${alt}` : ""}`}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={`block cursor-zoom-in ${className}`}
      >
        {children}
      </span>

      {mounted &&
        open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={alt || "Zoomed image"}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] flex cursor-zoom-out items-center justify-center bg-background/90 p-4 backdrop-blur-sm sm:p-8"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt ?? ""}
              className="max-h-full max-w-full rounded-lg border border-border shadow-[0_0_60px_-10px_rgb(var(--accent)/0.4)]"
            />
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-md border border-border bg-background/80 px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-accent hover:text-accent"
            >
              esc ✕
            </button>
          </div>,
          document.body
        )}
    </>
  );
}
