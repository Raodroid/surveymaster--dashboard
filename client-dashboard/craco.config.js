const CracoLessPlugin = require('craco-less');
const CracoAntDesignPlugin = require('craco-antd');
const { loaderByName } = require('@craco/craco');

module.exports = {
  plugins: [
    {
      plugin: [CracoLessPlugin, CracoAntDesignPlugin],
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
        modifyLessRule(lessRule, context) {
          // You have to exclude these file suffixes first,
          // if you want to modify the less module's suffix
          lessRule.exclude = /\.m\.less$/;
          return lessRule;
        },
        modifyLessModuleRule(lessModuleRule, context) {
          // Configure the file suffix
          lessModuleRule.test = /\.m\.less$/;

          // Configure the generated local ident name.
          const cssLoader = lessModuleRule.use.find(loaderByName('css-loader'));
          cssLoader.options.modules = {
            localIdentName: '[local]_[hash:base64:5]',
          };

          return lessModuleRule;
        },
      },
    },
  ],
};
