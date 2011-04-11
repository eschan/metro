var metro = require('../lib/metro')
	, assert = require('assert')
	, should = require('should');


module.exports = {	
	'test createServer() precedence': function() {
		var app = metro.createServer(function() {
		
		});
		
		assert.response(true);
	}
}
