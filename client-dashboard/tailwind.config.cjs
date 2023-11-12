module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      error: '#FA668A',
      warning: '#F99444',
      success: '#36BB9D',
      white: '#fff',
      black: '#000',
      info:'#007AE7',
      primary: 'rgb(201 67 151)',
      secondary: '#25216a',
      textColor: 'rgb(37 33 107)'
    },

    extend:{
      borderColor:'#F3EEF3',
      borderRadius:'8px'
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
