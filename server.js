var app = require('./app');
var http = require('http');

var normalizePort = function(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) return 8823;
  if (port >= 0) return port;
  return 8823;
};
var port = normalizePort(process.env.PORT || '8823');
app.set('port', port);

var onError = function(error) {
  if (error.syscall !== 'listen') throw error;
  var bind = typeof port === 'string' ? ('Pipe ' + port) : ('Port' + port);
  switch(error.code) {
    case 'EACCES':
      console.log(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.log(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

var onListening = function() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? ('Pipe ' + addr) : ('Port ' + addr.port);
  console.log('Listening on ' + bind);
};


var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);