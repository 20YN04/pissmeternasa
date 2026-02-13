/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.php", "./src/**/*.{js,css}"] ,
  theme: {
    extend: {
      fontFamily: {
        display: ["Orbitron", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        hud: {
          base: "#070b14",
          panel: "#0c111f",
          glow: "#1b6bff",
        },
      },
      boxShadow: {
        tank: "0 0 25px rgba(27, 107, 255, 0.25), inset 0 0 18px rgba(27, 107, 255, 0.35)",
        liquidYellow: "0 0 30px rgba(244, 208, 63, 0.65)",
        liquidGreen: "0 0 30px rgba(51, 255, 51, 0.55)",
      },
    },
  },
  plugins: [],
};
