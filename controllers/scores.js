var con;
var mysql;

exports.topTen = function(req, resp) {
	var cb = function(rsp, rv){
		rsp.send(rv.msg);
	};
	
	grabTopTen(resp, cb);
};
exports.addScore = function(req, resp) {
	var username = req.params.username;
	var email = req.params.email;
	var score = parseInt(req.params.score);

	var cb = function(rsp, rv) {
		rsp.send(rv.msg);
	};
	tryAdd(username, email, score, resp, cb);
};
exports.updateScore = function(req, resp) {
	var username = req.params.username;
	var email = req.params.email;
	var score = parseInt(req.params.score);

	var cb = function(rsp, rv) {
		rsp.send(rv.msg);
	};
	tryUpdate(username, email, score, resp, cb);
};

exports.setMS = function(ms){
	mysql = ms;
}
exports.setConnection = function(c){
	con = c;
};

function clean(s) {
	return mysql.escape(s);
}

function grabTopTen(response, callback) {
	var rv = {msg: ''};
	con.query('SELECT name, score FROM Scores ' +
		'WHERE score = (SELECT MAX(score) FROM Scores s WHERE s.name = Scores.name) ' +
		'ORDER BY score DESC LIMIT 10', 
		function(err, result) {
			if (err) {
				console.log(err);
				rv.msg = 'Error retreiving top ten scores';
			} else {
				rv.msg = result;
			}
			callback(response, {msg: result});
		}
	);
}

function tryAdd(name, email, score, response, callback) {
	var n = clean(name);
	var e = clean(email);
	var s = clean(score);
	var rv = {msg: ''};

	con.query('INSERT INTO Users (name, email) VALUES ' +
		'(' + n + ', ' + e + ')', 
		function(err, result) {
			if (err) {
				console.log(err);
				rv.msg = 'User: ' + n + ' already exists.';
				callback(response, rv);
			} else {
				con.query('INSERT INTO Scores (name, score) VALUES ' +
					'(' + n + ', ' + s + ')',
					function(err, result) {
						if (err) {
							console.log(err);
							rv.msg = 'Error inserting Score: ' + s + ' for User: ' + n + '.';
						} else {
							rv.msg = 'New User: ' + n + ' added successfully.';
						}
						callback(response, rv);
					}
				);
			}
		}
	);
}
function tryUpdate(name, email, score, response, callback) {
	var n = clean(name);
	var e = clean(email);
	var s = clean(score);
	var rv = {msg: ''};

	// make sure user exists before updating their score info
	con.query('SELECT COUNT(name) AS count FROM Users WHERE name='+ n,
		function(err, result) {
			if (err) {
				console.log(err);
				rv.msg = 'Error checking User: ' + n + ' exists';
				callback(response, rv);
			} else {
				if (result[0].count == 0) {
					// User does not exist.
					rv.msg = 'Updating user scores failed. User: ' + n + ' does not exist.'
					callback(response, rv);
				} else {
					con.query('INSERT INTO Scores (name, score) VALUES ' +
						'(' + n + ', ' + s + ')', 
						function(err, result) {
							if (err) {
								console.log(err);
								rv.msg = 'Error inserting Score: ' + s + ' for User: ' + n + '.';
							} else {
								rv.msg = 'User: ' + n + ' scoring info updated!'; 
							}
							callback(response, rv);
						}
					);
				}
			}
		}
	);
}

