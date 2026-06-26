/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            "--tw-prose-body": "rgb(var(--foreground))",
            "--tw-prose-headings": "rgb(var(--foreground))",
            "--tw-prose-lead": "rgb(var(--muted-foreground))",
            "--tw-prose-links": "rgb(var(--accent))",
            "--tw-prose-bold": "rgb(var(--foreground))",
            "--tw-prose-counters": "rgb(var(--muted-foreground))",
            "--tw-prose-bullets": "rgb(var(--border))",
            "--tw-prose-hr": "rgb(var(--border))",
            "--tw-prose-quotes": "rgb(var(--foreground))",
            "--tw-prose-quote-borders": "rgb(var(--accent))",
            "--tw-prose-captions": "rgb(var(--muted-foreground))",
            "--tw-prose-code": "rgb(var(--foreground))",
            "--tw-prose-pre-code": "rgb(var(--foreground))",
            "--tw-prose-pre-bg": "rgb(var(--muted))",
            "--tw-prose-th-borders": "rgb(var(--border))",
            "--tw-prose-td-borders": "rgb(var(--border))",
            "h1, h2, h3, h4": {
              fontFamily: "var(--font-mono)",
              letterSpacing: "-0.01em",
            },
            a: {
              fontWeight: "500",
              textDecoration: "none",
            },
            "a:hover": {
              textDecoration: "underline",
              textDecorationColor: "rgb(var(--accent))",
            },
            // Remove the backtick pseudo-elements the plugin adds to inline code
            "code::before": { content: '""' },
            "code::after": { content: '""' },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
