var fs = require('fs')
var _ = require('underscore')

var taskFiles = fs.readdirSync('./lib/tasks');
var tasks = [];
_.each(taskFiles, function(t) {
	var name = t.split('.')[0];
	tasks[tasks.length] = name;
});

var workflow = exports = module.exports = function Workflow() {
	this.init();
};

workflow.prototype.init = function() {
	var self = this;
	
	self.steps = [];
	
	self.setupTasks();
}

//TODO: need to optimize, this is being called for every workflow instance
workflow.prototype.setupTasks = function() {
	var self = this;

	_.each(tasks, function(name) {		
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
