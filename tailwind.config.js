/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#0A0F1A', // Very dark blue/black - primary background
        'brand-surface': '#131A2A', // Slightly lighter for cards/surfaces
        'brand-muted': '#8A94A6', // Muted text, borders
        'brand-primary': '#00E5FF', // Neon cyan/blue - primary accent
        'brand-secondary': '#FF00AA', // Neon pink/magenta - secondary accent
        'brand-text': '#E0E0E0', // Primary text color
        'brand-text-darker': '#B0B0B0', // Slightly darker text for less emphasis
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
