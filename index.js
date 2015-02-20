var http = require('http');
var bl = require('bl');
var fs = require('fs');

function cors(q, r, next) {
	r.setHeader('Access-Control-Allow-Origin', '*');
	r.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE, OPTIONS'
	);
	r.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	if (q.method === 'OPTIONS') {
		r.end();
	} else {
		next();
	}
}

function DefaultTestNamer (name) {
	return name;
}

function ApprovalsServer(config) {
	config = config || {};
	config.port = config.port || 1338;
	config.path = config.path || './';
	config.testNamer = config.testNamer || DefaultTestNamer;

	var approvals = require('approvals');
	if (config.approvals) {
		approvals.configure(config.approvals);
	}

	var server = http.createServer();
	server.on('request', function(q, r) {
		cors(q, r, function() {
			console.log(q.method, q.url);
			if (q.url === '/verify') {
				q.pipe(bl(function(err, data) {
					var results = JSON.parse(data.toString());
					var testName = config.testNamer(results.testName);
					try {
						approvals.verify(config.path, testName, results.data);
						console.log(results.testName + ' - Success');
						r.writeHead(200);
						r.end();
					} catch(e) {
						console.log(results.testName + ' - Failed - ' + e);
						r.writeHead(400);
						r.end();
					}
				}));
			}
		});
	});

	server.listen(config.port, function (res) {
		var serverUrl = 'http://localhost:'+config.port;
		console.log('Started Approvaltests server at "'+serverUrl+'".');
		console.log('Path:', config.path);
		console.log('');
		console.log('To verify, do a POST to "'+serverUrl+'/verify".')
		console.log('Parameters:', JSON.stringify({ testName: "The name of the test", data: "String to compare" }, null, 2));
		console.log('');
		console.log('Waiting for requests...');
	});

	return server;
}

module.exports = ApprovalsServer;