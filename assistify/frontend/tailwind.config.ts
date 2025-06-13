import type { Config } from 'tailwindcss';
export default {
  important: '#root',
  content: ['./src/**/*.{html,tsx}'],
  theme: {
    extend: {},

    backgroundImage: {
      main: 'linear-gradient(162.46deg, #3D8CEC 0%, #3DB66B 100%);',
      auth: "url('/bg.svg')",
    },
    borderColor: {
      input: '#D9D9D9',
    },
  },
  plugins: [],
} satisfies Config;
