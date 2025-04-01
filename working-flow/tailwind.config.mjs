/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'neon-purple': '#b026ff',
        'dark': '#0a0a0a',
        'customColor': 'rgb(27, 17, 34)',
        'customcolor2': 'rgb(13, 8, 17)',
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'typing': 'typing 3.5s steps(40, end)',
        'fadeIn': 'fadeIn 0.5s ease-out forwards',
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
      },
    },
  },
  plugins: [],
}