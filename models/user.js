'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      isadmin: DataTypes.BOOLEAN
  }, {
      defaultScope: {
          attributes: { exclude: ['password'] },
      },
      scopes: {
          withPassword: {
              attributes: { },
          }
      }
  });
  User.associate = function(models) {
    // associations can be defined here
  };


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