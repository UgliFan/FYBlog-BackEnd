var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  topic_id: { type: String },
  content: { type: String },
  author: { type: String },
  icon: { type: String },
  author_ip: { type: String },
  zan_count: { type: Number, default: 0 },
  cai_count: { type: Number, default: 0 },
  create_at: { type: Number },
  floor: { type: Number },
  children: { type: Array }
});

mongoose.model('comments', schema);
