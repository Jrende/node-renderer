let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let UglifyJSPlugin = require('uglifyjs-webpack-plugin');
//var CopyWebpackPlugin = require('copy-webpack-plugin');

let dist = path.join(__dirname, 'dist');
let src = path.join(__dirname, 'src/');
let index = path.join(__dirname, 'src/index.html');
let entry = path.join(__dirname, 'src/main.jsx');


const extractLess = new ExtractTextPlugin({
  filename: '[name].css',
  disable: process.env.NODE_ENV === 'development'
});

module.exports = {
  entry: {
    app: entry
  },
  devtool: 'source-map',
  output: {
    path: dist,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.jsx', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: index,
      inject: true
    }),
    /*
    new UglifyJSPlugin({
      sourceMap: true
    }),
    */
    extractLess
  ],
  module: {
    rules: [
      {
        test : /\.jsx?/,
        include: __dirname,
        exclude: '/node_modules/',
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.less$/,
        use: extractLess.extract({
          use: [
            {
              loader: 'css-loader' // translates CSS into CommonJS
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'less-loader' // compiles Less to CSS
            }
          ]
        })
      },
      {
        test: /\.(frag|vert)$/,
        loader: 'raw-loader',
        exclude: /node_modules/,
        include: __dirname
      }
    ]
  }
};
