module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      keyframes: {
        textLoop: {
          "0%": {
            transform: "translateX(0px)",
          },
          "100%": {
            transform: "translateX(-25%)",
          },
        },
      },
      animation: {
        flowText: "textLoop 8s linear infinite",
      },
    },
  },
  plugins: [],
};
