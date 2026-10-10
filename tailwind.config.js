/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#F6F2EC",
        trav: "#E8DCC6",
        ink: "#2B2118",
        gold: "#B8955A",
        "gold-ink": "#7A5E2E",
        dark: "#1A140E",
        primary: {
          DEFAULT: "#B8955A",
          hover: "#9E7E45",
          foreground: "#FFFFFF",
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "sans-serif"],
      },
    },
  },
  plugins: [],
}
