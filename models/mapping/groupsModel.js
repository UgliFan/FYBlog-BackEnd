var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  type: { type: Number }, // 0: 管理员, 1: 普通用户
  name: { type: String }
});

mongoose.model('groups', schema);