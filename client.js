const net = require("net");
const readline = require("readline/promises");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let id;

const clearLine = (dir) => {
    return new Promise((resolve, reject) => {
        process.stdout.clearLine(dir, () => {
            resolve();
        });
    });
};
const moveCursor = (dx, dy) => {
    return new Promise((resolve, reject) => {
        process.stdout.moveCursor(dx, dy, () => {
            resolve();
        });
    });
}

const socket = net.createConnection({ host: "127.0.0.1", port: 3080 }, async () => {
    console.log(`Connected to the Server!`);

    const enter_message = async () => {
        const message = await rl.question("Enter Message > ");
        // clearing the current line where input is being taken before writing it but
        // first cursor needs to be moved up
        await moveCursor(0, -1);
        await clearLine(0);
        socket.write(`${id}-message-${message}`);
    }

    enter_message();

    socket.on("data", async (chunk) => {

        console.log();
        await moveCursor(0, -1);
        await clearLine(0);

        if (chunk.toString("utf-8").substring(0, 2) === "id") {
            id = chunk.toString("utf-8").substring(3);
            console.log(`Your id number is ${id}`);
        } else {
            console.log(chunk.toString("utf-8"));
        }

        enter_message();
    });
});

socket.on("end", () => {
    console.log("Connection Ended!");
    socket.end();
});

