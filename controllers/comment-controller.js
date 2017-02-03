var router = require('express').Router();
var CommentDao = require('../dao/CommentDao');
var BlogDao = require('../dao/BlogsDao');
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
  params.zan_count = 0;
  params.cai_count = 0;
  params.children = [];
  params.author_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  params.create_at = new Date().getTime();
  CommentDao.save(params).then(function() {
    CommentDao.count(params.topic_id).then(function(count) {
      BlogDao.update({_id: params.topic_id}, {
        $set: {reply_count: count}
      }, {});
    });
    res.status(200).json({ code: 0, msg: '评论成功' });
  }).catch(function(error) {
    res.status(200).json({ code: -200, msg: '评论失败', error: error });
  });
});

router.post('/reply/:id', filters.crossOrigin, function(req, res, next) {
  var params = req.body;
  params.author_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  params.create_at = new Date().getTime();
  CommentDao.getById(req.params.id).then(function(comment) {
    var children = comment.children || [];
    children.push(params);
    CommentDao.update({
      _id: req.params.id
    }, {
      $set: {
        children: children
      }
    }, {}).then(function() {
      res.status(200).json({ code: 0, msg: '评论成功' });
    }).catch(function(error) {
      res.status(200).json({ code: -200, msg: '评论失败', error: error });
    });
    res.status(200).json({ code: 0, result: comment });
  }).catch(function(error) {
    next(error);
  });
});

router.post('/zan/:id', filters.crossOrigin, function(req, res, next) {
  CommentDao.getById(req.params.id).then(function(comment) {
    CommentDao.update({_id: req.params.id}, {
      $set: {zan_count: comment.zan_count + 1}
    }, {}).then(function() {
      res.status(200).json({ code: 0, msg: '点赞成功' });
    }).catch(function(error) {
      res.status(200).json({ code: -200, msg: '点赞失败' });
    });
  }).catch(function(error) {
    next(error);
  });
});

router.post('/cai/:id', filters.crossOrigin, function(req, res, next) {
  CommentDao.getById(req.params.id).then(function(comment) {
    CommentDao.update({_id: req.params.id}, {
      $set: {cai_count: comment.cai_count + 1}
    }, {}).then(function() {
      res.status(200).json({ code: 0, msg: '踩一脚成功' });
    }).catch(function(error) {
      res.status(200).json({ code: -200, msg: '踩一脚失败' });
    });
  }).catch(function(error) {
    next(error);
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
