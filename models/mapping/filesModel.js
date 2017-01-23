var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var schema = new Schema({
  nick_name: String,
  name: String,
  pid: String,
  type: String,
  position: String,
  create_at: Number,
  update_at: Number
});

mongoose.model('files', schema);
