var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  title: { type: String },
  remark: { type: String },
  icon: { type: String },
  content: { type: String },
  author: { type: String },
  top: { type: Boolean, default: false },
  reply_count: { type: Number, default: 0 },
  visit_count: { type: Number, default: 0 },
  zan_count: { type: Number, default: 0 },
  create_at: { type: Number },
  last_reply: { type: String },
  last_reply_at: { type: Number },
  isOff: { type: Boolean }
});

mongoose.model('blogs', schema);
