/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [  function ({ addUtilities }) {
      addUtilities({
        '.hide-scrollbar': {
          /* Hide scrollbar for Chrome, Safari, and Opera */
          'scrollbar-width': 'none', /* Firefox */
          '-ms-overflow-style': 'none', /* IE and Edge */
          'overflow': 'auto',
          'padding-right': '15px' /* Optional: if you need to compensate for the hidden scrollbar */
        },
        '.hide-scrollbar::-webkit-scrollbar': {
          'display': 'none'
        }
      });
    }],
}