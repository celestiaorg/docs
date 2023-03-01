/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/components/node-api-docs.tsx"],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: ["class", '[data-theme="dark"]'],
  prefix: "tw-",
};