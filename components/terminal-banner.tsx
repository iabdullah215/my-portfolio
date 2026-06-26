interface TerminalBannerProps {
  /** The command shown after the prompt, e.g. "cat post.mdx" */
  command: string;
  /** Filename/label shown in the window title bar */
  label?: string;
  /** Optional second line, e.g. the page/post description */
  subtitle?: string;
}

/**
 * A theme-sensitive decorative banner styled as a terminal window.
 * Uses only CSS variables (foreground / accent / border), so it adapts
 * automatically between light and dark. Replaces the old static cover images.
 */
export function TerminalBanner({ command, label = "bash", subtitle }: TerminalBannerProps) {
  return (
    <div className="not-prose relative mb-8 overflow-hidden rounded-xl border border-border bg-muted/40">
      {/* Faint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      {/* Accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full"
        style={{
          background: "radial-gradient(circle, rgb(var(--accent) / 0.35), transparent 70%)",
        }}
      />

      <div className="relative">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
          <span className="ml-2 truncate font-mono text-xs text-muted-foreground">
            {label}
          </span>
        </div>

        {/* Faux terminal output */}
        <div className="px-5 py-7 font-mono text-sm">
          <p className="text-foreground">
            <span className="text-accent">$</span> {command}
          </p>
          {subtitle && <p className="mt-1.5 text-muted-foreground">{subtitle}</p>}
          <p className="mt-1.5 text-muted-foreground">
            <span className="text-accent">❯</span>
            <span className="ml-1 inline-block w-2 animate-pulse text-accent">_</span>
          </p>
        </div>
      </div>
    </div>
  );
}
