var router = require('express').Router();
var FileDao = require('../dao/FileDao');
var filters = require('../filters');
var path = require('path');

var staticPath = path.join(global.__rootPath, 'static/upload');

router.get('/page', function(req, res, next) {
  var pageSize = req.query.pagesize || 20;
  var pageNum = req.query.pagenum || 0;
  var sortField = req.query.sortfield || 'update_at';
  var sortOrder = req.query.sortorder || 'desc';
  var sortParams = {};
  sortParams[sortField] = sortOrder === 'desc' ? -1 : 1;

  var _key = req.query._key || '';
  var s = req.query.s || '';
  var pId = req.query.pid || 'ROOT';
  var type = req.query.type || '';
  var queryParams = {pid: pId};
  if (_key && s) queryParams[_key] = eval("/" + s + "/i");
  if (type) queryParams.type = type;
  FileDao.page(queryParams, sortParams, pageNum, pageSize).then(function (data) {
    res.status(200).json({code: 0, result: data});
  }, function(err) {
    next(err);
  });
});

router.get('/page/folder', function(req, res, next) {
  var sortField = req.query.sortfield || 'update_at';
  var sortOrder = req.query.sortorder || 'desc';
  var sortParams = {};
  sortParams[sortField] = sortOrder === 'desc' ? -1 : 1;

  var type = req.query.type || 'f';
  var queryParams = {};
  if(type) queryParams.type = type;
  FileDao.pageFolder(queryParams, sortParams).then(function(data) {
    res.status(200).json({code: 0, result: data});
  }, function(err) {
    next(err);
  });
});

router.get('/get/:id',function(req, res, next) {
  var _id = req.params.id;
  FileDao.getById(_id, function(err, data) {
    if (err) {
      next(err);
    } else {
      res.status(200).json({code: 0, result: data});
    }
  });
});


router.get('/breadcrumb', function(req, res, next) {
  var position = req.query.path;
  FileDao.getPath(position).then(function(data) {
    res.status(200).json({code: 0, result: data});
  }, function(err) {
    next(err);
  });
});

router.post('/save', filters.crossOrigin, filters.uploadFiles, function(req, res, next) {
  if (req.params.fileInfo) {
    res.status(200).json({code: 0, msg: '保存成功'});
  } else {
    res.status(200).json({code: -200, msg: '保存失败'});
  }
});

router.post('/upload', filters.crossOrigin, filters.uploadImages, function(req, res, next) {
  next();
});

router.post('/remove/:id', filters.accessToken, function(req, res, next) {
  if (req.params.accessToken) {
    var _id = req.params.id;
    FileDao.deleteFile(_id).then(function (data) {
      res.status(200).json({code: 0, msg: '删除成功'});
    }, function (err) {
      res.status(200).json({code: -200, msg: '删除失败'});
    });
  } else {
    res.status(200).json({ code: -400, msg: 'Token 获取失败' });
  }
});

router.get('/download/:id',function(req, res, next){
  var id = req.params.id;
  FileDao.getById(id).then(function(data) {
    var filePath = staticPath + data.position;
    var fileName = data.name;
    res.download(filePath, fileName);
  }, function(err) {
    next(err);
  });
});

module.exports = router;
