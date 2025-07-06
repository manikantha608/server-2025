const { Server } = require("socket.io");
const authSocket = require("./middlewares/authSocket.js");

// Socket Handlers
const disconnectHandler = require("./socketHandlers/disconnectHandler.js");
const chatHistoryHandler = require("./socketHandlers/getMessageHistoryHandler.js");
const newConnectionHandler = require("./socketHandlers/newConnectionHandler.js");
const newMessageHandler = require("./socketHandlers/newMessageHandler.js");
const startTypingHandler = require("./socketHandlers/startTypingHandler.js");
const stopTypingHandler = require("./socketHandlers/stopTypingHandler.js");

const registerSocketServer = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    

    console.log("Socket server initialized.");

    // Middleware to authenticate socket connection
    io.use(authSocket);

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        newConnectionHandler(socket, io);

        socket.on("disconnect", () => disconnectHandler(socket));

        socket.on("new-message", (data) => {
            if (data) {
                // Expect media data to be base64 or blob via socket, not using upload.array
                newMessageHandler(socket, data, io);
            }
        });

        socket.on("direct-chat-history", (data) => {
            chatHistoryHandler(socket, data);
        });

        socket.on("start-typing", (data) => {
            // console.log("hello world",data)
            startTypingHandler(socket, data, io);
        });

        socket.on("stop-typing", (data) => {
            stopTypingHandler(socket, data, io);
        });
    });
};

module.exports = {
    registerSocketServer,
};
