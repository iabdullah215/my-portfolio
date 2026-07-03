"use client";

import { useEffect, useState } from "react";

interface TypewriterProps {
  phrases: string[];
  className?: string;
  /** ms per character while typing */
  typingSpeed?: number;
  /** ms per character while deleting */
  deletingSpeed?: number;
  /** ms to hold a fully typed phrase */
  pause?: number;
}

/**
 * Types, holds, deletes, and cycles through phrases with a blinking block
 * caret. Under prefers-reduced-motion it renders the first phrase statically.
 */
export function Typewriter({
  phrases,
  className = "",
  typingSpeed = 70,
  deletingSpeed = 40,
  pause = 2000,
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
    );
  }, []);

  useEffect(() => {
    if (reduced || phrases.length === 0) return;
    const phrase = phrases[index % phrases.length];

    if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % phrases.length);
      return;
    }

    const timeout = window.setTimeout(
      () => {
        if (!deleting && text === phrase) {
          setDeleting(true);
        } else {
          setText(phrase.slice(0, text.length + (deleting ? -1 : 1)));
        }
      },
      !deleting && text === phrase ? pause : deleting ? deletingSpeed : typingSpeed
    );

    return () => window.clearTimeout(timeout);
  }, [text, deleting, index, phrases, reduced, typingSpeed, deletingSpeed, pause]);

  return (
    <span className={className} aria-label={phrases.join(", ")}>
      {reduced ? phrases[0] : text}
      <span className="typewriter-caret" aria-hidden="true" />
    </span>
  );
}
