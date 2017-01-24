var BaseDao = require('./BaseDao');
var FileModel = require('../models').files;
var fileUtils = require('../filters/fileUtils');

BaseDao.prototype.page = function(queryParams, sortParams, pageNum, pageSize) {
  var self = this;
  return new Promise(function(resolve,reject) {
    self.model.find(queryParams).sort(sortParams).skip(pageNum * pageSize).limit(pageSize).exec(function(err, data) {
      if (err) {
        reject(err);
      } else {
        self.model.find(queryParams).count(function(err,count) {
          if (err) {
            reject(err);
          } else {
            resolve({content:data, total:count});
          }
        });
      }
    });
  });
};

BaseDao.prototype.saveFile = function(file, noUpdate) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.model.create(file, function(err, data) {
      if (err) {
        reject(err);
      } else {
        if (data.type === 'f') {
          resolve(data);
        } else if (!noUpdate) {
          var id = data._id;
          var index = data.name.lastIndexOf('.');
          var fileType = data.name.substr(index, data.name.length);
          data.position = data.position + '/' + data._id + fileType;
          self.model.update({_id: id}, {$set: {position: data.position}}, {}, function(err) {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        }
      }
    });
  });
};

BaseDao.prototype.updateFile = function(catalog) {
  var self = this, id = catalog._id;
  delete catalog._id;
  return new Promise(function(resolve, reject) {
    self.model.update({_id: id}, {$set: catalog}, {}, function(err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

BaseDao.prototype.deleteFile = function(id) {
  var self = this;
  return new Promise(function(resolve,reject) {
    self.model.findOne({_id:id}, null, {}, function(err,catalog) {
      if (catalog.type === 'f') {
        fileUtils.rmDir(catalog.position).then(function() {
          self.model.remove({_id: id}, function(err,data) {
            if (err) reject(err);
            else resolve(data);
          });
        }, function(err) {
          reject(err)
        });
      }else{
        fileUtils.rmFile(catalog.position).then(function() {
          self.model.remove({_id:id}, function(err,data) {
            if (err) reject(err);
            else resolve(data);
          });
        }, function(err) {
          reject(err);
        });
      }
    });
  });
};

BaseDao.prototype.pageFolder = function(queryParams, sortParams) {
  var self = this;
  return new Promise(function(resolve,reject) {
    self.model.find(queryParams).sort(sortParams).exec(function(err, data) {
      if (err) {
        reject(err);
      } else {
        self.model.find(queryParams).count(function(err, count) {
          if (err) reject(err);
          else resolve({content:data, total:count});
        });
      }
    });
  });
};

BaseDao.prototype.getPath = function(position) {
  var self = this;
  return new Promise(function(resolve, reject) {
    if (position) {
      var pathList = decodeURIComponent(position).split('/');
      var ids = [];
      pathList.map(function(item){
        if (item) ids.push(item);
      });
      self.model.find({_id: {$in: ids}}, function(err, data) {
        if(err) reject(err);
        else resolve(data);
      });
    } else {
      resolve({});
    }
  });
};

module.exports = new BaseDao(FileModel);
