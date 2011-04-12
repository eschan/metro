var fs = require('fs')
var _ = require('underscore')

var workflow = exports = module.exports = function Workflow() {
	this.init();
};

workflow.prototype.init = function() {
	var self = this;
	
	self.steps = [];
	
	self.setupTasks();
}

workflow.prototype.setupTasks = function() {
	var self = this;
	console.log('setting up tasks...');
	
	var files = fs.readdirSync('./lib/tasks');
	
	_.each(files, function(filename) {
		var name = filename.split('.')[0];
		
		self.__defineGetter__(name, function() {
			return function(queue, fn) {			
				var self = this;
				self.steps[self.steps.length] = {
					type: name,
					queue: queue,
					callback: fn
				};
			}
		});
	});
}
