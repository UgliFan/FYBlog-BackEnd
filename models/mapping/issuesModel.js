var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var schema = new Schema({
  content: { type: String },
  author: { type: String },
  author_email: { type: String },
  create_at: { type: Number },
  reply: { type: Array },
  zan_count: { type: Number },
  type: { type: Number }, // 0: 提问 1: 改进意见 2: bug反馈 3: 情感交流
  state: { type: Number } // 0: 打开 1: 解决 2: 拒绝
});

mongoose.model('issues', schema);
