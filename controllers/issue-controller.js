var router = require('express').Router();
var IssueDao = require('../dao/IssueDao');
var filters = require('../filters');

router.get('/page', filters.crossOrigin, function(req, res, next) {
  var sortParams = {},
    queryParams = {},
    pageSize = req.query.pagesize || 20,
    pageNum = req.query.pagenum || 0;
  var sortField = req.query.sortfield || 'create_at';
  var sortOrder = req.query.sortorder || 'desc';
  sortParams[sortField] = sortOrder === 'desc' ? -1 : 1;

  IssueDao.page(queryParams, sortParams, pageNum, pageSize).then(function(issues) {
    IssueDao.count().then(function(count) {
      res.status(200).json({ code: 0, result: issues, total: count });
    }).catch(function() {
      res.status(200).json({ code: 0, result: issues, total: 0 });
    });
  }).catch(function(error) {
    next(error);
  });
});

router.get('/list', function(req, res, next) {
  var sortParams = {},
    queryParams = {},
    pageSize = req.query.pagesize || 20,
    pageNum = req.query.pagenum || 0;
  var sortField = req.query.sortfield || 'create_at';
  var sortOrder = req.query.sortorder || 'desc';
  sortParams[sortField] = sortOrder === 'desc' ? -1 : 1;

  var _key = req.query._key || '';
  var s = req.query.s || '';
  if (_key && s) queryParams[_key] = eval('/' + s + '/i');
  IssueDao.page(queryParams, sortParams, pageNum, pageSize).then(function(issues) {
    IssueDao.count().then(function(count) {
      res.status(200).json({ code: 0, result: issues, total: count });
    }).catch(function(error) {
      res.status(200).json({ code: 0, result: issues, total: 0 });
    });
  }).catch(function(error) {
    next(error);
  });
});

router.post('/new', filters.crossOrigin, function(req, res, next) {
  var params = req.body;
  params.type = params.type || 3;
  params.state = 0;
  params.zan_count = 0;
  params.reply = [];
  params.author_email = params.author_email || '';
  params.create_at = new Date().getTime();
  IssueDao.save(params).then(function() {
    res.status(200).json({ code: 0, msg: '发表成功' });
  }).catch(function(error) {
    res.status(200).json({ code: -200, msg: '发表失败', error: error });
  });
});

router.post('/reply/:id', filters.crossOrigin, function(req, res, next) {
  var params = {
    content: req.body.content,
    name: req.body.author,
    reply_at: new Date().getTime()
  };
  IssueDao.replyIssue(req.params.id, params).then(function(groups) {
    res.status(200).json({ code: 0, result: groups });
  }).catch(function(error) {
    res.status(200).json({ code: -200, msg: '评论失败', error: error });
  });
});

router.post('/close/:id', filters.accessToken, function(req, res, next) {
  if (req.params.accessToken) {
    var _id = req.params.id;
    IssueDao.update({_id: _id},{
      $set: {state: 2}
    }, {}).then(function() {
      res.status(200).json({ code: 0, msg: '关闭成功' });
    }).catch(function(error) {
      next(error);
    });
  } else {
    res.status(200).json({ code: -400, msg: 'Token 获取失败' });
  }
});

router.post('/remove/:id', filters.accessToken, function(req, res, next) {
  if (req.params.accessToken) {
    var _id = req.params.id;
    IssueDao.delete({_id: _id}).then(function() {
      res.status(200).json({ code: 0, msg: '删除成功' });
    }).catch(function(error) {
      next(error);
    });
  } else {
    res.status(200).json({ code: -400, msg: 'Token 获取失败' });
  }
});

module.exports = router;
