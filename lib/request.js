var _ = require('underscore')

var request = exports = module.exports = function(body) {
	this.init(body);
}

request.prototype.init = function(body) {
	var self = this;
	self.body = body;
}


