import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/renderer/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f2faf3',
          100: '#ddf2e0',
          200: '#b2ddb5',
          300: '#82c487',
          400: '#57ab5e',
          500: '#3d9145',
          600: '#2f7537',
          700: '#265d2c',
          800: '#1f4a24',
          900: '#193d1e',
        },
      },
    },
  },
  plugins: [],
}
export default config
