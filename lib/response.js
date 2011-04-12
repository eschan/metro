var _ = require('underscore')

var response = exports = module.exports = function(workflow, body) {
	this.init(workflow, body);
}

response.prototype.init = function(workflow, body) {
	var self = this;
	self.workflow = workflow;
	self.body = body;
}

response.prototype.write = function(data) {
	//THIS IS WHERE WE APPEND THE BODY
}

response.prototype.publish;

response.prototype.next = function(task) {
	var self = this;
	
	console.log('next: ' + self.body);
	
	self.publish(self.workflow.name + '.' + task, self.body);
}
