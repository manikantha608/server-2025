const app = require("./app");
const dotenv = require("dotenv");

const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || process.env.API_PORT;

const {registerSocketServer} = require("./socketServer.js")

const http = require("http")

const server = http.createServer(app);
registerSocketServer(server);

// console.log("REG_SOCKET:",registerSocketServer(server))


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connection successful!");
    server.listen(PORT, () => {
      console.log(`Server is listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("database connection failed. Server not started");
    console.log(err);
  });


