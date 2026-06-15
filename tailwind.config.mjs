// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          base:   '#080808',
          card:   '#121212',
          deep:   '#0a0a0a',
          footer: '#050505',
          nav:    '#0d0d0d',
        },
        accent: {
          lime: '#EDFE03',
          cyan: '#00D8FF',
        },
        content: {
          primary:   '#ffffff',
          body:      '#aaaaaa',
          secondary: '#888888',
          label:     '#aaaaaa',
          muted:     '#777777',
        },
        stroke: {
          card:   '#1e1e1e',
          subtle: '#1a1a1a',
        },
      },
      fontFamily: {
        heading: ['"Outfit Variable"', 'sans-serif'],
        body:    ['"Inter Variable"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
