// client/tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        accent: "#ec4899",
        card: "#1f2937",
      },
      boxShadow: {
        elegant: "0 8px 30px rgba(0, 0, 0, 0.12)",
        glow: "0 0 25px rgba(99, 102, 241, 0.6)",
      },
    },
  },
  plugins: [],
}
