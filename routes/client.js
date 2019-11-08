const express = require('express');
const router = express.Router();
const {check, param, validationResult} = require('express-validator');

const Client = require("../models").Client;
//TODO: Add authentication to all these endpoints
/* GET clients listing. */
router.get('/', function (req, res, next) {
    Client.findAll().then((data) => {
        res.send(data).end();
    });
});

router.post('/', [
    // serial number must exist for socket connection
    check('serial').exists(),
    // max pump of water per minute for efficiency reasons
    check('maxWaterDaily').isInt({min: 0,max:1440}),
    //how many seconds should the water be enabled for
    check('waterSeconds').isInt({min:1,max:320}),
    //when should we water the thirsty boi
    check('waterThreshold').exists(),
    //how often to gather stats from this node every hour
    check('queriesHourly').isInt({min:1,max:18000})
], function (req, res, next) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    Client.create({
        serial: req.body.serial,
        maxWaterDaily: req.body.maxWaterDaily,
        waterSeconds: req.body.waterSeconds,
        waterThreshold: req.body.waterThreshold,
        queriesHourly: req.body.queriesHourly
    })
        .then(client => res.status(201).send(client).end())
        .catch(error => res.status(400).send({"err": error}).end());
});

router.get('/:id', [
    param("id").isInt({ gte: 0})
], function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    Client.findByPk(req.params.id)
        .then(client => {
            if (client)
                res.send(client).end();
            else
                res.status(404).send({"err": "client not found in the db."}).end()
        })
        .catch(error => res.status(500).send({"error": error}).end())
});

router.put('/:id', [
    // serial number must exist for socket connection
    check('serial').optional(),
    // max pump of water per minute for efficiency reasons
    check('maxWaterDaily').isInt({min: 0,max:1440}).optional(),
    //how many seconds should the water be enabled for
    check('waterSeconds').isInt({min:1,max:320}).optional(),
    //when should we water the thirsty boi
    check('waterThreshold').exists().optional(),
    //how often to gather stats from this node every hour
    check('queriesHourly').isInt({min:1,max:18000}).optional()
], function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    Client.findByPk(req.params.id)
        .then(client => {
            if (client){
                client.update(req.body)
                    .then(updatedClient=>res.status(201).send(updatedClient).end())
                    .catch(error=>res.status(500).send({err: error}).end());
            }
            else
                res.status(404).send({"err": "client not found in the db."}).end()
        })
        .catch(error => res.status(500).send({"error": error}).end())
});



router.delete('/:id', [
    param("id").isInt({ gte: 0})
], function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    Client.findByPk(req.params.id)
        .then(client => {
            if(client)
                client.destroy().then(data=>res.status(200).send(data).end());
            else
                res.status(404).send({"error": "client was not found in the db"}).end();
        })
        .catch(error => {
            if(error)
                res.status(500).send({"error": error}).end();
            else
                res.status(404).send({"error": "client was not found in the db"}).end();
        });
});

//Manually water a client
router.post("/:id/water", [
    param("id").isInt({ gte: 0}),
    check("waterSeconds").isInt({ gte: 0}),
], function (req,res,next){
    res.status(501).end()

//TODO: Water the thirsty boy for specified amount of seconds
});

router.get("/:id/status", [
    param("id").isInt({ gte: 0}),
], (req,res,next)=>{
    res.status(501).end()
//TODO: Get current stats over websocket
});

module.exports = router;
