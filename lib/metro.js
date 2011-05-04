var AMQPServer = require('./persistence/amqp');
var RedisServer = require('./persistence/redis');

var exports = module.exports;
exports.version = '0.0.1';

exports.createServer = function() {
	
	//TODO: this is to support other persistance types
	if ('object' == typeof arguments[0]) {
		return new RedisServer();
	} else {
		return new RedisServer();	
	}
}

/**
 * Expose constructors.
 */
exports.AMQPServer = AMQPServer;
