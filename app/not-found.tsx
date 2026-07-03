import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-prose flex min-h-[60vh] flex-col items-center justify-center py-16">
      <h1 className="sr-only">Page not found</h1>

      <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-muted/40 text-left shadow-[0_10px_40px_-12px_rgb(var(--accent)/0.25)]">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
          <span className="ml-2 truncate font-mono text-xs text-muted-foreground">
            bash — 404
          </span>
        </div>

        <div className="space-y-2 p-5 font-mono text-sm">
          <p className="text-foreground">
            <span className="text-accent">$</span> cd ./requested-page
          </p>
          <p className="text-red-400">
            bash: cd: no such file or directory <span aria-hidden>(404)</span>
          </p>
          <p className="text-foreground">
            <span className="text-accent">$</span>{" "}
            <Link
              href="/"
              className="text-accent underline-offset-4 transition-colors hover:underline"
            >
              cd ~/profile
            </Link>
            <span className="ml-1 inline-block w-2 animate-pulse text-accent">
              _
            </span>
          </p>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        The page you’re looking for doesn’t exist.
      </p>
    </div>
  );
}
