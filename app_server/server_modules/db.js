var mysql = require('mysql');
var nconf = require('nconf');
nconf.file({file: 'config.json'});

console.log(nconf.get('dbHost'))
var pool = mysql.createPool({
	connectionLimit: 10,
	connectTimeout  : 60 * 60 * 1000,
    acquireTimeout   : 60 * 60 * 1000,
	timeout: 60*60*1000,
	host: nconf.get('dbHost'),
	port: nconf.get('dbPort'),
	user: nconf.get('dbUser'),
	password: nconf.get('dbPassword'),
	debug: nconf.get('isDebug'),
	timezone: 'utc'
})

pool.query('SELECT 1 + 1 AS solution', function(err, result){
	if(err){
		console.log(err);
	} else {
		console.log('Database connection succesful')
	}
});


module.exports = pool;