# approvals-server

A simple node HTTP server for running approval tests from the browser.

## Install

If you use npm, then install the package via npm.

    npm install approvals-server

If you're not using npm, simply copy the file `index.js` to a directory of your choice.

## Server setup

	var approvalsServer = require('approvals-server')();

### Configuring the server

	var approvalsServer = require('approvals-server')({
		approvals: {},		// See https://github.com/approvals/Approvals.NodeJS#config-override for all config options
		port: 1338,			// Default port
		path: './'			// Default path
	});

If you need to you can manipulate the filenames by overriding the testNamer function like this:
	
	var config = {
		testNamer: function (name) {
			return name.replace(/\W+/g, '-');
		}
	}

## Verify

To verify, do a POST to "http://localhost:1339/verify".

Parameters:

	{
	  "testName": "The name of the test",
	  "data": "String to compare"
	}

### Verification example

The simplest thing possible is to do something like this.

	function verify(test, data) {
		var xhr = new XMLHttpRequest();
		xhr.open('post', 'http://localhost:1339/verify', false);
		xhr.send(stringify({ testName: test, data: data }));
		return xhr.status === 200;
	}

	var data = {
		"Name": "Kristoffer",
		"Age": "Unknown"
	};

	verify('MyTest', JSON.stringify(data, null, 2));

### More about Approvaltests

http://approvaltests.com