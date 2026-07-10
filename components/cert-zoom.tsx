"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Tilt } from "@/components/tilt";

interface CertZoomProps {
  /** Full-size certificate image shown in the enlarged window */
  src: string;
  /** Certification name shown in the details section */
  title: string;
  /** Provider / issuer shown in the chrome bar and details section */
  description: string;
  children: ReactNode;
  className?: string;
}

/**
 * Click-to-enlarge lightbox for certification cards. The enlarged view keeps
 * the card's window chrome — the traffic lights become functional (red/yellow
 * close, accent toggles expand) — tilts toward the cursor like the grid cards,
 * and lists the cert name and provider below the image. Rendered through a
 * portal to <body> so transformed ancestors can't trap the fixed positioning.
 */
export function CertZoom({ src, title, description, children, className = "" }: CertZoomProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
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

  const close = () => {
    setOpen(false);
    setExpanded(false);
  };

  return (
    <>
      <span
        role="button"
        tabIndex={0}
        aria-label={`Enlarge certificate: ${title}`}
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
            aria-label={title}
            onClick={close}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-background/90 p-4 backdrop-blur-sm sm:p-8"
          >
            <Tilt
              max={5}
              scale={1.01}
              className={`group w-full transition-[max-width] duration-300 ${
                expanded ? "max-w-[92vw]" : "max-w-3xl"
              }`}
            >
              <article
                onClick={(e) => e.stopPropagation()}
                className="relative flex max-h-[90vh] cursor-default flex-col overflow-hidden rounded-xl border border-border bg-background shadow-[0_0_60px_-10px_rgb(var(--accent)/0.4)]"
              >
                {/* Cursor-following glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), rgb(var(--accent) / 0.12), transparent 70%)",
                  }}
                />

                {/* Window chrome — same traffic lights as the card, now functional */}
                <div className="relative z-20 flex items-center gap-1.5 border-b border-border px-4 py-3">
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={close}
                    className="h-3 w-3 rounded-full bg-red-400/70 transition-colors hover:bg-red-400"
                  />
                  <button
                    type="button"
                    aria-label="Minimize"
                    onClick={close}
                    className="h-3 w-3 rounded-full bg-yellow-400/70 transition-colors hover:bg-yellow-400"
                  />
                  <button
                    type="button"
                    aria-label={expanded ? "Restore size" : "Expand"}
                    onClick={() => setExpanded((v) => !v)}
                    className="h-3 w-3 rounded-full bg-accent/80 transition-colors hover:bg-accent"
                  />
                  <span className="ml-2 truncate font-mono text-xs text-muted-foreground">
                    {description}
                  </span>
                  <span className="ml-auto shrink-0 font-mono text-xs text-muted-foreground">
                    esc ✕
                  </span>
                </div>

                {/* Enlarged certificate */}
                <div className="relative min-h-0 flex-1 bg-muted/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={title}
                    className={`mx-auto w-auto max-w-full object-contain p-4 transition-[max-height] duration-300 ${
                      expanded ? "max-h-[68vh]" : "max-h-[55vh]"
                    }`}
                  />
                </div>

                {/* Details below the certificate */}
                <div className="border-t border-border p-4">
                  <p className="mb-2 font-mono text-xs text-muted-foreground">
                    <span className="text-accent">$</span> cat details.txt
                  </p>
                  <h2 className="font-mono text-lg font-bold leading-snug text-foreground">
                    {title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </div>
              </article>
            </Tilt>
          </div>,
          document.body
        )}
    </>
  );
}
