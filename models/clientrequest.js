'use strict';
module.exports = (sequelize, DataTypes) => {
  const ClientRequest = sequelize.define('ClientRequest', {
    mac: DataTypes.STRING
  }, {});
  ClientRequest.associate = function(models) {
    // associations can be defined here
  };
  return ClientRequest;
};