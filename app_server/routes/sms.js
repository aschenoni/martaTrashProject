var otisMail = require('../server_modules/otis-mailer.js');
var express = require('express');
var router = express.Router();
var db = require('../server_modules/db.js');

router.get('/', function(req, res) {
    console.log(req.query);
    handleWebhook(req.query, res);
});

router.post('/', function(req, res) {
    console.log(req.body);
    handleWebhook(req.body, res);
});

function handleWebhook(params, res) {
    if (!params['messageId']) {
        console.log('This is not a delivery receipt');
    } else {
        //This is a DLR, check that your message has been delivered correctly
        var querySet = {
            from: params.msisdn,
            to: params.to,
            message_id: params.messageId,
            text: params.text,
            trashcan_id: getTrashcanFromText(params.text),
            timestamp: params["message-timestamp"]
        };

        function getTrashcanFromText(text){
            var idRegex = /([^\d]|^)(\d{4})([^\d]|$)/g;
            var match = idRegex.exec(text);
            console.log("regex match " + match[2]);
            return match[2];
        }

        db.query('INSERT INTO trash_project.Report SET ?', [querySet], function(err, result){
            err ? console.log(err) : console.log(result);
        })

        otisMail.hostname('email-smtp.us-east-1.amazonaws.com', true)
            .credentials("AKIAJFE5ZQ36LTPKYUWA", "AjGSUyq7VvMYh6vQZHfzFzp5QTWubMHZgoFUK4tJGsSN")
            .connect()
            .email()
            .text('There is a report of a full trashcan\n Trashcan ID: ' + getTrashcanFromText(text));
            .subject('subject line')
            .to('marta.trash.report@aeonsoftworks.com')
            .from('test@otisapp.com')
            .send(function(err, result){
                console.log(err || result);
            });

      /*
        * The following parameters in the delivery receipt should match the ones
        * in your request:
        * Request - from, dlr - to\n
        * Response - message-id, dlr - messageId
        * Request - to, Responese - to, dlr - msisdn
        * Request - client-ref, dlr - client-ref
       */
    }
    res.sendStatus(200);
}

module.exports = router;