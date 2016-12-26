var router = require('express').Router();
var UserDao = require('../dao/UserDao');
var config = require('../config').account;
var jwt = require('jwt-simple');

var checkUid = function(req, res) {
  var uid = req.cookies[config.access_token_name_cookie];
  if (uid) {
    return uid === req.session.user._id.toString();
  } else {
    return true;
  }
};

router.get('token', function(req, res, next) {
  console.log(req.session.accessToken);
  if (req.session.accessToken && checkUid(req, res)) {
    var token = jwt.encode({
      foo: req.session.accessToken
    }, config.secret_key);
    res.status(200).json({ code: 0, token: token });
  } else {
    res.status(200).json({ code: -101, msg: 'Token 获取失败' });
  }
});

module.exports = router;