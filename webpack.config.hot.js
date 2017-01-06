var webpack = require('webpack');
var path = require('path');

var env = process.env.NODE_ENV || 'development';

var ROOT_PATH = path.resolve(__dirname),
    APP_PATH = path.resolve(ROOT_PATH, 'src'),
    APP_FILE = path.resolve(APP_PATH, 'App.jsx'),
    BUILD_PATH = path.resolve(ROOT_PATH, 'dest');

module.exports = {
  entry: {
    bundle: [
      'webpack-dev-server/client?http://localhost:8824',
      'webpack/hot/only-dev-server',
      APP_FILE
    ]
  },
  output: {
    path: BUILD_PATH,
    publicPath: '/dest/',
    filename: 'js/[name].js?v=[hash:6]'
  },
  module: {
    noParse: /es6-promise\.js$/,
    loaders: [{
      test: /\.js$/,
      exclude: /^node_modules$/,
      loader: 'babel?presets=es2015&compact=false',
      include: [APP_PATH]
    }, {
      test: /\.css$/,
      exclude: /^node_modules$/,
      loader: ['style', 'css', 'autoprefixer'],
      include: [APP_PATH]
    }, {
      test: /\.scss$/,
      exclude: /^node_modules$/,
      loader: 'style-loader!css-loader!autoprefixer-loader!sass-loader',
      include: [APP_PATH]
    }, {
      test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
      exclude: /^node_modules$/,
      loader: 'file-loader?name=[name].[ext]',
      include: [APP_PATH]
    }, {
      test: /\.(png|jpg|gif)$/,
      exclude: /^node_modules$/,
      loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]',
      include: [APP_PATH]
    }, {
      test: /\.jsx$/,
      exclude: /^node_modules$/,
      loaders: ['jsx', 'babel?presets[]=es2015,presets[]=react'],
      include: [APP_PATH]
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify("development")
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss', '.css'] //后缀名自动补全
  }
};
