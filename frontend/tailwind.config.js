/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Bebas Neue'", "cursive"],
        heading: ["'Rajdhani'", "sans-serif"],
        body: ["'Exo 2'", "sans-serif"],
      },
      colors: {
        gaming: {
          bg: "#0a0a0f",
          surface: "#12121a",
          card: "#1a1a27",
          border: "#2a2a3d",
          accent: "#7c3aed",
          "accent-light": "#a855f7",
          neon: "#00f5ff",
          "neon-green": "#39ff14",
          red: "#ff2244",
          gold: "#ffd700",
          text: "#e2e8f0",
          muted: "#64748b",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
        "slide-up": "slideUp 0.3s ease-out",
        "fade-in": "fadeIn 0.4s ease-out",
      },
      keyframes: {
        glow: {
          "0%, 100%": { boxShadow: "0 0 5px #7c3aed, 0 0 10px #7c3aed" },
          "50%": { boxShadow: "0 0 20px #a855f7, 0 0 40px #a855f7" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
