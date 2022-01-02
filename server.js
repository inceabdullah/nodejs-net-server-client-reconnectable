const utils = require("./utils");
const net = require('net');
const server1 = net.createServer((socket)=>serverSoc(socket, "server-1"));
const server2 = net.createServer((socket)=>serverSoc(socket, "server-2"));
const serverErr = e=>{throw e};
server1.on("error", serverErr);
server2.on("error", serverErr);

server1.listen(80, "0.0.0.0", ()=>console.log("listening ", server1.address()));
server2.listen(81, "0.0.0.0", ()=>console.log("listening ", server2.address()));
const serverSoc = async (socket, servername) => {
    let count = 0;
    let connection = true;
    socket.on('end',() => {
        connection = false;
        console.log('client disconnected from ' + servername);
      });
    socket.on('data', (data)=>{
        console.log({data: data.toString()});
    });
    while (connection) {
        count++;
        socket.write(`${count}. from ${servername}\n${new Date().toString()}\r\n\n`);
        await utils.waitMs(utils.getRandomInt(500,5000));// to make async
    }
  }