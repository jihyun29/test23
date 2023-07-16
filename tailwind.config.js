module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        "black-transparent": "rgba(0,0,0,0.4)",
      },
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
