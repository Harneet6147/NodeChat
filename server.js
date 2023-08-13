const net = require("net");
const PORT = 3080;
const HOST = "127.0.0.1";

const server = net.createServer();
const clients = [];

server.on("connection", (socket) => {
    console.log("A new Connection!");

    const clientID = clients.length + 1;
    clients.map((client) => {
        client.socket.write(`User ${clientID} Joined the room!`);
    });

    socket.write(`id-${clientID}`);

    socket.on("data", (chunk) => {
        const str = chunk.toString("utf-8");
        const id = str.substring(0, str.indexOf('-'));
        const msg_data = str.substring(str.indexOf("-message-") + 9);
        clients.map((client) => {
            client.socket.write(`> User ${id}: ${msg_data}`);
        })
    });

    socket.on("end", () => {
        clients.map((client) => {
            client.socket.write(`User ${clientID} left the room!`);
        });
    });

    clients.push({ id: clientID.toString(), socket });
});

server.on("error", (err) => {
    console.log(err);
})

server.listen(PORT, HOST, () => {
    console.log("Server started at", server.address());
})