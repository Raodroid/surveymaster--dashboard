const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: false, // change importing css to less
  }),
  addLessLoader({
    javascriptEnabled: true,
  }),
);
