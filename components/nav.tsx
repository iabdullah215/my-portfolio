"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
  { href: "/", label: "Profile" },
  { href: "/about", label: "About" },
  { href: "/cert", label: "Certifications" },
  { href: "/contributions", label: "Contributions" },
  { href: "/blog", label: "Blogs" },
];

function isActive(href: string, pathname: string) {
  return href === "/"
    ? pathname === "/" || pathname.startsWith("/profile")
    : pathname.startsWith(href);
}

/**
 * Inline links from md: up. Below that the five links don't fit beside the
 * brand and buttons, so they collapse into a menu button whose panel drops
 * down from the (sticky, positioned) header.
 */
export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on navigation.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <>
      <nav className="hidden items-center gap-5 font-mono text-sm md:flex">
        {links.map((link) => {
          const active = isActive(link.href, pathname);
          return (
            <Link
              key={link.label}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`relative py-1 transition-colors hover:text-accent after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-accent after:transition-transform after:duration-300 ${
                active
                  ? "text-accent after:scale-x-100"
                  : "text-muted-foreground after:scale-x-0 hover:after:scale-x-100"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div ref={wrapRef} className="md:hidden">
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
          className={`flex h-8 items-center justify-center rounded-md border px-2 font-mono text-xs transition-all hover:border-accent hover:text-accent active:scale-90 ${
            open ? "border-accent text-accent" : "border-border text-muted-foreground"
          }`}
        >
          {open ? "[×]" : "[≡]"}
        </button>

        {open && (
          <nav
            id="mobile-nav"
            aria-label="Site"
            className="absolute inset-x-0 top-full mt-2 rounded-xl border border-border/80 bg-background p-2 font-mono text-sm shadow-lg shadow-black/10"
          >
            <ul>
              {links.map((link) => {
                const active = isActive(link.href, pathname);
                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2 rounded-md px-3 py-2.5 transition-colors hover:bg-muted hover:text-accent ${
                        active ? "text-accent" : "text-muted-foreground"
                      }`}
                    >
                      <span aria-hidden className={active ? "text-accent" : "text-muted-foreground/50"}>
                        {active ? "▸" : "└"}
                      </span>
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    </>
  );
}
