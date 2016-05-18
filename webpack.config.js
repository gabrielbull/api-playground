var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: ['react-hot-loader/patch', 'webpack/hot/dev-server', './playground/index.js']
  },

  output: {
    path: path.join(__dirname, 'lib'),
    filename: '[name].js'
  },

  devtool: 'source-map',

  module: {
    /*preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint'
      }
    ],*/
    loaders: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin()
  ],

  eslint: {
    configFile: './.eslintrc'
  }
};
