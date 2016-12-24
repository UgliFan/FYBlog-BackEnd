var BaseDao = require('./BaseDao');
var BlogModel = require('../models').blogs;

BaseDao.prototype.page = function(queryParams, sortParams, page, size) {
  var self = this;
  return new Promise(function(resolve, reject) {
    this.model.find(queryParams).sort(sortParams).skip(page * size).limit(size).exec(function(error, blogs) {
      if (error) reject(error);
      else resolve(blogs);
    });
  });
};

module.exports = new BaseDao(BlogModel);