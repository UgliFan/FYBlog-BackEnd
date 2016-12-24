var BaseDao = require('./BaseDao');
var UserModel = require('../models').users;

module.exports = new BaseDao(UserModel);