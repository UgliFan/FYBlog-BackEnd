var BaseDao = require('./BaseDao');
var TagTypeModel = require('../models').tag_types;

module.exports = new BaseDao(TagTypeModel);
