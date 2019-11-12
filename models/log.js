'use strict';
module.exports = (sequelize, DataTypes) => {
    const Log = sequelize.define('Log', {
        soilMoisture: DataTypes.INTEGER,
        temperature: DataTypes.INTEGER,
        light: DataTypes.INTEGER,
        waterPumped: DataTypes.INTEGER,
        humidity: DataTypes.INTEGER,
        forced: DataTypes.BOOLEAN,
    }, {});
    Log.associate = function (models) {
        Log.belongsTo(models.Client, {foreignKey: "client_id", as: "client"})
    };
    return Log;
};