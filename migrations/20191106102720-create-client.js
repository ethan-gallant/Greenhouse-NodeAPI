'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Clients', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            serial: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            maxWaterDaily: {
                type: Sequelize.INTEGER,
                defaultValue: 6,
                allowNull: false
            },
            waterSeconds: {
                type: Sequelize.INTEGER,
                defaultValue: 2,
                allowNull: false
            },
            queriesHourly: {
                type: Sequelize.INTEGER,
                defaultValue: 240,
                allowNull: false
            },
            connected: {
                type: Sequelize.BOOLEAN,
                defaultValue: 0,
                allowNull: false
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
        return queryInterface.dropTable('Clients');
    }
};