var BaseDao = require('./BaseDao');
var GroupModel = require('../models').groups;

module.exports = new BaseDao(GroupModel);
