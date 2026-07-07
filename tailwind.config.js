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
        // Argon glows blue-violet in a discharge tube — that's the accent.
        'brand-dark': '#0B0E14', // page background
        'brand-surface': '#111521', // panels
        'brand-edge': '#222838', // 1px borders
        'brand-muted': '#6E7891', // secondary labels
        'brand-primary': '#96A7FF', // argon glow
        'brand-secondary': '#6D7FE0', // deeper glow (hover / fills)
        'brand-text': '#E8EBF2',
        'brand-text-darker': '#9AA3B5',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
};
