var router = require('express').Router();
var filters = require('../filters');

router.get('/', filters.refreshUser, filters.authorize, function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  delete req.session.accessToken;
  delete req.session.user;
  res.render('login', {
    rdt: decodeURIComponent(req.query.rdt || '/'),
    msg: req.query.rdt ? '回话已过期，请重新登录。' : ''
  });
});

module.exports = router;