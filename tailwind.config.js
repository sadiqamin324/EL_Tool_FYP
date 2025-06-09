module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        'grow-width': 'growWidth 1s ease-in-out infinite',
      },
      keyframes: {
        growWidth: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        }
      },
      backgroundImage: {
        "back-pattern": "url('./src/assets/back-pattern.jpg')",
        "back-eye": "url('./src/assets/back-eye.png')",
        tick: "url('./src/assets/tick.png')",
        universe: "url('./src/assets/universe.jpg')",
        "down-arrow": "url('./src/assets/down-arrow.png')",
        "white-tick": "url('./src/assets/white-tick.png')",
        "add": "url('./src/assets/Add.png')",
        "edit": "url('./src/assets/Edit.png')",
        "delete": "url('./src/assets/delete.png')",
        "green-dot": "url('./src/assets/green-dot.png')",
        "nova-icon": "url('./src/assets/Nova icon.png')",
        "add-browser": "url('./src/assets/Add-browser.png')",
        "black-texture": "url('./src/assets/black-texture.jpg')",
        "black-texture-2": "url('./src/assets/black-texture-2.jpg')",
        "graphs-piechart": "url('./src/assets/graphs-piechart.png')",
        "arrow-right": "url('./src/assets/arrow-right.png')",
        "right": "url('./src/assets/right.png')",
        "tailwind": "url('./src/assets/tailwind-logo.png')",
        "react": "url('./src/assets/react-logo.png')",
        "JS": "url('./src/assets/javascript-logo.png')",
        "express": "url('./src/assets/express-logo.png')",
        "html": "url('./src/assets/html-logo.png')",
        "css": "url('./src/assets/css-logo.png')",
        "sequelize": "url('./src/assets/sequelize-logo.png')",
        "postgres": "url('./src/assets/postgres-logo.png')",
        "node": "url('./src/assets/nodejs-logo.png')",
        "odoo": "url('./src/assets/odoo-logo.png')",
      },
      colors: {
        "white-60": "rgba(255, 255, 255, 0.6)",
        "white-80": "rgba(255, 255, 255, 0.8)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Use Inter as the default sans-serif font
        inter: ["Inter", "sans-serif"], // Optionally create a dedicated inter class
      },
      screens: {
        "3xl": "1300px",
      },
    },
  },
  plugins: [],
};
