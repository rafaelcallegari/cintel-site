module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./content/**/*.{md,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Alegreya', 'serif'],
      },
      colors: {
        cintelYellow: '#DDEABD',
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
  plugins: [],
}
