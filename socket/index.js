const time_to_auth = 10;

module.exports = (io)=>{


    io.on('connection',(socket)=>{
      socket.emit("please-authenticate");

    });
    io.on('authenticate',(data)=>{
        const serial = data.serial;

    });


};



