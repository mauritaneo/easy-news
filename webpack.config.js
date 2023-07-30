const path = require('path');
const { SourceMapDevToolPlugin } = require("webpack");
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './pages/_app.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    sourceMapFilename: "[name].js.map"
  },
  devtool: "source-map",
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    fallback: {
      fs: false,
      stream: require.resolve('stream-browserify'),
      zlib: require.resolve('browserify-zlib'),
      buffer: require.resolve('buffer/'),
      asset: require.resolve('assert/'),
      util: require.resolve('util/'),
      },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['next/babel'],
            },
          },
          {
            loader: 'source-map-loader',
            options: {
              filterSourceMappingUrl: (url, resourcePath) => {
                // Filter out sourcemaps that are not for the current resource
                return resourcePath.endsWith('.js');
              },
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new SourceMapDevToolPlugin({
      filename: "[file].map"
    }),
    // fix "process is not defined" error:
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
};