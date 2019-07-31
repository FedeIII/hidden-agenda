const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/client/index.js',
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      node_modules: path.resolve(__dirname, '../../../node_modules'),
      src: path.resolve(__dirname, './src'),
      client: path.resolve(__dirname, './src/client'),
      components: path.resolve(__dirname, './src/client/components'),
      shared: path.resolve(__dirname, './src/shared'),
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
      'prop-types': path.resolve('./node_modules/prop-types'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
  ],
};
