var metro = require('./lib/metro');

var app = metro.createServer();

app.subscribe('testexchange/test.route/tesetqueue', 'workflow1', function(workflow) {

	workflow.http('stepone', function(req, res) {
		console.log('stepone invoked');
		console.log(req.body);
		res.write('responseone', 'oh yeah!');
		res.next('steptwo');
	});
	
	workflow.log('steptwo', function(req, res) {
		console.log('steptwo invoked');
		console.log(req.body);
		res.write('responsetwo', 'oh yes!');
		res.next('stepthree', 'test');
	});
	
	workflow.http('stepthree', function(req, res) {
		console.log('stepthree invoked');
		console.log(req.body);
		res.write('responsethree', 'oh man!');
		res.next('stepfour', 'test');
	});
	
	workflow.code('stepfour', function(req, res) {
		console.log('stepfour invoked');
		console.log(req.body);
	});
});

app.listen();


