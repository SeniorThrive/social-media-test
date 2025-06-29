/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    ringColor: ({ theme }) => ({
      ...theme('colors'),
    }),
    ringOffsetColor: ({ theme }) => ({
      ...theme('colors'),
    }),
    extend: {
      colors: {
        st_light_blue: '#3762D4',
        st_dark_blue: '#316AA2',
        st_light_orange: '#EF8A3F',
        st_light_purple: '#AE7CEC',
        st_dark_purple: '#5A2F52',
        st_taupe: '#796D64',
        st_dark_red: '#B24233',
        st_black: '#1A0D0A',
      },
      fontFamily: {
        'atkinson': ['Atkinson Hyperlegible', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'h1': ['1.75rem', { lineHeight: '1.4', fontWeight: '700' }], // Increased from 1.5rem
        'h2': ['1.375rem', { lineHeight: '1.4', fontWeight: '600' }], // Increased from 1.25rem
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }], // Improved line-height
        'caption': ['0.875rem', { lineHeight: '1.5', fontWeight: '500' }],
      },
      spacing: {
        'base': '8px',
      },
      borderRadius: {
        'card': '1rem',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}