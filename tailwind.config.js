module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "3xl": "1300px"
      },
      outline: {
        debug: ['2px dashed red']
      }
    },
  },
  plugins: [],
};
