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
    <nav className="flex items-center gap-3 font-mono text-sm sm:gap-5">
      {links.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === "/" || pathname.startsWith("/profile")
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.label}
            href={link.href}
            className={`relative py-1 transition-colors hover:text-accent after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-accent after:transition-transform after:duration-300 ${
              isActive
                ? "text-accent after:scale-x-100"
                : "text-muted-foreground after:scale-x-0 hover:after:scale-x-100"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
