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
        'code-bg': '#f5f5f5',  // Light gray background for code blocks
        'code-text': '#333',   // Dark text color for code blocks
        'inline-code-bg': '#e0e0e0', // Light gray background for inline code
      },
      fontFamily: {
        'code': ['Source Code Pro', 'monospace'],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
