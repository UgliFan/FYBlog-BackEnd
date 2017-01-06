var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.hot');

var serverDev = new WebpackDevServer(webpack(webpackConfig), {
  publicPath: webpackConfig.output.publicPath,
  hot: true,
  historyApiFallback: true,
	inline: true,
	progress: true,
	stats: {
		colors: true
	},
  proxy: [{
    context: ['/css/**','/images/**','/assets/**','/js/**','/blog/**','/user/**','/group/**'],
    target: 'http://localhost:8823',
    secure: false
  }]
});

serverDev.listen(8824, function() {
  console.log('[REACT_DEV] 正常打开8824端口');
});
