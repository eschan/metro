var amqp = require('amqp');
var _ = require('underscore');
var workflow = require('../workflow');

var Server = exports = module.exports = function AMQPServer() {
	this.init();
};

Server.prototype.init = function() {
	this.subscriptions = [];
}

Server.prototype.listen = function () {
	var self = this;
	console.log('metro started');

	self.connection = amqp.createConnection( { host: 'localhost' } );

	//error listener on connection
	self.connection.addListener('error', function (e) {
		console.log(e);
	})

	//close listener on connection
	self.connection.addListener('close', function (e) {
		console.log('connection closed.');
	});
	
	self.stepsListen();
}

Server.prototype.configure = function(callback) {
	callback();
}

Server.prototype.publish = function(queue, message) {
	var self = this;
	self.connection.publish(queue, message, { 
		durable: true,
		//contentType: 'application/json',
		exchange: 'amq.topic'
		//headers: { retryCount: (retryCount+1).toString() } 
	}); 
}

Server.prototype.subscribe = function(path, name, fn) {
	var self = this;
	var wflow = new workflow();
	
	fn(wflow);
	
	self.subscriptions[self.subscriptions.length] = {
		path: path, 
		workflow: wflow, 
		name: name 
	};
}

Server.prototype.stepsListen = function() {
	var self = this;
	self.connection.addListener('ready', function() {	
		_.each(self.subscriptions, function(subscription) {
			_.each(subscription.workflow.steps, function(step) {
				var queueName = subscription.name + '.' + step.queue;
				var queue = self.connection.queue(queueName, { 
					passive: false,
					durable: true, 
					exclusive: false,
					autoDelete: false
				});	//create queue 
				
				queue.bind('amq.topic', queueName);
				
				queue.subscribeRaw(function(message) {
					console.log(step.type);
					var a = { };
					step.callback(a, message);
					message.acknowledge();
				});
			});
		});
	});
}
