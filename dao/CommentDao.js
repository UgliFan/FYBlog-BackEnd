var BaseDao = require('./BaseDao');
var CommentModel = require('../models').comments;

BaseDao.prototype.page = function(queryParams, sortParams, page, size) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.model.find(queryParams).sort(sortParams).skip(page * size).limit(size).exec(function(error, blogs) {
      if (error) reject(error);
      else resolve(blogs);
    });
  });
};

module.exports = new BaseDao(CommentModel);
