'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Logs', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            soilMoisture: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            temperature: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            light: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            waterPumped: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            humidity: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            forced: {
                allowNull: false,
                defaultValue: false,
                type: Sequelize.BOOLEAN
            },
            client_id: {
                allowNull: false,
                defaultValue: false,
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Logs');
    }
};