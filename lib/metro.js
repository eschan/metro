var AMQPServer = require('./persistence/amqp');

var exports = module.exports;
exports.version = '0.0.1';

exports.createServer = function() {
	
	//TODO: this is to support other persistance types
	if ('object' == typeof arguments[0]) {
		return new AMQPServer();
	} else {
		return new AMQPServer();	
	}
}

/**
 * Expose constructors.
 */
exports.AMQPServer = AMQPServer;
