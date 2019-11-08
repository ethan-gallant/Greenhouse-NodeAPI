'use strict';
module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    serial: DataTypes.STRING,
    maxWaterDaily: DataTypes.INTEGER,
    waterSeconds: DataTypes.INTEGER,
    queriesHourly: DataTypes.INTEGER,
    connected: DataTypes.BOOLEAN,
    connectedAt: DataTypes.DATE
  }, {});
  Client.associate = function(models) {
      Client.hasMany(models.Log, {foreignKey:"client_id"})
  };
  return Client;
};