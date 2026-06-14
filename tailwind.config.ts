import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/renderer/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f3fbf2',
          100: '#dff2da',
          200: '#c0e3bb',
          300: '#96cc90',
          400: '#6bb164',
          500: '#4d9447',
          600: '#3c7637',
          700: '#2f5d2b',
          800: '#264a22',
          900: '#1e3d1b',
        },
      },
    },
  },
  plugins: [],
}
export default config
