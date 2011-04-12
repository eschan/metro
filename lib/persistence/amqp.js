var amqp = require('amqp');
var _ = require('underscore');
var workflow = require('../workflow');
var request = require('../request');
var response = require('../response');

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
	
	self.tasksListen();
}

Server.prototype.configure = function(callback) {
	callback();
}

Server.prototype.publish = function(queue, message) {
	var self = this;
	var connection = self.connection;
	
	return function(queue, message) {
		connection.publish(queue, message, { durable: true, exchange: 'amq.topic' });
	} 
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

Server.prototype.tasksListen = function() {
	var self = this;
	
	self.connection.addListener('ready', function() {	
		_.each(self.subscriptions, function(subscription) {
			_.each(subscription.workflow.tasks, function(step) {
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
					
					var req = new request();
					var res = new response(subscription.workflow);
				
					res.publish = self.publish();
					
					step.callback(req, res);
	
					message.acknowledge(); //TODO: this acknowledgement will need to change so workflow tasks can have control of when the message is acknowleges
				});
			});
		});
	});
}
