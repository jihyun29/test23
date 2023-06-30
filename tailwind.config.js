module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      keyframes: {
        textLoop: {
          "0%": {
            transform: "translateX(15%)",
          },
          "100%": {
            transform: "translateX(-35%)",
          },
        },
      },
      animation: {
        flowText: "textLoop 10s linear infinite",
      },
    },
  },
  plugins: [],
};
