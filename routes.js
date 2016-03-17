module.exports = function(app) {
	//set up db connection
	var mysql = require('mysql');
	var cfg = require('./db_config');
	var con = mysql.createConnection({
  		host: cfg.host,
  		user: cfg.user,
		password: cfg.password,
		database: cfg.database
	});

	var ctrl = require('./controllers/scores');
	con.connect();
	ctrl.setMS(mysql);
	ctrl.setConnection(con);
	app.get('/scores/topten', ctrl.topTen);
	app.post('/scores/:username/:email/:score', ctrl.addScore);
	app.put('/scores/:username/:email/:score', ctrl.updateScore);
}