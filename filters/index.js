var config = require('../config').account;
var UserDao = require('../dao/UserDao');
var jwt = require('jwt-simple');

exports.refreshUser = function(req, res, next){
  if (req.session.user && req.session.user._id) {
    UserDao.getById(req.session.accessToken).then(function(user) {
      req.session.user = user;
      next();
    }).fail(function(error) {
      next(error);
    });
  } else {
    next();
  }
};

var checkUid = function(req, res) {
  var uid = req.cookies[config.access_token_name_cookie];
  if (uid) {
    return uid === req.session.user._id.toString();
  } else {
    return true;
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