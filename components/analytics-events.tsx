"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

function isExternalHref(href: string, origin: string) {
  if (href.startsWith("mailto:") || href.startsWith("tel:")) {
    return true;
  }

  if (!href.startsWith("http://") && !href.startsWith("https://")) {
    return false;
  }

  try {
    const url = new URL(href);
    return url.origin !== origin;
  } catch {
    return false;
  }
}

export function AnalyticsEvents() {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");

      if (!anchor) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href) {
        return;
      }

      if (isExternalHref(href, window.location.origin)) {
        const text = anchor.textContent?.trim();
        const payload: Record<string, string> = { href };
        if (text) {
          payload.text = text;
        }
        track("outbound_link", payload);
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return null;
}
