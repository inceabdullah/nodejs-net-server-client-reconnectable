const { Socket } = require('net');
const addresses = [
    {host: "localhost", port:80, servername:"server1"},
    {host: "localhost", port:81, servername:"server2"}
];
const dataStack = {
    server1: [],
    server2: []
};
addresses.forEach(({host,port,servername})=>{
    let connectionNumber = 0;
    const tryToConnect = () => {
        connectionNumber++;
        console.log(`New connection count for ${servername}: ${connectionNumber}`);
        const socket = new Socket();
        socket.setTimeout(60000);
        const connection = socket.connect(port, host);
        let HBInt;
        connection.on("connect", ()=>{
            console.log("Connected to " + host + ":" + port);
            HBInt = setInterval(()=>heartBeat(socket, servername), 5*1000);
            connection.on('data', (data) => {
                console.log(data.toString());
                dataStack[servername].push(data);
                Object.keys(dataStack).forEach(servername=>console.log({[servername + " data got"]: dataStack[servername].length}));
            });
            connection.on('end', () => {
                console.log("Disconnected from " + servername);
                clearInterval(HBInt);
                setTimeout(tryToConnect, 5000);
              })
        });
        connection.on("error", (err)=>{
            console.log("Got connection error on " + servername);
            console.log({code: err.code});
            clearInterval(HBInt);
            setTimeout(tryToConnect, 5000);
        })
        socket.on('timeout', () => {
            console.log('socket timeout');
            socket.end();
            clearInterval(HBInt);
            setTimeout(tryToConnect, 5000);
        });
}
tryToConnect();
});

const heartBeat = (socket, servername) => {
    socket.write("heartbeat from " + servername);
}
