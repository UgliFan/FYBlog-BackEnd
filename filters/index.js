var config = require('../config').account;
var UserDao = require('../dao/UserDao');
var jwt = require('jwt-simple');
var formidable = require('formidable');
var fileUtils = require('./fileUtils');
var path = require('path');
var FileDao = require('../dao/FileDao');

var rootPath = path.join(global.__rootPath, 'static/upload');

exports.refreshUser = function(req, res, next){
  if (req.session.user && req.session.user._id) {
    UserDao.getById(req.session.accessToken).then(function(user) {
      req.session.user = user;
      next();
    }).catch(function(error) {
      next(error);
    });
  } else {
    next();
  }
};

var checkUid = function(req, res) {
  var uid = req.cookies[config.access_token_name_cookie];
  if (uid) {
    return uid === req.session.user._id.toString() && req.session.user.groupId === 0;
  } else {
    return false;
  }
};

exports.authorize = function(req, res, next) {
  if (req.session.accessToken && checkUid(req,res)) {
    req.params.user = req.session.user;
    next();
  } else {
    delete req.params.user;
    var protocal = req._parsedUrl.protocol || 'http://';
    var pathName = req.originalUrl;
    res.redirect('/login?rdt=' + encodeURIComponent(pathName));
  }
};

exports.accessToken = function(req, res, next) {
  var token = req.body.token || req.query.token;
  req.params.aaccessToken = false;
  if (token) {
    if (req.session.accessToken === jwt.decode(token, config.secret_key).foo) {
      req.params.accessToken = true;
    }
  }
  next();
};

exports.crossOrigin = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS,FETCH");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
};

exports.uploadFiles = function (req, res, next) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    var fileObj = {};
    fileObj.nick_name = fields.name;
    fileObj.name = files.file.name;
    fileObj.pid = fields.pid;
    fileObj.create_at = new Date().getTime();
    fileObj.update_at = new Date().getTime();
    fileObj.position = fields.position;
    if (files.file.type.indexOf('image') > -1) {
      fileObj.type = 'p';
    } else {
      fileObj.type = 'o';
    }
    FileDao.saveFile(fileObj).then(function(file) {
      var params = {
        name: file.name,
        oldPath: files.file.path,
        position: path.join(rootPath, file.position)
      };
      fileUtils.crossRename(params).then(function() {
        file.size = files.file.size;
        req.params.fileInfo = file;
        next();
      }, function(err) {
        req.params.fileError = err;
        next();
      });
    });
  });
}
