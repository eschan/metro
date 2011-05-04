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

	self.connection = amqp.createConnection( { host: '192.168.1.105', port: 5672, login: 'guest', password: 'guest', vhost: '/' } );

	//error listener on connection
	self.connection.addListener('error', function (e) {
		console.log(e);
	})

	//close listener on connection
	self.connection.addListener('close', function (e) {
		console.log('connection closed.');
	});
	
	self.subscriptionListen();	
	self.tasksListen();
}

Server.prototype.configure = function(callback) {
	callback();
}

Server.prototype.publish = function() {
	var self = this;
	var connection = self.connection;
	
	return function(queue, message) {
		connection.publish(queue, message, { durable: true, exchange: 'amq.topic' });
	} 
}

Server.prototype.subscribe = function(path, name, fn) {
	var self = this;
	var wflow = new workflow(name);
	
	fn(wflow);
	
	self.subscriptions[self.subscriptions.length] = {
		path: path, 
		workflow: wflow, 
		name: name 
	};
}

Server.prototype.subscriptionListen = function() {
	var self = this;
	
	self.connection.addListener('ready', function() {
		_.each(self.subscriptions, function(subscription) {
			var config = subscription.path.split('/');
			var exchangeName = config[0];
			var routingKey = config[1];
			var queueName = config[2];
		
			var e = self.connection.exchange(exchangeName, { type: 'topic', durable: true });
			var q = self.connection.queue(queueName, { passive: false, durable: true, exclusive: false, autoDelete: false });
		
			q.bind(exchangeName, routingKey);
		
			q.subscribeRaw(function(message) {
				message.addListener('data', function(data) {
				
					//TODO: format message
					
					//TODO: publish to first step
					var publisher = self.publish();
					var envolope = { body: data.toString() }; 
					publisher(subscription.name + '.' + subscription.workflow.tasks[0].queue, envolope);
					
					message.acknowledge();
				});
			});
		});
	});
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
					message.addListener('data', function (data) { 
						console.log(step.type);
					
						var envolope = JSON.parse(data.toString());
						var req = new request(envolope);
						var res = new response(subscription.workflow, envolope);
				
						res.publish = self.publish();
					
						step.callback(req, res);
	
						message.acknowledge(); //TODO: this acknowledgement will need to change so workflow tasks can have control of when the message is acknowleges
					});
				});
			});
		});
	});
}
