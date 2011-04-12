var metro = require('./lib/metro');

var app = metro.createServer();


app.subscribe('/testexchange/test.route/tesetqueue', 'workflow1', function(workflow) {

	workflow.http('stepone', function(http, data) {
		console.log('stepone invoked');
		app.publish('workflow1.steptwo', 'test');
	});
	
	workflow.log('steptwo', function(logger, data) {
		console.log('steptwo invoked');
		app.publish('workflow1.stepthree', 'test');
	});
	
	workflow.http('stepthree', function(http, data) {
		console.log('stepthree invoked');
	});
	
	workflow.code('stepfour', function(data) {
		console.log('stepfour invoked');
	});
});

app.subscribe('/testexchange/test.route/tesetqueue2', 'workflow2', function(workflow) {

	workflow.http('stepone', function(http, data) {
		console.log('stepone invoked');
	});
	
	workflow.log('steptwo', function(logger, data) {
		console.log('steptwo invoked');
	});
	
	workflow.http('stepthree', function(http, data) {
		console.log('stepthree invoked');
	});

});

app.listen();


