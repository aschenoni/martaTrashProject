var express = require('express');
var router = express.Router();
var otisMail = require('../server_modules/otis-mailer.js');
var db = require('../server_modules/db.js');

router.get('/:id', function(req,res){

	var querySet = {
		from: -1,
		to: -1,
		trashcan_id: req.params.id
	}
	db.query('INSERT INTO trash_project.Report SET ?', [querySet], function(err, result){
            err ? console.log(err) : console.log(result);

            db.query('SELECT * FROM trash_project.Report r ' + 
                'LEFT OUTER JOIN trash_project.Traschan t ON ' +
                't.id = r.trashcan_id LEFT OUTER JOIN trash_project.Location l ' +
                'ON l.id = t.location_id WHERE r.id = ?', [result.insertId], function(err, result){
                    var trashcanId = result[0].trashcan_id;
                    var location = result[0].shortname;
                    var locationDescript = result[0].location_description;

                    otisMail.hostname('email-smtp.us-east-1.amazonaws.com', true)
                        .credentials("AKIAJFE5ZQ36LTPKYUWA", "AjGSUyq7VvMYh6vQZHfzFzp5QTWubMHZgoFUK4tJGsSN")
                        .connect()
                        .email()
                        .text('A sensor reading indicates a full trashcan\n Trashcan ID: ' 
                            + trashcanId + '\n' +
                            'at ' + location + ' - ' + locationDescript)
                        .subject('Sensor Indiciation: Trashcan full id:' + trashcanId)
                        .to('marta.trash.report@aeonsoftworks.com')
                        .from('marta.trash.report@aeonsoftworks.com')
                        .send(function(err, result){
                            console.log(err || result);
                            res.send(200);
                        });
                })
        })


})


module.exports = router;