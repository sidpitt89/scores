var express = require('express');
var app = express();
var ct = require('./checktable');

var proceed = function() {
	require('./routes')(app);
	app.listen(3001);
	console.log('Listening on port 3001');
};

// Make sure tables are ready to use and start
// the server with the callback.
ct.checkTable(proceed);
