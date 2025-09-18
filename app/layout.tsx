import Link from "next/link";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@/components/analytics";

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
            <header>
              <div className="flex items-center justify-between">
                {/* Removed ModeToggle */}
                <nav className="ml-auto text-sm font-medium space-x-6">
                  <Link href="/">Blogs</Link>
                  <Link href="/about">About</Link>
                  <Link href="/cert">Certifications</Link>
                  <Link href="/profile">Profile</Link>
                </nav>
              </div>
            </header>
            
            {/* Add 'prose' for typography styling */}
            <main className="prose dark:prose-dark">
              {children}
            </main>
          </div>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
