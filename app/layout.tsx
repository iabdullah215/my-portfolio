import Link from "next/link";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@/components/analytics";
import { AnalyticsEvents } from "@/components/analytics-events";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Hwat Sauce",
  description: "My Blog/Portfolio Website",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`antialiased min-h-screen bg-white text-slate-900 ${inter.className}`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div className="max-w-2xl mx-auto py-10 px-4">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:mb-4 focus:inline-block focus:rounded focus:bg-slate-900 focus:px-3 focus:py-2 focus:text-white"
            >
              Skip to content
            </a>
            <header>
              <div className="flex items-center justify-between">
                {/* Removed ModeToggle */}
                <nav className="ml-auto text-sm font-medium space-x-6">
                  <Link href="/blog">Blogs</Link>
                  <Link href="/about">About</Link>
                  <Link href="/cert">Certifications</Link>
                  <Link href="/">Profile</Link>
                </nav>
              </div>
            </header>
            
            {/* Add 'prose' for typography styling */}
            <main id="main-content" className="prose dark:prose-dark">
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
