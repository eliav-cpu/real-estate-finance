import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#dde6ff',
          200: '#c2d0ff',
          300: '#9db0ff',
          400: '#7086ff',
          500: '#4a5dff',
          600: '#2d36f5',
          700: '#2429e1',
          800: '#2024b6',
          900: '#20248f',
          950: '#131456',
        },
      },
    },
  },
  plugins: [],
}

export default config
