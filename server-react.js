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
    context: [
      '/css/**',
      '/images/**',
      '/assets/**',
      '/js/**',
      '/blog/**',
      '/user/**',
      '/group/**',
      '/tag_type/**',
      '/tag/**',
      '/comment/**'
    ],
    target: 'http://localhost:8823',
    secure: false
  }, {
    path: '/login',
    target: 'http://localhost:8823',
    secure: false
  }, {
    path: '/register',
    target: 'http://localhost:8823',
    secure: false
  }]
});

serverDev.app.get('/',function(req, res) {
	res.sendFile(__dirname + '/index.html')
});

serverDev.listen(8824, function() {
  console.log('[REACT_DEV] 正常打开8824端口');
});
