'use strict';
module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define('Log', {
    time: DataTypes.DATE,
    soil_moisture: DataTypes.INTEGER,
    temperature: DataTypes.INTEGER,
    light: DataTypes.INTEGER,
    water_pumped: DataTypes.INTEGER,
    humidity: DataTypes.INTEGER,
    forced: DataTypes.BOOLEAN
  }, {});
  Log.associate = function(models) {
    // associations can be defined here
  };
  return Log;
};