const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

handleConnection(io, socket => {
  emitNewMessage(socket, {
    from: "admin",
    text: "Welcome!",
    createdAt: new Date().getTime()
  });
  emitNewMessage(socket.broadcast, {
    from: "admin",
    text: "New User Connected!"
  });
  handleCreateMessage(socket, ({ from, text }) => {
    emitNewMessage(socket.broadcast, {
      from,
      text
    });
  });
  handleDisconnect(socket, () => console.log("Bye!"));
});

app.use(express.static(publicPath));
server.listen(port, () => console.log(`Server is up on port ${port}`));

function emitNewMessage(channel, message) {
  message.createdAt = new Date().getTime();
  channel.emit("newMessage", message);
}

function handleCreateMessage(channel, handler) {
  channel.on("createMessage", handler);
}

function handleDisconnect(channel, handler) {
  channel.on("disconnect", handler);
}

function handleConnection(channel, handler) {
  channel.on("connection", handler);
}
