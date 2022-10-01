const CopyPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;
const HtmlPlugin = require('html-webpack-plugin');
const package = require('./package');
const path = require('path');

module.exports = (env, argv) => ({
  devtool: 'source-map',
  entry: path.resolve(__dirname, './src/App/index.js'),
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      }
    ],
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'app.js',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './src/index.js'),
          to: path.resolve(__dirname, './build'),
        },
      ],
    }),
    new DefinePlugin({
      __DEV__: argv.mode === 'development',
    }),
    new HtmlPlugin({
      filename: 'index.html',
      inject: 'body',
      template: path.resolve(__dirname, './src/index.html'),
      title: package.description,
    }),
  ],
  resolve: {
    extensions: ['*', '.js'],
  },
  target: 'electron-renderer',
});
