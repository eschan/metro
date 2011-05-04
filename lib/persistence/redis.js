var redis = require('redis');
var _ = require('underscore');
var workflow = require('../workflow');
var request = require('../request');
var response = require('../response');
		
var Server = exports = module.exports = function RedisServer() {
	this.init();
};

Server.prototype.init = function() {
	this.subscriptions = [];
};

Server.prototype.listen = function () {
	var self = this;
	console.log('metro started');
	
	//TODO: listening functions
	self.clients = [];//redis.createClient(6379, '192.168.90.131');
	self.publisher = redis.createClient(6379, '192.168.90.131');
	
	self.subscriptionListen();	
	self.tasksListen();
}

Server.prototype.configure = function(callback) {
	callback();
}

Server.prototype.publish = function() {
	var self = this;
	
	return function(queue, message) {
		self.publisher.publish(queue, JSON.stringify(message));
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
	
	//self.client.on('ready', function() {
		_.each(self.subscriptions, function(subscription) {
			var config = subscription.path.split('/');
			var exchangeName = config[0];
			var routingKey = config[1];
			var queueName = config[2];
			
			var client = self.clients[self.clients.length] = redis.createClient(6379, '192.168.90.131');
			
			client.on('message',function(channel, message) {
				console.log('init: ' + message);
				var publisher = self.publish();
				var envolope = { body: message }; 
				publisher(subscription.name + '.' + subscription.workflow.tasks[0].queue, envolope);
			});
			
			client.subscribe(queueName);
			console.log('workflow: ' + queueName);
			
			client.on('subscribe', function(channel, message){
				self.publisher.publish(queueName, "ASDFASD");
			});
		});
	//});
}

Server.prototype.tasksListen = function() {
	var self = this;
	
	//self.client.on('ready', function() {	
		_.each(self.subscriptions, function(subscription) {
			_.each(subscription.workflow.tasks, function(step) {
	
				var queueName = subscription.name + '.' + step.queue;
			
				var client = self.clients[self.clients.length] = redis.createClient(6379, '192.168.90.131');
								
				client.on('message', function(channel, message) {
					console.log(step.type);
					//console.log(message);
					
					var envolope = JSON.parse(message);
					var req = new request(envolope);
					var res = new response(subscription.workflow, envolope);
				
					res.publish = self.publish();
					
					step.callback(req, res);
				});
				
				client.subscribe(queueName);
				
				console.log('task: ' + queueName);
			});
		});
	//});
}
