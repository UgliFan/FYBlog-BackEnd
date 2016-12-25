var mongoose = require('mongoose');
var config = require('../config');
var fs = require('fs');

// 创建连接
var conn = mongoose.createConnection(config.db.server, config.db.options);

// 连接错误回调
conn.on('error', function(error) {
  console.log('=====mongoose error:=====');
  console.log(error);
});

conn.once('open', function() {
  console.log('=====mongoose connect success=====');
});

var models_path = __dirname + '/../models/mapping';
fs.readdirSync(models_path).forEach(function(file) {
  require(models_path + '/' + file);
  var modelName = file.replace('Model.js', '');
  exports[modelName] = conn.model(modelName);
});