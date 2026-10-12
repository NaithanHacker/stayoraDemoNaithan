/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stayora: {
          navy: {
            DEFAULT: '#0A1128',
            deep: '#060B18',
            light: '#152244',
            surface: '#1A2A54',
            card: '#0E1833'
          },
          gold: {
            DEFAULT: '#C5A880',
            light: '#DFCCA8',
            muted: '#A88D65',
            dark: '#8C7047',
            accent: '#EBD8B8',
          },
          sand: {
            DEFAULT: '#EFECE6',
            light: '#F8F6F2',
            dark: '#D8D3C8',
          },
          ivory: '#FDFCFA',
          charcoal: '#1F242D',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(10, 17, 40, 0.35)',
        'gold-glow': '0 0 25px rgba(197, 168, 128, 0.3)',
        'subtle': '0 4px 20px -2px rgba(10, 17, 40, 0.06)',
      }
    },
  },
  plugins: [],
}
