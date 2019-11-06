'use strict';
module.exports = (sequelize, DataTypes) => {
  const ApiKey = sequelize.define('ApiKey', {
    apiKey: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  ApiKey.associate = function(models) {
    // associations can be defined here
  };
  return ApiKey;
};