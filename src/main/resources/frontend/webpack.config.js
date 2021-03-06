let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let UglifyJSPlugin = require('uglifyjs-webpack-plugin');

let dist = path.join(__dirname, '../static/editor');
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
    filename: '[name].js',
    publicPath: 'static/editor'
  },
  resolve: {
    extensions: ['.jsx', '.js']
  },
  devServer: {
    host: '0.0.0.0',
    port: 8082,
    historyApiFallback: true,
    contentBase: ['../static/', './devindex/'],
    compress: true,
    proxy: {
      '/api': 'http://localhost:8080/pattern/'
    }
  },
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        sourceMap: true
      })
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.ftl'),
      filename: '../../com/jrende/views/editor.ftl',
      inject: true
    }),
    extractLess
  ],
  module: {
    rules: [
      {
        test: /\.jsx?/,
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
              loader: 'less-loader',
              options: {
                strictMath: true,
                noIeCompat: true
              }
            }
          ]
        })
      },
      {
        test: /\.(frag|vert|ftl)$/,
        loader: 'raw-loader',
        exclude: /node_modules/,
        include: __dirname
      }
    ]
  }
};
