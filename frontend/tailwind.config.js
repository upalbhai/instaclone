/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1D4ED8',  // Custom blue color
        'secondary': '#10B981',  // Custom green color
        'accent': '#F59E0B',  // Custom orange color
        'error': '#DC2626',  // Custom red color
        'success': '#34D399',  // Custom light green color
        'info': '#3B82F6',  // Custom darker blue color
        'darkerBlue':'#021526',
        'customGray':'#686D76'
      },
    },
  },
  plugins: [require('flowbite/plugin')],
}
