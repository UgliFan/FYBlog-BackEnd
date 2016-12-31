var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require('fs');
var engines = require('consolidate');
var favicon = require('serve-favicon');

var config = require('./config');

var app = express();

global.__rootPath = __dirname;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname,'static/images','favicon.ico')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static')));
app.use(session({
  name: 'fyblog.sid',
  secret: 'fyblog_fancy',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: config.account.expire_time
  }
}));
app.use(function(req, res, next) {
  res.locals.req = req;
  res.locals.v = '20161224';
  res.locals.config = config;
  next();
});

// 加载controllers目录下的接口
var ctrlFileNames = fs.readdirSync('controllers');
for (var i in ctrlFileNames) {
  if (ctrlFileNames[i] === '.DS_Store' || ctrlFileNames[i] === 'config.txt') {
    continue;
  }
  var ctrlFileName = ctrlFileNames[i];
  var ctrlName = ctrlFileName.slice(0, -3);
  var ctrl = require('./controllers/' + ctrlName);
  var ctrlPath = ctrl.ctrlPath || ('/' + (ctrlName.slice(0, -11) === 'index' ? '' : ctrlName.slice(0, -11)));
  app.use(ctrlPath, ctrl);
}

// 加载路由
app.use('/', require('./routes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err.originalUrl);
  res.render('404', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
