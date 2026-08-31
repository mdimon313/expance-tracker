module.exports = {
  content: ["./app/**/*.{js,jsx}", "./src/**/*.{js,jsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#10B981",
        expense: "#EF4444",
        warning: "#F59E0B",
        darkbg: "#0F172A",
        lightbg: "#F8FAFC",
      },
      fontFamily: {
        sans: ["Inter"],
      },
    },
  },
  plugins: [],
};
