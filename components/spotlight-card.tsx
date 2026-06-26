"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * A bordered card that lifts and glows on hover, with an emerald spotlight
 * that follows the cursor across its surface.
 */
export function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={`group relative overflow-hidden rounded-xl border border-border bg-muted/30 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_10px_40px_-12px_rgb(var(--accent)/0.45)] ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgb(var(--accent) / 0.14), transparent 70%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
