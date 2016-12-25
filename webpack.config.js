var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); //css单独打包
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html

var ROOT_PATH = path.resolve(__dirname),
    APP_PATH = path.resolve(ROOT_PATH, 'src'),
    APP_FILE = path.resolve(APP_PATH, 'App.jsx'),
    BUILD_PATH = path.resolve(ROOT_PATH, 'static');

module.exports = {
  entry: {
    main: APP_FILE
  },
  output: {
    path: BUILD_PATH,
    publicPath: '/',
    filename: 'js/[name].js?v=[hash:6]',
    sourceMapFilename: '[file].map'
  },
  devtool: '#source-map',
  module: {
    noParse: /es6-promise\.js$/,
    loaders: [{
      test: /\.js$/,
      exclude: /^node_modules$/,
      loader: 'babel?presets=es2015'
    }, {
      test: /\.css$/,
      exclude: /^node_modules$/,
      loader: ExtractTextPlugin.extract('style', ['css', 'autoprefixer'])
    }, {
      test: /\.scss$/,
      exclude: /^node_modules$/,
      loader: ExtractTextPlugin.extract('style', ['css', 'autoprefixer', 'sass'])
    }, {
      test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
      exclude: /^node_modules$/,
      loader: 'file-loader?name=[name].[ext]'
    }, {
      test: /\.(png|jpg|gif)$/,
      exclude: /^node_modules$/,
      loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
    }, {
      test: /\.jsx$/,
      exclude: /^node_modules$/,
      loaders: ['jsx', 'babel?presets[]=es2015,presets[]=react']
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({  //根据模板插入css/js等生成最终HTML
      filename: '../views/index.html', //生成的html存放路径
      template: './src/Templates/index.html', //html模板路径
      inject: 'body',
      hash: false
    }),
    new ExtractTextPlugin('css/core.css'),
    // new webpack.optimize.CommonsChunkPlugin("common", "js/common.bundle.js"),
    new webpack.optimize.UglifyJsPlugin({
      output: { comments: false },
      compress: { warnings: false },
      mangle: {
        except: ['$super', '$', 'exports', 'require']
      }
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss', '.css'] //后缀名自动补全
  }
};