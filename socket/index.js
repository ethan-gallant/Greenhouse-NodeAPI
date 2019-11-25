const Client = require("../models").Client;
const ClientRequest = require("../models").ClientRequest;
const Log = require("../models").Log;
const {Op} = require('sequelize');
const moment = require('moment');

module.exports = (io) => {

    io.on('connection', (socket) => {
        console.log("Client connected");
        socket.on('disconnect', function () {
            if (socket.stats_interval)
                clearInterval(socket.stats_interval);
            if (socket.db_client) {
                socket.db_client.update({
                    connectedAt: moment(),
                    connected: false
                });
            }
            console.log('Got disconnect!');
        });

        socket.on('log', function (log) {
            console.log("================DATA LOG SENT====================");
            console.log(JSON.stringify(log));
            console.log("=================================================");
        });
        socket.on('login', (data) => {
            console.log("Auth Data Requested: " + JSON.stringify(data));
            Client.findAll({
                limit: 1,
                where: {
                    serial: data.serial
                }
            }).then(function (entries) {
                if (entries.length <= 0) {
                    ClientRequest.findAll({
                        limit: 1,
                        where: {
                            mac: data.serial
                        }
                    }).then(function (requestEntries) {
                        if (requestEntries.length <= 0) {
                            ClientRequest.create({mac: data.serial});
                        } else {
                            requestEntries[0].update(); // Set our updated at time to be now
                        }
                    });
                }
                if (entries.length >= 1) {
                    socket.emit("login-success", true);
                    socket.db_client = entries[0];
                    socket.db_client.update({
                        connectedAt: moment(),
                        connected: true
                    });
                    socket.stats_interval = setInterval(() => {
                        socket.emit('send-stats')
                    }, 60 * 1000 * 60 / entries[0].queriesHourly);
                    console.log("USER LOGIN SUCCESS")
                }
                else {
                    socket.emit("login-success", false);
                    console.log("USER LOGIN FAILED. INVALID SERIAL");
                }
            });

        });
        socket.on('stats', function (data) {
            if (socket.db_client) {
                socket.db_client.reload().then(() => {
                    Log.create({
                        soilMoisture: data.soil_moisture ? data.soil_moisture : 0,
                        temperature: data.temperature ? data.temperature : 0,
                        light: data.light ? data.light : 0,
                        humidity: data.humidity ? data.humidity : 0,
                        client_id: socket.db_client.id,
                        forced: false
                    }).then((newLog)=>{
                        Log.findAll({
                            where:{
                                createdAt: {
                                    [Op.gte]: moment().subtract(7, 'days').toDate()
                                }
                            }
                        }).then((logRows) => {
                            let waterAmount = 0;

                            logRows.forEach((row) => {
                                waterAmount += row.waterPumped;
                            });
                            console.log("WATER AMOUNT IS " + waterAmount);
                            let meetsThreshold = socket.db_client.waterThreshold >= data.soil_moisture;
                            let maxedWater = waterAmount < socket.db_client.maxWaterDaily;
                            if (meetsThreshold && maxedWater) {
                                console.log("CONDITIONS TRUE " + waterAmount);
                                socket.emit("water-plant", socket.db_client.waterSeconds);
                                newLog.update({waterPumped: 1});
                            }
                        });
                    });
                    console.log("DATA GIVEN VIA STATS FROM " + socket.db_client.serial + " :" + JSON.stringify(data));
                });
            }
        });
    });
};


