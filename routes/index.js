const express = require('express');
const router = express.Router();
const pjson = require('../package.json');

router.get('/', function(req, res, next) {
   res.send({
       "api_version":pjson.version,
       "description": "This is the base API url for IOT Greenhouse",
       "contributors": pjson.contributors
    }).end();
});

router.get('/test',function(req,res,next) {

    res.send("lol xd");
});

module.exports = router;
