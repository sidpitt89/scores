exports.checkTable = function(success) {
	//set up db connection
	var mysql = require('mysql');
	var cfg = require('./db_config');
	var con = mysql.createConnection({
  		host: cfg.host,
  		user: cfg.user,
		password: cfg.password,
		database: cfg.database
	});

	con.connect(function(err){
  		if(err){
    		console.log('checkTable: Error connecting to database');
    		return;
  		}
	});

	con.query('CREATE TABLE IF NOT EXISTS Users ( ' +
				'name VARCHAR(100) NOT NULL,' + 
				'email VARCHAR(255) NOT NULL, ' +
				'PRIMARY KEY (name))',
				function(err, result) {
					if (err) {
						console.log(err);
					}
				}
	);
	con.query('CREATE TABLE IF NOT EXISTS Scores ( ' +
				'name VARCHAR(100) NOT NULL, ' + 
				'score int NOT NULL, '+
				'FOREIGN KEY (name) REFERENCES Users(name))',
				function(err, result) {
					if (err) {
						console.log(err);
					}
				}
	);

	// If table is empty, populate it with some dummy data
	con.query('SELECT COUNT(*) AS count FROM Users',
		function(err, result) {
			if (err) {
				console.log(err);
			} else {
				if (result[0].count == 0) {
					console.log('Users empty. Filling with dummy values.');
					con.query('INSERT INTO Users (name, email) VALUES' +
						'(?, ?), (?, ?), (?, ?), (?, ?),' +
						'(?, ?), (?, ?), (?, ?), (?, ?),' +
						'(?, ?), (?, ?)', 
						['marvin', 'paranoid@android.com',
						'b', 'b@a.com',
						'c', 'c@a.com',
						'd', 'd@a.com',
						'e', 'e@a.com',
						'f', 'f@a.com',
						'g', 'g@a.com',
						'h', 'h@a.com',
						'i', 'i@a.com',
						'j', 'j@a.com'],
						function(err, result) {
							if (err) {
								console.log(err);
							} else {
								con.query('INSERT INTO Scores (name, score) VALUES' +
									'(?, ?), (?, ?), (?, ?), (?, ?),' +
									'(?, ?), (?, ?), (?, ?), (?, ?),' +
									'(?, ?), (?, ?), (?, ?), (?, ?), (?, ?)', 
									['marvin', 42,
									'b', 9,
									'c', 8,
									'd', 7,
									'e', 6,
									'f', 5,
									'g', 4,
									'h', 3,
									'i', 2,
									'j', 1,
									'marvin', 100,
									'b', 109,
									'c', 4],
									function(err, result) {
										if (err) {
											console.log(err);
										} else {
											con.end(function(err) {
												success();
											});
										}
									}
								);	
							}
						});
				} else {
					con.end(function(err) {
						success();
					});
				}
			}
		}
	);	
};
