import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /* Valtiq brand colors */
      colors: {
        navy: {
          DEFAULT: '#0F1C2E',
          light: '#1A2D45',
          dark: '#0A1420',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#D4BA6A',
          dark: '#B08F3A',
        },
        gray: {
          50: '#F5F5F5',
          100: '#E8E8E8',
          200: '#D1D1D1',
          300: '#B0B0B0',
          400: '#888888',
          500: '#6D6D6D',
          600: '#5D5D5D',
          700: '#4F4F4F',
          800: '#454545',
          900: '#3D3D3D',
        },
      },
      /* Inter font family */
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
