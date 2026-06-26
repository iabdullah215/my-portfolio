import Link from "next/link";
import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Nav } from "@/components/nav";
import { ModeToggle } from "@/components/mode-toggle";
import { Analytics } from "@/components/analytics";
import { AnalyticsEvents } from "@/components/analytics-events";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = {
  title: "Hwat Sauce",
  description: "My Blog/Portfolio Website",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${mono.variable}`}
    >
      <body className="antialiased min-h-screen bg-background font-sans text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="max-w-2xl mx-auto py-10 px-4">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:mb-4 focus:inline-block focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-foreground"
            >
              Skip to content
            </a>
            <header className="mb-10 flex items-center justify-between gap-4">
              <Link
                href="/"
                className="font-mono text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-accent"
              >
                hwat<span className="text-accent">.</span>sauce
              </Link>
              <div className="flex items-center gap-5">
                <Nav />
                <ModeToggle />
              </div>
            </header>

            {/* 'prose' applies token-driven typography styling */}
            <main id="main-content" className="prose">
              {children}
            </main>
          </div>
          <Analytics />
          <AnalyticsEvents />
        </ThemeProvider>
      </body>
    </html>
  );
}
