'use strict'

const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry:  './src/app.js',
  output: {
    path: path.resolve(__dirname, './public'),
    filename: 'bundle.js'
  },
  resolve: {
    alias: { 'vue$': 'vue/dist/vue.esm.js' },
    extensions: ['*', '.js', '.vue', '.json']
  },
  module: {
    rules: [
      { test: /\.css$/, use: [ 'vue-style-loader', 'css-loader?minimize' ], exclude: /node_modules/ },
      { test: /\.(png|jpg|gif|svg)$/, loader: 'file-loader', options: { name: '[name].[ext]?[hash]' } },
      { test: /\.vue$/, loader: 'vue-loader' }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['public']),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({ filename: 'index.html', template: 'index.html', inject: true }),
    new CopyWebpackPlugin([ 'src/manifest.json' ])
  ],
  devServer: {
    historyApiFallback: {
      rewrites: [
        {
          from: /^\/modules\/.*$/,
          to: function(context) {
            var path = context.parsedUrl.pathname
            var filename = path.substring(path.lastIndexOf('/') + 1)
            return (filename.split('.').length > 1) ? '/' + filename : '/index.html'
          }
        }
      ]
    },
    headers: {
        "Access-Control-Allow-Origin": "*"
    }
  }
}