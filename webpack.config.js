const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/client/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'docs'),
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
    alias: {
      node_modules: path.resolve(__dirname, '../../../node_modules'),
      Src: path.resolve(__dirname, './src'),
      Client: path.resolve(__dirname, './src/client'),
      Components: path.resolve(__dirname, './src/client/components'),
      Phases: path.resolve(__dirname, './src/client/phases'),
      State: path.resolve(__dirname, './src/client/state'),
      Hooks: path.resolve(__dirname, './src/client/hooks'),
      Domain: path.resolve(__dirname, './src/domain'),
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
