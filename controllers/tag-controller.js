var router = require('express').Router();
var TagDao = require('../dao/TagDao');
var filters = require('../filters');

router.get('/page', function(req, res, next) {
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
  TagDao.page(queryParams, sortParams, pageNum, pageSize).then(function(tags) {
    res.status(200).json({ code: 0, result: tags });
  }).catch(function(error) {
    next(error);
  });
});

router.get('/get/:id', function(req, res, next) {
  var _id = req.params.id;
  TagDao.getById(_id).then(function(blog) {
    res.status(200).json({ code: 0, result: blog });
  }).catch(function(error) {
    next(error);
  });
});

router.post('/new', filters.accessToken, function(req, res, next) {
  if (req.params.accessToken) {
    var params = req.body;
    params.create_at = new Date().getTime();
    TagDao.save(params).then(function() {
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
      name: req.body.name,
    };
    TagDao.update({
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

router.post('/remove/:id', filters.accessToken, function(req, res, next) {
  if (req.params.accessToken) {
    var _id = req.params.id;
    TagDao.delete({_id: _id}).then(function() {
      res.status(200).json({ code: 0, msg: '删除成功' });
    }).catch(function(error) {
      next(error);
    });
  } else {
    res.status(200).json({ code: -400, msg: 'Token 获取失败' });
  }
});

module.exports = router;
