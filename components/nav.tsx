"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/blog", label: "Blogs" },
  { href: "/about", label: "About" },
  { href: "/cert", label: "Certifications" },
  { href: "/", label: "Profile" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-5 font-mono text-sm">
      {links.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === "/" || pathname.startsWith("/profile")
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.label}
            href={link.href}
            className={`transition-colors hover:text-accent ${
              isActive ? "text-accent" : "text-muted-foreground"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
