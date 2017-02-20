var express = require('express');
var router = express.Router();

router.get('/delivery-receipt-webhook', function(req, res) {
    console.log(req.query);
    handleWebhook(req.query, res);
});

router.post('/delivery-receipt-webhook', function(req, res) {
    console.log(req.body);
    handleWebhook(req.body, res);
});

function handleWebhook(params, res) {
    if (!params['status'] || !params['messageId']) {
        console.log('This is not a delivery receipt');
    } else {
        //This is a DLR, check that your message has been delivered correctly
        if (params['status'] !== 'delivered') {
            console.log("Fail:", params['status'], ": ", params['err-code']);
        } else {
            console.log("Success");
            console.log(params);
          /*
            * The following parameters in the delivery receipt should match the ones
            * in your request:
            * Request - from, dlr - to\n
            * Response - message-id, dlr - messageId
            * Request - to, Responese - to, dlr - msisdn
            * Request - client-ref, dlr - client-ref
           */
        }
    }
    res.sendStatus(200);
}

module.exports = router;