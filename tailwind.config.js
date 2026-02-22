/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: '#7a8c75',
          light: '#9aab96',
          dark: '#5a6b56',
        },
        gold: {
          DEFAULT: '#c9a84c',
          light: '#d4bc73',
          dark: '#b0912f',
        },
        cream: {
          DEFAULT: '#f5efe6',
          dark: '#e8ddd0',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        label: ['"Cinzel"', 'serif'],
        body: ['"Jost"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
