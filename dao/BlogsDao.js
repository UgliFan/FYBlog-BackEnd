var BaseDao = require('./BaseDao');
var BlogModel = require('../models').blogs;

BaseDao.prototype.page = function(queryParams, sortParams, page, size) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.model.find(queryParams).sort(sortParams).select('-content').skip(page * size).limit(size).exec(function(error, blogs) {
      if (error) reject(error);
      else resolve(blogs);
    });
  });
};

BaseDao.prototype.getAllHot = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.model.find({hot: true}, function(error, models) {
      if (error) reject(error);
      else resolve(models);
    });
  });
};

BaseDao.prototype.slideRecom = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.model.find({hot: true}).sort({create_at: -1, top: -1}).select('-content -remark').limit(3).exec(function(error, blogs) {
      if (error) reject(error);
      else resolve(blogs);
    });
  });
};

BaseDao.prototype.topFive = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.model.find({hot: true}).sort({create_at: -1, top: -1}).select('-content').skip(3).limit(5).exec(function(error, blogs) {
      if (error) reject(error);
      else resolve(blogs);
    });
  });
};

module.exports = new BaseDao(BlogModel);
