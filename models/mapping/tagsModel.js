var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  type: { type: Number },
  name: { type: String },
  create_at: { type: Number }
});

mongoose.model('tags', schema);
