module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Alegreya', 'serif'],
      },
      colors: {
        cintelYellow: '#CAEB14',
        cintelGray: '#BBBAA1',
      },
      transitionDuration: {
        '250': '250ms',
        '300': '300ms',
        '400': '400ms'
      },
      transitionTimingFunction: {
        'in-expo': 'cubic-bezier(.2,.9,.2,1)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'), // Plugin do blog unificado aqui
  ],
}