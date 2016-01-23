/**
 * Created by OLEG on 17.01.2016.
 */


process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.DEBUG = process.env.DEBUG || 'tgc:*'

var app = require('./app');
var debug = require('debug')('tgc:start');;
var http = require('http');

debug(`NODE_ENV ${process.env.NODE_ENV}`);

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
process.on('uncaughtException', (err) => {
	console.log(`Caught exception: ${err}`);
	debug(`--- CAUGHT GLOBAL exception: ${err}`)
	debug(` ${err.stack}`)
});

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	var bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	debug('Listening on ' + bind);
}

function normalizePort(val) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}