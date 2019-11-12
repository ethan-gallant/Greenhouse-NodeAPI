'use strict';
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        isadmin: DataTypes.BOOLEAN
    }, {
        defaultScope: {
            attributes: {exclude: ['password']},
        },
        scopes: {
            withPassword: {
                attributes: {},
            }
        },
        instanceMethods: {}
    });
    User.associate = function (models) {
        // associations can be defined here
    };

    User.prototype.validatePassword = function (pass) {
        return new Promise((res,rej)=>{
            User.scope("withPassword")
                .findByPk(this.id).then((data)=>{
                    let currentPass = data.password;
                    bcrypt.compare(pass, currentPass).then((compareResult)=>{
                        res(compareResult);
                    })
            });
        })
    };


    User.beforeCreate((user, options) => {
        return bcrypt.hash(user.password, 10)
            .then(hash => {
                user.password = hash;
            })
            .catch(err => {
                throw new Error();
            });
    });


    return User;
};
/*BLOB,
    BOOLEAN,
    ENUM,
    STRING,
    UUID,
    DATE,
    DATEONLY,
    NOW,
    TINYINT,
    SMALLINT,
    INTEGER,
    BIGINT,
    REAL,
    FLOAT,
    TEXT*/