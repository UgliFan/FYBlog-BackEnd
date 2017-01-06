var BaseDao = require('./BaseDao');
var TagModel = require('../models').tags;

BaseDao.prototype.page = function(queryParams, sortParams, page, size) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.model.find(queryParams).sort(sortParams).skip(page * size).limit(size).exec(function(error, tags) {
      if (error) reject(error);
      else resolve(tags);
    });
  });
};

module.exports = new BaseDao(TagModel);
