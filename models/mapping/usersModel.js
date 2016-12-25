var mongoose = require('mongoose');
var crypto = require('crypto');

var schema = new mongoose.Schema({
  name: String,
  email: String,
  icon: String,
  sex: String,
  tel: String,
  hash_pass: String,
  groupId: Number,
  active: Boolean,
  createAt: Number,
  updateAt: Number
});

function encryptPassword(password) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(password);
  return md5sum.digest('hex').toUpperCase();
}

schema.virtual('pass').set(function(password) {
  this.hash_pass = encryptPassword(password);
});

schema.method('authenticate', function(plainText) {
  return encryptPassword(plainText) === this.hash_pass;
});

mongoose.model('users', schema);