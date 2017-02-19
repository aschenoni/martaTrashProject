var express = require('express');
var router = express.Router();
var db = require('../server_modules/db.js');

router.get('/', function(req,res){
	db.query('SELECT * FROM trash_project.Location', function(err, result){
		if(err){
			res.status(400).send(err);
		} else {
			res.json(result);
		}
	});
});

module.exports = router;