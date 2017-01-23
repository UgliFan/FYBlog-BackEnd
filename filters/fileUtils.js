var fs = require('fs');
var path = require('path');
var Promise = require('es6-promise').Promise;
var util = require('util');

var rootPath = path.join(global.__rootPath, 'static/upload');

exports.mkDir = function(name) {
  var directory = rootPath + name;
  return new Promise(function(resolve, reject) {
    try{
      fs.exists(directory, function(exists) {
        if (exists) {
          reject('directory is exist.');
        } else {
          fs.mkdir(directory, function(err) {
            if (err) {
              reject(err);
            } else {
              resolve('create folder success.');
            }
          });
        }
      });
    } catch(e) {
      reject(e);
    }
  });
};

exports.rmDir = function(name) {
  var directory = rootPath + name;
  return new Promise(function(resolve, reject) {
    try {
      fs.exists(directory, function(exists) {
        if (exists) {
          fs.rmdir(directory, function(err) {
            if (err) {
              reject(err);
            } else {
              resolve('delete folder success.');
            }
          });
        } else {
          reject('directory is not exist.');
        }
      });
    } catch(e) {
      reject(e);
    }
  });
};

exports.rmFile = function(name) {
  var directory = rootPath + name;
  return new Promise(function(resolve, reject) {
    try {
      console.log(name);
      fs.exists(directory, function(exists) {
        console.log(exists);
        if (exists) {
          fs.unlinkSync(directory);
          resolve('delete file success.');
        } else {
          reject('file is not exist.');
        }
      });
    } catch(e) {
      reject(e);
    }
  });
};

exports.crossRename = function(params) {
  //跨分区重命名
  return new Promise(function(resolve, reject) {
    try {
      fs.exists(params.position, function(exists) {
        if (exists) {
          fs.unlinkSync(params.position);
        }
        var readStream = fs.createReadStream(params.oldPath);
        var writeStream = fs.createWriteStream(params.position);
        readStream.pipe(writeStream);
        readStream.on("end", function() {
          fs.unlinkSync(params.oldPath);
          resolve();
        });
      });
    } catch(e) {
      reject(e);
    }
  });
};