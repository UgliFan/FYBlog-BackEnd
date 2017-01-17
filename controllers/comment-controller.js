var router = require('express').Router();
var CommentDao = require('../dao/CommentDao');
var filters = require('../filters');

router.get('/page/:topic_id', filters.crossOrigin, function(req, res, next) {
  var sortParams = {},
      queryParams = {
        topic_id: req.params.topic_id
      },
      pageSize = req.query.pagesize || 20,
      pageNum = req.query.pagenum || 0;
  var sortField = req.query.sortfield || 'create_at';
  var sortOrder = req.query.sortorder || 'desc';
  sortParams[sortField] = sortOrder === 'desc' ? -1 : 1;
  var _key = req.query._key || '';
  var s = req.query.s || '';
  if (_key && s) queryParams[_key] = eval('/' + s + '/i');
  CommentDao.page(queryParams, sortParams, pageNum, pageSize).then(function(comments) {
    res.status(200).json({ code: 0, result: comments });
  }).catch(function(error) {
    next(error);
  });
});

router.get('/get/:id', function(req, res, next) {
  var _id = req.params.id;
  CommentDao.getById(_id).then(function(comment) {
    res.status(200).json({ code: 0, result: comment });
  }).catch(function(error) {
    next(error);
  });
});

router.post('/new', filters.crossOrigin, function(req, res, next) {
  var params = req.body;
  params.create_at = new Date().getTime();
  CommentDao.save(params).then(function() {
    res.status(200).json({ code: 0, msg: '保存成功' });
  }).catch(function(error) {
    next();
  });
});

router.post('/remove/:id', filters.accessToken, function(req, res, next) {
  if (req.params.accessToken) {
    var _id = req.params.id;
    CommentDao.delete({_id: _id}).then(function() {
      res.status(200).json({ code: 0, msg: '删除成功' });
    }).catch(function(error) {
      next(error);
    });
  } else {
    res.status(200).json({ code: -400, msg: 'Token 获取失败' });
  }
});

module.exports = router;
