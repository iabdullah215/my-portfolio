"use client";

import { useEffect, useState } from "react";

/**
 * Floating terminal-flavored back-to-top button. Hidden until the user has
 * scrolled a viewport or so down the page.
 */
export function ScrollTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-5 right-5 z-40 rounded-lg border border-border bg-background/80 px-3 py-2 font-mono text-xs text-muted-foreground shadow-lg backdrop-blur transition-all duration-300 hover:border-accent hover:text-accent ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <span className="text-accent">$</span> cd ~
    </button>
  );
}
