"use client";

import { useEffect, useState } from "react";

/**
 * Thin accent progress bar fixed to the top of the viewport that tracks how
 * far down the page the reader has scrolled.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const total =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(1, window.scrollY / total) : 0);
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
  }, []);

  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-50 h-[3px]">
      <div
        className="h-full origin-left bg-gradient-to-r from-accent/70 to-accent shadow-[0_0_8px_rgb(var(--accent)/0.6)]"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
