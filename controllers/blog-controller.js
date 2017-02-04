var router = require('express').Router();
var BlogDao = require('../dao/BlogsDao');
var filters = require('../filters');
var marked = require('marked');

router.get('/page', filters.crossOrigin, function(req, res, next) {
  var sortParams = { top: -1 },
      queryParams = {},
      pageSize = req.query.pagesize || 20,
      pageNum = req.query.pagenum || 0;
  var sortField = req.query.sortfield || 'create_at';
  var sortOrder = req.query.sortorder || 'desc';
  sortParams[sortField] = sortOrder === 'desc' ? -1 : 1;

  var _key = req.query._key || '';
  var s = req.query.s || '';
  if (_key && s) queryParams[_key] = eval('/' + s + '/i');
  if (req.query.isoff !== undefined) queryParams.isOff = req.query.isoff;
  BlogDao.page(queryParams, sortParams, pageNum, pageSize).then(function(blogs) {
    BlogDao.getAll().then(function(all) {
      res.status(200).json({ code: 0, result: blogs, total: all.length });
    }).catch(function(error) {
      res.status(200).json({ code: 0, result: blogs, total: 0 });
    });
  }).catch(function(error) {
    next(error);
  });
});

router.get('/page/hot', filters.crossOrigin, function(req, res, next) {
  var sortParams = { top: -1 },
      queryParams = { hot: true },
      pageSize = req.query.pagesize || 20,
      pageNum = req.query.pagenum || 0;
  var sortField = req.query.sortfield || 'create_at';
  var sortOrder = req.query.sortorder || 'desc';
  sortParams[sortField] = sortOrder === 'desc' ? -1 : 1;

  var _key = req.query._key || '';
  var s = req.query.s || '';
  if (_key && s) queryParams[_key] = eval('/' + s + '/i');
  if (req.query.isoff !== undefined) queryParams.isOff = req.query.isoff;
  BlogDao.page(queryParams, sortParams, pageNum, pageSize).then(function(blogs) {
    BlogDao.getAllHot().then(function(all) {
      res.status(200).json({ code: 0, result: blogs, total: all.length });
    }).catch(function(error) {
      res.status(200).json({ code: 0, result: blogs, total: 0 });
    });
  }).catch(function(error) {
    next(error);
  });
});

router.get('/recommend/slide', filters.crossOrigin, function(req, res, next) {
  BlogDao.slideRecom().then(function(blogs) {
    res.status(200).json({ code: 0, result: blogs });
  }).catch(function(error) {
    res.status(200).json({ code: -300, result: [] });
  });
});

router.get('/recommend/top5', filters.crossOrigin, function(req, res, next) {
  BlogDao.topFive().then(function(blogs) {
    res.status(200).json({ code: 0, result: blogs });
  }).catch(function(error) {
    res.status(200).json({ code: -300, result: [] });
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
router.get('/get_html/:id', filters.crossOrigin, function(req, res, next) {
  var _id = req.params.id;
  BlogDao.getById(_id).then(function(blog) {
    blog.content = marked(blog.content);
    BlogDao.update({_id: _id}, {
      $set: {visit_count: blog.visit_count + 1}
    }, {});
    res.status(200).json({ code: 0, result: blog });
  }).catch(function(error) {
    next(error);
  });
});

router.post('/new', filters.crossOrigin, function(req, res, next) {
  var params = req.body;
  params.author = params.author ? params.author : req.session.user.name;
  params.top = false;
  params.hot = false;
  params.reply_count = 0;
  params.visit_count = 0;
  params.zan_count = 0;
  params.last_reply = null;
  params.last_reply_at = null;
  params.create_at = new Date().getTime();
  params.isOff = false;
  if (!params.remark) {
    params.remark = params.content.substr(0, 30);
  }
  if (!params.icon && /<img(.*)\/>/.test(params.content)) {
    var img = params.content.match(/<img(.*)\/>/)[0] || '';
    var imgSrc = img.match(/src=\"([^\"]*?)\"/)[1];
    if (imgSrc) {
      params.icon = imgSrc;
    }
  }
  params.tags = JSON.parse(params.tags);
  BlogDao.save(params).then(function(data) {
    res.status(200).json({ code: 0, msg: '保存成功', result: data });
  }).catch(function(error) {
    next();
  });
});

router.post('/set', filters.crossOrigin, filters.accessToken, function(req, res, next) {
  if (req.params.accessToken) {
    var params = {
      title: req.body.title,
      remark: req.body.remark,
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

router.post('/zan/:id', filters.crossOrigin, function(req, res, next) {
  BlogDao.getById(req.params.id).then(function(blog) {
    BlogDao.update({
      _id: req.params.id
    }, {
      $set: { zan_count: blog.zan_count + 1 }
    }, {}).then(function() {
      res.status(200).json({ code: 0, msg: '点赞成功' });
    }).catch(function(error) {
      next(error);
    });
  }).catch(function(error) {
    next(error);
  });
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

router.post('/down/:id', filters.accessToken, function(req, res, next) {
  if (req.params.accessToken) {
    BlogDao.update({
      _id: req.params.id
    }, {
      $set: { top: false }
    }, {}).then(function() {
      res.status(200).json({ code: 0, msg: '取消置顶成功' });
    }).catch(function(error) {
      next(error);
    });
  } else {
    res.status(200).json({ code: -400, msg: 'Token 获取失败' });
  }
});

router.post('/on/:id', filters.accessToken, function(req, res, next) {
  if (req.params.accessToken) {
    BlogDao.update({
      _id: req.params.id
    }, {
      $set: { isOff: false }
    }, {}).then(function() {
      res.status(200).json({ code: 0, msg: '上架成功' });
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
    BlogDao.delete({_id: _id}).then(function() {
      res.status(200).json({ code: 0, msg: '删除成功' });
    }).catch(function(error) {
      next(error);
    });
  } else {
    res.status(200).json({ code: -400, msg: 'Token 获取失败' });
  }
});

module.exports = router;
