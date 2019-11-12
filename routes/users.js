const express = require('express');
const router = express.Router();
const {check,param ,validationResult} = require('express-validator');

const User = require("../models").User;
/* GET users listing. */
router.get('/', function (req, res, next) {
    if (!req.is_admin) {
        res.json({success: false, message: "You must be an admin to get all users."});
        return;
    }
    User.findAll().then((data) => {
        res.send(data).end();
    });
});

router.post('/', [
    // username must be 5 chars long at minimum
    check('username').isLength({min: 5}),
    // password must be at least 5 chars long
    check('password').isLength({min: 5}),
    //
    check('isadmin').isBoolean()
], function (req, res, next) {
    if (!req.is_admin) {
        res.json({success: false, message: "You must be an admin to create users."});
        return;
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    User.create({
        username: req.body.username,
        password: req.body.password,
        isadmin: req.body.isadmin
    })
        .then(user => res.status(201).send(user).end())
        .catch(error => res.status(400).send(error).end());
});

router.get('/:id', [
    param("id").isInt({ gte: 0})
], function (req, res, next) {
    if (!req.is_admin) {
        res.json({success: false, message: "You must be an admin to get specific."});
        return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    User.findByPk(req.params.id)
        .then(user => {
            if (user)
                res.send(user).end();
            else
                res.status(404).send({"err": "user not found in the db."}).end()
        })
        .catch(error => res.status(500).send({"error": error}).end())
});

router.put('/:id', [
    param("id").isInt({ gt: 0}).exists(),
    check('username').isLength({min: 5}).optional(),
    // password must be at least 5 chars long
    check('password').isLength({min: 5}).optional(),
    //
    check('isadmin').isBoolean()
], function (req, res, next) {
    if (!req.is_admin) {
        res.json({success: false, message: "You must be an admin to update users."});
        return;
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    User.findByPk(req.params.id)
        .then(user => {
            if (user){
                user.update(req.body)
                    .then(updatedUser=>res.status(201).send(updatedUser).end())
                    .catch(error=>res.status(500).send({err: error}).end());
            }
            else
                res.status(404).send({"err": "user not found in the db."}).end()
        })
        .catch(error => res.status(500).send({"error": error}).end())
});



router.delete('/:id', [
    param("id").isInt({ gte: 0})
], function (req, res, next) {
    if (!req.is_admin) {
        res.json({success: false, message: "You must be an admin to delete users."});
        return;
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    User.findByPk(req.params.id)
        .then(user => {
            if(user)
                user.destroy().then(data=>res.status(200).send(data).end());
            else
                res.status(404).send({"error": "user was not found in the db"}).end();
        })
        .catch(error => {
            if(error)
                res.status(500).send({"error": error}).end();
            else
                res.status(404).send({"error": "user was not found in the db"}).end();
        });
});
module.exports = router;
