export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary-green': '#009966',
        'primary-dark-green': '#1a4d2e',
        'primary-light-green': '#00b377',
        'status-present': '#4CAF50',
        'status-late': '#FFC107',
        'status-late-alt': '#fe9a00',
        'status-absent': '#ec003f',
      },
      fontFamily: {
        arimo: ['Arimo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
