var BaseDao = require('./BaseDao');
var IssueModel = require('../models').issues;

BaseDao.prototype.page = function(queryParams, sortParams, page, size) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.model.find(queryParams).sort(sortParams).skip(page * size).limit(size).exec(function(error, blogs) {
      if (error) reject(error);
      else resolve(blogs);
    });
  });
};

BaseDao.prototype.count = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.model.find({}).count(function(err, count) {
      if (err) {
        reject(err);
      } else {
        resolve(count);
      }
    });
  });
};

BaseDao.prototype.replyIssue = function(id, params) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.getById(id).then(function(data) {
      var reply = data.reply;
      reply.push(params);
      self.model.update({_id: id}, {
        $set: {reply: reply}
      }, {}, function(err, data) {
        if (err) reject(err);
        else resolve(data);
      });
    }, function(err) {
      reject(err);
    });
  });
};

module.exports = new BaseDao(IssueModel);
