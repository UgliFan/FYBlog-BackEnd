var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  key: { type: Number }, // 0: 系统预设, 1: 自定义, 2: 文章生成
  name: { type: String },
  can_edit: { type: Boolean }
});

mongoose.model('tag_types', schema);
