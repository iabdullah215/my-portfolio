"use client";

import { useEffect } from "react";

let printed = false;

const BANNER = String.raw`
██╗  ██╗██╗    ██╗ █████╗ ████████╗
██║  ██║██║    ██║██╔══██╗╚══██╔══╝
███████║██║ █╗ ██║███████║   ██║
██╔══██║██║███╗██║██╔══██║   ██║
██║  ██║╚███╔███╔╝██║  ██║   ██║ .sauce
╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝
`;

/**
 * Classic hacker-portfolio console Easter egg. Prints once per page load
 * lifecycle, not per navigation.
 */
export function ConsoleEgg() {
  useEffect(() => {
    if (printed) return;
    printed = true;

    console.log(
      `%c${BANNER}`,
      "color: #34d399; font-family: monospace; font-size: 11px;"
    );
    console.log(
      "%c$ whoami%c\noffensive security · red team · ctf player",
      "color: #34d399; font-family: monospace;",
      "color: inherit; font-family: monospace;"
    );
    console.log(
      "%cSnooping around the console? Good instinct. Tip: press Ctrl+K (or `) for the terminal.\n→ github.com/iabdullah215 · muhammadabdullah8040@gmail.com",
      "color: #a1a1aa; font-family: monospace;"
    );
  }, []);

  return null;
}
