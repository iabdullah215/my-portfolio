"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Header brand: the `hwat.sauce` wordmark with a small circular avatar to its
 * left. The avatar is hidden on the profile page (which already shows a large
 * portrait), so it only appears on every other route.
 */
export function Brand() {
  const pathname = usePathname();
  const onProfile = pathname.startsWith("/profile");

  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-accent"
    >
      {!onProfile && (
        <span className="relative inline-block h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-accent/60 ring-offset-2 ring-offset-background">
          <Image
            src="/static/images/mr.r0b0t.jpg"
            alt="Hwat Sauce avatar"
            fill
            sizes="28px"
            className="object-cover"
          />
        </span>
      )}
      <span>
        hwat<span className="text-accent">.</span>sauce
      </span>
    </Link>
  );
}
