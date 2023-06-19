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
            transform: "translateX(-20%)",
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
