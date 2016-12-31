var router = require('express').Router();
var BlogDao = require('../dao/BlogsDao');
var filters = require('../filters');

router.get('/page', function(req, res, next) {
  var sortParams = { top: -1 },
      queryParams = {},
      pageSize = req.query.pagesize || 10,
      pageNum = req.query.pagenum || 0;
  var sortField = req.query.sortfield || 'updateAt';
  var sortOrder = req.query.sortorder || 'desc';
  sortParams[sortField] = sortOrder === 'desc' ? -1 : 1;

  var _key = req.query._key || '';
  var s = req.query.s || '';
  if (_key && s) queryParams[_key] = eval('/' + s + '/');
  if (req.query.isoff !== undefined) queryParams.isOff = req.query.isoff;
  BlogDao.page(queryParams, sortParams, pageNum, pageSize).then(function(blogs) {
    res.status(200).json({ code: 0, result: blogs });
  }).catch(function(error) {
    next(error);
  });
});

router.get('/get/:id', function(req, res, next) {
  var _id = req.params.id;
  BlogDao.getById(_id).then(function(blog) {
    res.status(200).json({ code: 0, result: blog });
  }).catch(function(error) {
    next(error);
  });
});

router.post('/new', filters.accessToken, function(req, res, next) {
  if (req.params.accessToken) {
    var params = req.body;
    params.author = req.session.user.name;
    params.top = false;
    params.reply_count = 0;
    params.visit_count = 0;
    params.zan_count = 0;
    params.last_reply = null;
    params.last_reply_at = null;
    params.create_at = new Date().getTime();
    params.content_is_html = false;
    params.isOff = false;
    BlogDao.save(params).then(function() {
      res.status(200).json({ code: 0, msg: '保存成功' });
    }).catch(function(error) {
      next();
    });
  } else {
    res.status(200).json({ code: -400, msg: 'Token 获取失败' });
  }
});

router.post('/set', filters.accessToken, function(req, res, next) {
  if (req.params.accessToken) {
    var params = {
      content: req.body.content,
      author: req.session.user.name
    };
    BlogDao.update({
      _id: req.body.id
    }, {
      $set: params
    }, {}).then(function() {
      res.status(200).json({ code: 0, msg: '更新成功' });
    }).catch(function(error) {
      next(error);
    });
  } else {
    res.status(200).json({ code: -400, msg: 'Token 获取失败' });
  }
});

router.post('/up/:id', filters.accessToken, function(req, res, next) {
  if (req.params.accessToken) {
    BlogDao.update({
      _id: req.params.id
    }, {
      $set: { top: true }
    }, {}).then(function() {
      res.status(200).json({ code: 0, msg: '置顶成功' });
    }).catch(function(error) {
      next(error);
    });
  } else {
    res.status(200).json({ code: -400, msg: 'Token 获取失败' });
  }
});


router.post('/off/:id', filters.accessToken, function(req, res, next) {
  if (req.params.accessToken) {
    BlogDao.update({
      _id: req.params.id
    }, {
      $set: { isOff: true }
    }, {}).then(function() {
      res.status(200).json({ code: 0, msg: '下架成功' });
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
    BlogDao.delete(_id).then(function() {
      res.status(200).json({ code: 0, msg: '删除成功' });
    }).catch(function(error) {
      next(error);
    });
  } else {
    res.status(200).json({ code: -400, msg: 'Token 获取失败' });
  }
});

module.exports = router;
