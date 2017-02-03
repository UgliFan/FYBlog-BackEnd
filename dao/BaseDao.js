var Promise = require('es6-promise').Promise;

function DaoBase(Model) {
  this.model = Model;
}

DaoBase.prototype.save = function(params) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.model.create(params, function(error, data) {
      if (error) reject(error);
      else resolve(data);
    });
  });
};

DaoBase.prototype.getById = function(id) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.model.findOne({ _id: id }, function(error, model) {
      if (error) reject(error);
      else resolve(model);
    });
  });
};

DaoBase.prototype.getByAnything = function(anything) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.model.findOne(anything, function(error, model) {
      if (error) reject(error);
      else resolve(model);
    });
  });
};

DaoBase.prototype.countByQuery = function(query) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.model.count(query, function(error, model) {
      if (error) reject(error);
      else resolve(model);
    });
  });
};

DaoBase.prototype.getByQuery = function(query, fields, opt) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.model.find(query, fields, opt, function(error, model) {
      if (error) reject(error);
      else resolve(model);
    });
  });
};

DaoBase.prototype.getAll = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.model.find({}, function(error, models) {
      if (error) reject(error);
      else resolve(models);
    });
  });
};

DaoBase.prototype.delete = function(query) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.model.remove(query, function(error) {
      if (error) reject(error);
      else resolve(null);
    });
  });
};

DaoBase.prototype.update = function(conditions, update, opts) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.model.update(conditions, update, opts, function(error) {
      if (error) reject(error);
      else resolve(null);
    });
  });
};

module.exports = DaoBase;
