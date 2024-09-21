module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            // Style for inline code (` `code``)
            code: {
              backgroundColor: '#f5f5f5', // light gray
              color: '#3a3b3c',  // dark text
              padding: '0.2em 0.4em',
              borderRadius: '0.3em',
              fontWeight: '500', // Customize font-weight if needed
            },
            // Style for block code (````python``` or ````mdx````)
            pre: {
              backgroundColor: '#f5f5f5', // light gray background
              color: '#3a3b3c', // dark text color
              padding: '1rem',
              borderRadius: '0.5rem',
              overflowX: 'auto', // Allow horizontal scrolling for long code blocks
            },
            'pre code': {
              backgroundColor: 'transparent', // Remove extra background in block code
              padding: 0,
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
