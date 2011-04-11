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

	var tasks = ['http', 'log', 'code'];
	
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
