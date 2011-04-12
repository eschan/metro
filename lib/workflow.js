var fs = require('fs')
var _ = require('underscore')

var taskFiles = fs.readdirSync('./lib/tasks');
var tasks = [];
_.each(taskFiles, function(t) {
	var name = t.split('.')[0];
	tasks[tasks.length] = name;
});

var workflow = exports = module.exports = function Workflow(name) {
	this.init(name);
};

workflow.prototype.init = function(name) {
	var self = this;
	self.name = name	
	self.initTasks();
}

workflow.prototype.initTasks = function() {
	var self = this;
	self.tasks = [];
	
	_.each(tasks, function(name) {		
		self.__defineGetter__(name, function() {
			return function(queue, fn) {			
				var self = this;

				//TODO: This function can do alot more work than just this:
				// it should:
				//	create an instance of task type
				//	inject function call back to the task
				
				self.tasks[self.tasks.length] = {
					type: name,
					queue: queue,
					callback: fn
				};
			}
		});
	});
}
