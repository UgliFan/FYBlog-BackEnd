var router = require('express').Router();
var TagTypeDao = require('../dao/TagTypeDao');

router.get('/list', function(req, res, next) {
  TagTypeDao.getAll().then(function(tagTypes) {
    res.status(200).json({ code: 0, result: tagTypes });
  }).catch(function(error) {
    next(error);
  });
});

module.exports = router;
