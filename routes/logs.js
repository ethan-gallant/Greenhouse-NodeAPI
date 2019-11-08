const express = require('express');
const router = express.Router();
const moment = require('moment');
const {check,param ,validationResult} = require('express-validator');
const Log = require("../models").Log;
const Client = require("../models").Client;


/* GET all logs of all clients page. */
router.get('/', function(req, res, next) {
    Log.findAll().then((data) => {
        res.send(data).end();
    }).catch(err=>res.status(500).send({"err":err}).end());
});

// get date time range of all logs for all clients
router.get('/dtRange',[
    check('start').custom(val=> {
        return moment(val).isValid()
    }).exists(),
    // password must be at least 5 chars long
    check('end').custom(val=> {
        return moment(val).isValid()
    }).optional(),
], function (req,res,next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let start_date = moment(req.query.start);
    let end_date = req.query.end ? moment(req.query.end) : moment(); // if no end date specified use now :)

    Log.findAll({
        where: {
            createdAt: { gte: start_date.toISOString(), lte: end_date.toISOString()},
        }
    }).then(data=>res.status(200).send({
        "start_date": start_date.toISOString(),
        "end_date":end_date.toISOString(),
        "results":data})
        .end())
        .catch(err => res.status(500).send({"error":err}).end());
});

//get logs for a specific client
router.get('/:clientId', [
    param("clientId").isInt({ gte: 0})
],function (req,res,next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    Client.findByPk(req.params.clientId)
        .then(client => {
            if (client)
                res.send(client).end();
            else
                res.status(404).send({"err": "log not found in the db."}).end()
        });
    console.log("test");
});

module.exports = router;
