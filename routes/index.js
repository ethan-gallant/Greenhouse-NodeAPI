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

module.exports = router;
