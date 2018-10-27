const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/validation");
const { Users } = require("./utils/users");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

io.on("connection", socket => {
  socket.on("join", ({ name, room }, callback) => {
    if (!isRealString(name) || !isRealString(room)) {
      callback("Name and room name are required");
      return;
    }
    socket.join(room);
    users.removeUser(socket.id);
    users.addUser(socket.id, name, room);
    io.to(room).emit("updateUserList", users.getUserList(room));

    socket.emit("newMessage", generateMessage("Admin", "Welcome!"));
    socket.broadcast
      .to(room)
      .emit("newMessage", generateMessage("Admin", `${name} Connected!`));
    callback();
  });

  socket.on("createMessage", ({ text }, callback) => {
    const user = users.getUser(socket.id);
    if (user && isRealString(text)) {
      io.to(user.room).emit("newMessage", generateMessage(user.name, text));
    }
    callback();
  });
  socket.on("createLocationMessage", ({ latitude, longitude }, callback) => {
    const user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "newLocationMessage",
        generateLocationMessage(user.name, latitude, longitude)
      );
    }
    callback();
  });

  socket.on("disconnect", () => {
    const user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      io.to(user.room).emit(
        "newMessage",
        generateMessage("Admin", `${user.name} Disconnected!`)
      );
    }
  });
});

app.use(express.static(publicPath));
server.listen(port, () => console.log(`Server is up on port ${port}`));
