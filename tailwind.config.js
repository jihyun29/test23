module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      keyframes: {
        textToLeftLoop: {
          "0%": {
            transform: "translateX(0px)",
          },
          "100%": {
            transform: "translateX(-25%)",
          },
        },
        textToRightLoop: {
          "0%": {
            transform: "translateX(0px)",
          },
          "100%": {
            transform: "translateX(25%)",
          },
        },
      },
      animation: {
        flowTextToLeft: "textToLeftLoop 10s linear infinite",
        flowTextToRight: "textToRightLoop 10s linear infinite",
      },
    },
  },
  plugins: [],
};
