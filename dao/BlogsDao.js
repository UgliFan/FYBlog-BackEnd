var BaseDao = require('./BaseDao');
var BlogModel = require('../models').blogs;

module.exports = new BaseDao(BlogModel);