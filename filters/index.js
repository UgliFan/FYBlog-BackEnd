var config = require('../config').account;
var UserDao = require('../dao/UserDao');
var jwt = require('jwt-simple');
var formidable = require('formidable');
var fileUtils = require('./fileUtils');
var path = require('path');
var FileDao = require('../dao/FileDao');
var UserDao = require('../dao/UserDao');
var uuid = require('uuid/v4');

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
};

exports.register = function(req, res, next) {
  var iconUrl = '//back.fyq2yj.cn/upload/58845a31c52046b8ee7da9cb/58845ad1c52046b8ee7da9cc/';
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    var registerObj = {
      name: fields.name,
      email: fields.email,
      tel: fields.tel,
      sex: fields.sex,
      icon: '',
      password: fields.password,
      groupId: 1,
      active: true,
      createAt: new Date().getTime(),
      updateAt: new Date().getTime()
    };
    var randomUuid = uuid();
    var index = files.file.name.lastIndexOf('.');
    var fileType = files.file.name.substr(index, files.file.name.length);
    var randomName = randomUuid + fileType;
    var params = {
      name: files.file.name,
      oldPath: files.file.path,
      position: path.join(rootPath, '58845a31c52046b8ee7da9cb/58845ad1c52046b8ee7da9cc', randomName)
    };
    registerObj.icon = iconUrl + randomName;
    UserDao.checkExist(registerObj).then(function(users) {
      if (users && users.length > 0) {
        res.status(200).json({ code: -103, msg: '用户已存在' });
      } else {
        fileUtils.crossRename(params).then(function() {
          UserDao.save(registerObj).then(function(user) {
            res.status(200).json({ code: 0, msg: '注册成功' });
          }).catch(function(error) {
            res.status(200).json({ code: -200, msg: '注册失败', extraMsg: error });
          });
        }, function(err) {
          res.status(200).json({ code: -200, msg: 'IO异常' });
        });
      }
    }).catch(function(error) {
      next();
    });
  });
};