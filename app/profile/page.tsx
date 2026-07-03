import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Tilt } from "@/components/tilt";
import { Typewriter } from "@/components/typewriter";

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/iabdullah215",
    path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/muhammad-abdullah-691a1026a/",
    path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
  },
  {
    label: "X (Twitter)",
    href: "https://twitter.com/iabdullah_215",
    path: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  },
  {
    label: "Medium",
    href: "https://medium.com/@iabdullah_215",
    path: "M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z",
  },
  {
    label: "Email",
    href: "mailto:abdullah.MnM@proton.me",
    path: "M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67zM22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z",
  },
];

/** Staggered entrance delay for the hero elements */
const enter = (ms: number) =>
  ({ "--enter-delay": `${ms}ms` } as CSSProperties);

const ProfilePage = () => {
  return (
    <section className="not-prose flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="animate-enter mb-8" style={enter(0)}>
        <Tilt max={16} scale={1.06}>
          <div className="relative h-44 w-44 overflow-hidden rounded-full ring-2 ring-accent/70 ring-offset-4 ring-offset-background shadow-[0_0_45px_-5px_rgb(var(--accent)/0.55)]">
            <Image
              src="/static/images/mr.r0b0t.jpg"
              alt="Hwat Sauce"
              fill
              sizes="176px"
              priority
              className="object-cover"
            />
          </div>
        </Tilt>
      </div>

      <div className="relative">
        {/* Soft scrim so text stays legible over the rain */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-12 -inset-y-8 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(var(--background)/0.88),transparent_75%)]"
        />

        <h1
          data-text="Hwat.Sauce"
          aria-label="Hwat Sauce"
          className="glitch animate-enter font-mono text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
          style={enter(80)}
        >
          Hwat<span className="text-accent">.</span>Sauce
        </h1>

        <p
          className="animate-enter mt-3 font-mono text-sm text-muted-foreground sm:text-base"
          style={enter(160)}
        >
          <span className="text-accent">~$</span> whoami{" "}
          <Typewriter
            phrases={[
              "Offensive Security",
              "Red Team Operator",
              "CTF Player",
              "AppSec Engineer",
            ]}
            className="text-foreground"
          />
        </p>

        {/* Availability status pill */}
        <div
          className="animate-enter mt-4 flex justify-center"
          style={enter(240)}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-xs text-accent transition-shadow hover:shadow-[0_0_18px_-4px_rgb(var(--accent)/0.6)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Available — AppSec @ ABHI
          </span>
        </div>

        <p
          className="animate-enter mt-4 font-mono text-sm text-muted-foreground"
          style={enter(320)}
        >
          <span className="text-accent">&gt;</span> From the shadows, I control.
        </p>

        {/* Primary calls-to-action */}
        <div
          className="animate-enter mt-7 flex flex-wrap items-center justify-center gap-3"
          style={enter(400)}
        >
          <Link
            href="/blog"
            className="rounded-md bg-accent px-4 py-2 font-mono text-sm font-medium text-accent-foreground transition-all hover:bg-accent/90 hover:shadow-[0_0_22px_-4px_rgb(var(--accent)/0.65)] active:scale-95"
          >
            Read the Blog →
          </Link>
          <Link
            href="/cert"
            className="rounded-md border border-border px-4 py-2 font-mono text-sm text-foreground transition-all hover:border-accent hover:bg-accent/10 hover:text-accent active:scale-95"
          >
            View Certifications →
          </Link>
          <a
            href="mailto:abdullah.MnM@proton.me"
            className="rounded-md border border-border px-4 py-2 font-mono text-sm text-foreground transition-all hover:border-accent hover:bg-accent/10 hover:text-accent active:scale-95"
          >
            Contact
          </a>
        </div>

        {/* Social links */}
        <div
          className="animate-enter mt-6 flex items-center justify-center gap-5"
          style={enter(480)}
        >
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={s.label}
              title={s.label}
              className="text-muted-foreground transition-all duration-200 hover:-translate-y-1 hover:text-accent hover:drop-shadow-[0_0_8px_rgb(var(--accent)/0.7)]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d={s.path} />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
