"use client";

import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";

/**
 * Full-screen "boot" intro: a fake terminal where hwatsauce@MNM lists the home
 * directory, cd's into hwat-portfolio, and "starts the dev server". Once the
 * server reports ready it powers off with a CRT-style collapse, revealing the
 * real portfolio underneath.
 *
 * Plays only on a visitor's first ever visit (persisted in localStorage, so it
 * never replays on refresh, in new tabs, or on return visits), is skippable
 * (any key / click), and is skipped entirely for prefers-reduced-motion. The
 * overlay is present in the SSR HTML so returning/reduced-motion visitors never
 * see a content flash — a layout effect hides it before the browser paints when
 * it shouldn't run.
 */

const STORAGE_KEY = "hwat-boot-shown";
const HOME_PATH = "~";
const PROJECT_PATH = "~/hwat-portfolio";
const SERVER_URL = "https://iabdullah.vercel.app";

// SSR and client must render an identical layout effect; useLayoutEffect warns
// during server render, so fall back to useEffect where window is absent.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Braille spinner frames for the "build" steps.
const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

// localStorage can throw (Safari private mode, storage disabled). Never let that
// crash the pre-paint effect: on a read error assume "not seen" (show the intro
// once), and swallow write errors so the sequence still finishes cleanly.
function hasSeenBoot(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markBootSeen(): void {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* storage unavailable — the intro simply replays next load */
  }
}

function Prompt({ path }: { path: string }) {
  return (
    <>
      <span className="text-emerald-400">hwatsauce@MNM</span>
      <span className="text-zinc-500">:</span>
      <span className="text-sky-400">{path}</span>
      <span className="text-zinc-500">$ </span>
    </>
  );
}

export function BootTerminal() {
  const [show, setShow] = useState(true);
  const [closing, setClosing] = useState(false);
  const [lines, setLines] = useState<ReactNode[]>([]);
  const [typing, setTyping] = useState<{ path: string; text: string } | null>(
    null
  );
  const [started, setStarted] = useState(false);
  // A single in-progress "build" line (spinner) rendered below the log.
  const [status, setStatus] = useState<ReactNode | null>(null);

  useIsoLayoutEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Hide before paint for anyone who shouldn't watch the intro.
    if (reduced || hasSeenBoot()) {
      setShow(false);
      return;
    }

    // Per-mount cancellation. React StrictMode double-invokes effects in dev,
    // so a shared ref would let a stale run resume (and double every line);
    // these locals keep each run's lifecycle isolated. `disposed` aborts the
    // sequence, `closed` de-dupes the power-off.
    let disposed = false;
    let closed = false;
    let safety = 0;
    document.documentElement.style.overflow = "hidden";
    setStarted(true);
    // Show the prompt immediately so the first frame isn't a blank screen.
    setTyping({ path: HOME_PATH, text: "" });

    // --- sequencing helpers -------------------------------------------------
    const sleep = (ms: number) =>
      new Promise<void>((res) => setTimeout(res, ms));
    const stop = () => disposed;

    const push = (node: ReactNode) =>
      setLines((prev) => [...prev, <Line key={prev.length}>{node}</Line>]);

    // Animate a spinner beside `working` for `ms`, then commit a permanent
    // "✓ done" line. Mimics a real build step compiling.
    const step = async (working: string, done: ReactNode, ms: number) => {
      const start = Date.now();
      let frame = 0;
      while (Date.now() - start < ms) {
        if (stop()) {
          setStatus(null);
          return;
        }
        const f = SPINNER[frame++ % SPINNER.length];
        setStatus(<span className="text-amber-400">{`${f} ${working}`}</span>);
        await sleep(80);
      }
      setStatus(null);
      if (stop()) return;
      push(
        <span>
          <span className="text-emerald-400">✓</span> {done}
        </span>
      );
    };

    const typeCommand = async (path: string, text: string) => {
      setTyping({ path, text: "" });
      for (let i = 1; i <= text.length; i++) {
        if (stop()) return;
        setTyping({ path, text: text.slice(0, i) });
        await sleep(38 + Math.random() * 55);
      }
      await sleep(260);
      if (stop()) return;
      push(
        <>
          <Prompt path={path} />
          {text}
        </>
      );
      setTyping(null);
    };

    const run = async () => {
      await sleep(600);
      if (stop()) return;

      await typeCommand(HOME_PATH, "ls");
      await sleep(220);
      push(
        <span>
          <span className="text-sky-400">Desktop</span>
          {"  "}
          <span className="text-sky-400">Documents</span>
          {"  "}
          <span className="text-sky-400">Downloads</span>
          {"  "}
          <span className="text-sky-400">Music</span>
          {"  "}
          <span className="text-sky-400">Pictures</span>
          {"  "}
          <span className="text-sky-400">Videos</span>
          {"  "}
          <span className="font-bold text-emerald-400">hwat-portfolio</span>
        </span>
      );
      await sleep(650);

      await typeCommand(HOME_PATH, "cd hwat-portfolio");
      await sleep(400);

      await typeCommand(PROJECT_PATH, "npm run dev");
      await sleep(550);
      push(<span className="text-zinc-500">&gt; hwat-portfolio@0.1.0 dev</span>);
      push(<span className="text-zinc-500">&gt; next dev</span>);
      await sleep(500);
      push(<span>&nbsp;</span>);
      push(
        <span className="font-bold text-emerald-400">▲ Next.js 14.2.35</span>
      );
      await sleep(450);
      await step("Loading dependencies…", "Dependencies loaded", 1100);
      await step("Setting things up…", "Environment ready", 950);
      await step(
        "Compiling /profile …",
        <>
          Compiled <span className="text-zinc-400">/profile</span> in{" "}
          <span className="text-zinc-400">1.2s</span>
        </>,
        1000
      );
      await sleep(450);
      push(
        <span>
          <span className="text-emerald-400">✓</span> Ready — server running on{" "}
          <span className="text-cyan-400 underline">{SERVER_URL}</span>
        </span>
      );
      await sleep(1150);
      if (stop()) return;
      close();
    };

    const close = () => {
      if (closed) return;
      closed = true;
      disposed = true;
      window.clearTimeout(safety);
      markBootSeen();
      setTyping(null);
      setStatus(null);
      setClosing(true);
      // Matches the crt-off animation duration in globals.css.
      window.setTimeout(() => {
        document.documentElement.style.overflow = "";
        setShow(false);
      }, 700);
    };

    const skip = () => close();

    window.addEventListener("keydown", skip);
    window.addEventListener("click", skip);

    // Safety net: never trap a visitor on the overlay if a timer or state
    // update stalls — force the power-off well after the scripted duration.
    safety = window.setTimeout(close, 12000);

    run();

    return () => {
      disposed = true;
      window.clearTimeout(safety);
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", skip);
      window.removeEventListener("click", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!show) return null;

  return (
    <div
      className={`boot-overlay fixed inset-0 z-[100] flex flex-col bg-[#0a0a0b] font-mono text-[13px] leading-relaxed text-zinc-200 sm:text-sm ${
        closing ? "boot-off" : ""
      }`}
      role="presentation"
      aria-hidden="true"
    >
      <div className="crt-scanlines pointer-events-none absolute inset-0" />
      <div className="relative flex-1 overflow-hidden px-4 py-5 sm:px-8 sm:py-8">
        {lines}
        {status ? <Line>{status}</Line> : null}
        {typing ? (
          <Line>
            <Prompt path={typing.path} />
            {typing.text}
            <span className="term-cursor" />
          </Line>
        ) : !started ? (
          <Line>
            <Prompt path={HOME_PATH} />
            <span className="term-cursor" />
          </Line>
        ) : null}
      </div>
      <div className="pointer-events-none absolute bottom-4 right-5 font-mono text-[11px] text-zinc-600">
        press any key to skip
      </div>
    </div>
  );
}

function Line({ children }: { children: ReactNode }) {
  return <div className="whitespace-pre-wrap break-words">{children}</div>;
}
