const Client = require("../models").Client;
const ClientRequest = require("../models").ClientRequest;
const moment = require('moment');

module.exports = (io) => {

    io.on('connection', (socket) => {
        console.log("Client connected");
        socket.on('disconnect', function () {
            console.log(JSON.stringify(socket.db_client));
            if(socket.db_client){
                socket.db_client.update({
                    connectedAt: moment(),
                    connected:false
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
                        }
                    });
                }
                if (entries.length >= 1) {
                    socket.emit("login-success", true);
                    socket.db_client = entries[0];
                    socket.db_client.update({
                        connectedAt: moment(),
                        connected:true
                    });
                    console.log("USER LOGIN SUCCESS")
                }
                else {
                    socket.emit("login-success", false);
                    console.log("USER LOGIN FAILED. INVALID SERIAL");
                }
            });

        });
        socket.on('stats', function (data) {
            console.log("DATA GIVEN VIA STATS" + JSON.stringify(data));
        });


    });
}


