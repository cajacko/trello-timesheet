require('dotenv').config();

import webpack from 'webpack';
import { resolve, join } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackChunkHash from 'webpack-chunk-hash';

module.exports = {
  entry: {
    src: './src/index.jsx',
  },
  module: {
    // Use babel to transform react source
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.css$/,
        loader: 'style-loader',
      },
      {
        test: /\.css$/,
        loader: 'css-loader',
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    // Auto generates the index.html file from our template
    new HtmlWebpackPlugin({ template: join(__dirname, 'src/index.html') }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true,
      },
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      comments: false,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => {
        if (!module.context) {
          return false;
        }

        if (module.context.indexOf('node_modules') !== -1) {
          return true;
        }

        return false;
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['manifest'], // Specify the common bundle's name.
    }),
    new webpack.HashedModuleIdsPlugin(),
    new WebpackChunkHash(),
    new webpack.DefinePlugin({
      'process.env.DATABASE_URL': `'${process.env.DATABASE_URL}'`,
      'process.env.TRELLO_APPLICATION_KEY': `'${
        process.env.TRELLO_APPLICATION_KEY
      }'`,
      'process.env.TRELLO_USER_TOKEN': `'${process.env.TRELLO_USER_TOKEN}'`,
      'process.env.TRELLO_ORGANISATIONS': `'${
        process.env.TRELLO_ORGANISATIONS
      }'`,
    }),
  ],
  output: {
    filename: '[chunkhash].[name].js',
    path: resolve(__dirname, 'dist'),
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: join(__dirname, 'src/assets/'),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
  },
};
