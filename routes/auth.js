const express = require('express');
const router = express.Router();
const {check, param, validationResult} = require('express-validator');
const jwthandler = require('../jwthandler');
const User = require('../models').User;
const ApiKey = require('../models').ApiKey;
const jwt = require('jsonwebtoken');

router.post('/getjwt', [
    check('username').isLength({min: 1}),
    // password must be at least 5 chars long
    check('password').isLength({min: 1}),
], function (req, res, next) {
    User.findAll({
        limit: 1,
        where: {
            username: req.body.username
        }
    }).then((data) => {
        if (data.length <= 0) {
            res.status(401).send({"err": "invalid login"}).end();
        } else {
            data[0].validatePassword(req.body.password)
                .then((success) => {
                    if (success) {
                        const token = jwt.sign({
                            id: data[0].id,
                            is_admin: data[0].isadmin
                        }, process.env.JWT_SECRET, {expiresIn: '1h'}); // change to extend time before auto logout
                        res.json({status: "success", message: "user found!!!", data: {user: data[0].id, token: token}});
                    } else {
                        res.status(401).send({"err": "invalid login"}).end();
                    }
                });
        }
    });
});

router.post("/renew", jwthandler.verifyJWT, (req, res, next) => {
    if (req.user_id < 0) {
        res.json({status: "failure", message: "YOU CANNOT RENEW AN API KEY. Please do so in the admin panel."});
    }
    const token = jwt.sign({id: req.user_id, is_admin: req.is_admin}, process.env.JWT_SECRET, {expiresIn: '1h'}); // change to extend time before auto logout
    res.json({
        success: true,
        message: "Key successfully renewed. Please cease use of the current key.",
        data: {
            token: token
        }
    });
    jwthandler.blacklistToken(req.token);
});

router.post('/apikeys', [
    jwthandler.verifyJWT,
    check('name').isLength({min: 1}),
    check('notes').isLength({min: 0}),
], (req, res, next) => {
    if (req.user_id < 0) {
        res.json({success: false, message: "Only Users May Create API Keys"});
        return;
    }
    if (!req.is_admin) {
        res.json({success: false, message: "You must be an admin to create API keys"});
        return;
    }
    ApiKey.create({name: req.body.name, notes: req.body.notes, userId: req.user_id}).then((key) => {
        const token = jwt.sign({
            id: key.id * -1,
        }, process.env.JWT_SECRET);
        key.update({apiKey: token});
        res.json({
            success: true,
            message: "Key successfully created in the database",
            data: {
                token: token
            }
        });
    }).catch(() => res.status(500).json({
        success: false,
        message: "An internal server error occurred when trying to create the key in the database."
    }));
});

router.delete('/apikeys/:id', [
    jwthandler.verifyJWT,
    param('id').isInt({min: 0}),
], (req, res, next) => {
    if (req.user_id < 0) {
        res.json({success: false, message: "Only Users May Delete API Keys"});
        return;
    }
    if (!req.is_admin) {
        res.json({success: false, message: "You must be an admin to delete API keys"});
        return;
    }

    ApiKey.destroy({
        where: {
            id: req.params.id
        }
    }).then((result)=>{
        if(result <= 0){
            res.status(404).json({
                success: false,
                message: "Could not find a key with the given ID!",
            });
        } else {
            res.json({
                success: true,
                message: "Key successfully removed from the database",
            });
        }
    }).catch(()=>{
        res.json({
            success: false,
            message: "An internal server error occurred!"
        });
    });

});

module.exports = router;
