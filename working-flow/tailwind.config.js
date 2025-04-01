/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',  // Add this line
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-purple': '#b026ff',
        'dark': '#0a0a0a',
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'typing': 'typing 3.5s steps(40, end)',
        'fadeIn': 'fadeIn 0.5s ease-out forwards',
        'blink': 'blink 1.5s infinite', // Add the custom blink animation here
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%': { opacity: '.1' },
          '20%': { opacity: '1' },
          '100%': { opacity: '.1' },
        },
      },
      spacing: {
        'dot-width': '10px', // Add dot width for styling purposes
      },
    },
  },
  plugins: [],
}
