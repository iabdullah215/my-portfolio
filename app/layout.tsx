import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { BootTerminal } from "@/components/boot-terminal";
import { BinaryRain } from "@/components/binary-rain";
import { Brand } from "@/components/brand";
import { Nav } from "@/components/nav";
import { ModeToggle } from "@/components/mode-toggle";
import { allPosts } from "contentlayer/generated";
import {
  CommandPalette,
  CommandPaletteTrigger,
  type PaletteBlogPost,
} from "@/components/command-palette";
import { ConsoleEgg } from "@/components/console-egg";
import { Footer } from "@/components/footer";
import { ScrollTop } from "@/components/scroll-top";
import { Analytics } from "@/components/analytics";
import { AnalyticsEvents } from "@/components/analytics-events";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const siteUrl = "https://iabdullah.vercel.app";
const siteDescription =
  "Offensive security, red teaming, and CTF writeups — the blog and portfolio of Hwat Sauce.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hwat Sauce",
    template: "%s — Hwat Sauce",
  },
  description: siteDescription,
  openGraph: {
    title: "Hwat Sauce",
    description: siteDescription,
    url: siteUrl,
    siteName: "Hwat Sauce",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hwat Sauce",
    description: siteDescription,
    creator: "@iabdullah_215",
  },
  alternates: {
    types: { "application/rss+xml": "/rss.xml" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

// Lean index for the command palette: only serializable metadata crosses the
// client boundary, never the compiled MDX bodies.
const palettePosts: PaletteBlogPost[] = allPosts.map((post) => ({
  id: post._id,
  title: post.title,
  slug: post.slug,
  slugAsParams: post.slugAsParams,
  date: post.date,
  description: post.description,
  category: post.category,
  tags: post.tags,
}));

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${mono.variable}`}
    >
      <body className="antialiased min-h-screen bg-background font-sans text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {/* Fake terminal boot intro — plays once per session, then powers
              off with a CRT collapse to reveal the site underneath */}
          <BootTerminal />
          {/* Global binary-rain background — sits behind everything on every
              route, never intercepts clicks, persists across navigation */}
          <BinaryRain className="fixed inset-0 -z-10 opacity-40 pointer-events-none" />
          <div className="max-w-5xl mx-auto py-10 px-4">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:relative focus:z-50 focus:mb-4 focus:inline-block focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-foreground"
            >
              Skip to content
            </a>
            {/* Sticky glass header — stays visible with a blur panel so the
                binary rain scrolls beneath it */}
            <header className="sticky top-3 z-40 mb-10 flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-background/75 px-4 py-3 shadow-lg shadow-black/5 backdrop-blur-md">
              <Brand />
              <div className="flex items-center gap-2 sm:gap-3">
                <Nav />
                <CommandPaletteTrigger />
                <ModeToggle />
              </div>
            </header>

            {/* Each route owns its own width/typography: reading pages opt into
                'prose' with a centered measure, while listing/grid pages fill
                the wider shell. */}
            <main id="main-content">
              {children}
            </main>

            <Footer />
          </div>
          <CommandPalette posts={palettePosts} />
          <ConsoleEgg />
          <ScrollTop />
          <Analytics />
          <AnalyticsEvents />
        </ThemeProvider>
      </body>
    </html>
  );
}
