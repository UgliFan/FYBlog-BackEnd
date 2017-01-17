var router = require('express').Router();
var UserDao = require('../dao/UserDao');
var config = require('../config').account;
var filters = require('../filters');

router.post('/login', filters.crossOrigin, function(req, res, next) {
  UserDao.getUserInfo(req.body.name).then(function(users) {
    if (!users || users.length < 1) {
      res.status(200).json({ code: -100, msg: '用户名不存在' });
    } else if (!users[0].authenticate(req.body.password)) {
      res.status(200).json({ code: -102, msg: '用户名密码错误'});
    } else {
      req.session.accessToken = users[0]._id;
      req.session["user"] = users[0];
      res.cookie(config.access_token_name_cookie, users[0]._id, {
        maxAge: config.expire_time
      });
      res.status(200).json({ code: 0, msg: '登录成功' });
    }
  }).catch(function(error) {
    next(error);
  });
});

router.post('/register', filters.crossOrigin, function(req, res, next) {
  req.body.icon = req.body.icon || '/images/404.jpg';
  req.body.groupId = 1; // 强制注册用户为普通用户
  req.body.updateAt = req.body.createAt = new Date().getTime();
  req.body.active = true;
  UserDao.checkExist(req.body).then(function(users) {
    if (users && users.length > 0) {
      res.status(200).json({ code: -103, msg: '用户已存在' });
    } else {
      UserDao.save(req.body).then(function(user) {
        res.status(200).json({ code: 0, msg: '保存成功' });
      }).catch(function(error) {
        res.status(200).json({ code: -200, msg: '保存失败', extraMsg: error });
      });
    }
  }).catch(function(error) {
    console.log('checkExist fail');
    next(error);
  });
});

router.post('/reset/:id', filters.accessToken, function(req, res, next) {
  if (req.params.accessToken) {
    UserDao.getById(req.params.id).then(function(users) {
      if (!users || users.length < 1) {
        res.status(200).json({ code: -100, msg: '当前用户不存在' });
      } else {
        UserDao.resetPass(req.params.id).then(function() {
          res.status(200).json({ code: 0, msg: '重置成功' });
        }).catch(function(error) {
          res.status(200).json({ code: -200, msg: '重置失败', extraMsg: error });
        });
      }
    }).catch(function(error) {
      next(error);
    });
  } else {
    res.status(200).json({ code: -400, msg: 'Token 获取失败' });
  }
});

router.post('/lock/:id', filters.accessToken, function(req, res, next) {
  if (req.params.accessToken) {
    UserDao.getById(req.params.id).then(function(users) {
      if (!users || users.length < 1) {
        res.status(200).json({ code: -100, msg: '当前用户不存在' });
      } else {
        UserDao.update({_id:req.params.id},{$set:{active: false}},{}).then(function() {
          res.status(200).json({ code: 0, msg: '冻结成功' });
        }).catch(function(error) {
          res.status(200).json({ code: -200, msg: '冻结失败', extraMsg: error });
        });
      }
    }).catch(function(error) {
      next(error);
    });
  } else {
    res.status(200).json({ code: -400, msg: 'Token 获取失败' });
  }
});

router.post('/unlock/:id', filters.accessToken, function(req, res, next) {
  if (req.params.accessToken) {
    UserDao.getById(req.params.id).then(function(users) {
      if (!users || users.length < 1) {
        res.status(200).json({ code: -100, msg: '当前用户不存在' });
      } else {
        UserDao.update({_id:req.params.id},{$set:{active: true}},{}).then(function() {
          res.status(200).json({ code: 0, msg: '解冻成功' });
        }).catch(function(error) {
          res.status(200).json({ code: -200, msg: '解冻失败', extraMsg: error });
        });
      }
    }).catch(function(error) {
      next(error);
    });
  } else {
    res.status(200).json({ code: -400, msg: 'Token 获取失败' });
  }
});

router.get('/list', function(req, res, next) {
  UserDao.getAll().then(function(users) {
    res.status(200).json({ code: 0, result: users });
  }).catch(function(error) {
    next(error);
  });
});

module.exports = router;
