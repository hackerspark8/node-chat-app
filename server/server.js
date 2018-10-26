const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const { generateMessage, generateLocationMessage } = require("./utils/message");

io.on("connection", socket => {
  socket.emit("newMessage", generateMessage("admin", "Welcome!"));
  socket.broadcast.emit(
    "newMessage",
    generateMessage("admin", "New User Connected!")
  );

  socket.on("createMessage", ({ from, text }, callback) => {
    callback();
    io.emit("newMessage", generateMessage(from, text));
  });
  socket.on("createLocationMessage", ({ latitude, longitude }, callback) => {
    callback();
    io.emit(
      "newLocationMessage",
      generateLocationMessage("admin", latitude, longitude)
    );
  });

  socket.on("disconnect", () => console.log("Bye!"));
});

app.use(express.static(publicPath));
server.listen(port, () => console.log(`Server is up on port ${port}`));
