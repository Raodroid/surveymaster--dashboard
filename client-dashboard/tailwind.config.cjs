module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      error: '#FA668A',
      warning: '#F99444',
      success: '#36BB9D',
      white: '#fff',
      black: '#000',
      primary: 'rgb(201 67 151)',
      secondary: '#25216a',
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
