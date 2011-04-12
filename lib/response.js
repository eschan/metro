var _ = require('underscore')

var response = exports = module.exports = function(workflow) {
	this.init(workflow);
	
	return this;
}

response.prototype.init = function(workflow) {
	var self = this;
	self.workflow = workflow;
}

response.prototype.write = function(data) {

}

response.prototype.next = function(task) {

}
