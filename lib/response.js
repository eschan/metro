var _ = require('underscore')

var response = exports = module.exports = function(workflow, body) {
	this.init(workflow, body);
}

response.prototype.init = function(workflow, body) {
	var self = this;
	self.workflow = workflow;
	self.body = body;
}

response.prototype.write = function(name, data) {
	var self = this;
	self.body[name] = data;
	//console.log(self.body);
}

response.prototype.publish;

response.prototype.next = function(task) {
	var self = this;
	
	self.publish(self.workflow.name + '.' + task, self.body);
}
