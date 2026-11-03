/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#111111',
        charcoal: '#1A1A1A',
        ivory: '#F5F5F5',
        amber: '#C99724',
        success: '#16865C',
        error: '#D64545',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(201,151,36,0.2), 0 10px 24px rgba(201,151,36,0.15)',
      },
    },
  },
  plugins: [],
};
