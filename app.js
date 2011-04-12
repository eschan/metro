var metro = require('./lib/metro');

var app = metro.createServer();


app.subscribe('/testexchange/test.route/tesetqueue', 'workflow1', function(workflow) {

	workflow.http('stepone', function(req, res) {
		console.log('stepone invoked');
		res.publish('workflow1.steptwo', 'test');
	});
	
	workflow.log('steptwo', function(req, res) {
		console.log('steptwo invoked');
		res.publish('workflow1.stepthree', 'test');
	});
	
	workflow.http('stepthree', function(req, res) {
		console.log('stepthree invoked');
		res.publish('workflow1.stepfour', 'test');
	});
	
	workflow.code('stepfour', function(req, res) {
		console.log('stepfour invoked');
	});
});

app.listen();


