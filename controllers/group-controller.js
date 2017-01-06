var router = require('express').Router();
var GroupDao = require('../dao/GroupDao');

router.get('/list', function(req, res, next) {
  GroupDao.getAll().then(function(groups) {
    res.status(200).json({ code: 0, result: groups });
  }).catch(function(error) {
    next(error);
  });
});

module.exports = router;
