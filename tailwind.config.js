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
            transform: "translateX(-100%)",
          },
        },
        textToRightLoop: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(0px)",
          },
        },
      },
      animation: {
        flowTextToLeft: "textToLeftLoop 15s linear infinite",
        flowTextToRight: "textToRightLoop 15s linear infinite",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
