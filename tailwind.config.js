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
            code: {
              backgroundColor: '#f5f5f5',  // Light gray for inline code
              color: '#3a3b3c',  // Dark text color
              padding: '0.2em 0.4em',
              borderRadius: '0.3em',
            },
            pre: {
              backgroundColor: '#f5f5f5',  // Light gray for block code
              color: '#3a3b3c',  // Dark text color
              padding: '1rem',
              borderRadius: '0.5rem',
              overflowX: 'auto',  // Enable horizontal scrolling for long code lines
            },
            'pre code': {
              backgroundColor: 'transparent',  // Removes extra background in block code
              padding: 0,
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
