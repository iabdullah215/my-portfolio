/**
 * Terminal-flavored site footer: an echo'd copyright on the left and a
 * status LED on the right.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="not-prose mt-16 border-t border-border pb-4 pt-6 font-mono text-xs text-muted-foreground">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p>
          <span className="text-accent">$</span> echo &quot;© {year}{" "}
          hwat.sauce&quot;
        </p>
        <p className="flex items-center gap-3">
          <a
            href="/rss.xml"
            className="transition-colors hover:text-accent"
            title="RSS feed"
          >
            rss
          </a>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_rgb(var(--accent)/0.8)]" />
            all systems operational
          </span>
        </p>
      </div>
    </footer>
  );
}
