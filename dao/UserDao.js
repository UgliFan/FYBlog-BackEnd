var BaseDao = require('./BaseDao');
var UserModel = require('../models').users;
var Promise = require('es6-promise').Promise;

BaseDao.prototype.getUserInfo = function(userName) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.model.find().or([{ email: userName }, { tel: userName }]).exec(function(error, models) {
      if (error) reject(error);
      else resolve(models);
    });
  });
};

BaseDao.prototype.checkExist = function(info) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.model.find().or([{ email: info.email }, { tel: info.tel }]).exec(function(error, models) {
      if (error) reject(error);
      else resolve(models);
    });
  });
};

BaseDao.prototype.resetPass = function(user) {
  var self = this, id = user._id;
  return self.update({
    _id: id
  }, {
    $set: {
      password: '123456',
      updateAt: new Date().getTime()
    }
  }, {});
};

module.exports = new BaseDao(UserModel);