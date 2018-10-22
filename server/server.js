const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
io.on("connection", socket => {
  console.log("Welcome onboard");
  socket.on("createMessage", ({ from, text }) => {
    io.emit("newMessage", {
      from,
      text,
      createdAt: new Date().getTime()
    });
  });
  socket.on("disconnect", () => console.log("Bye!"));
});
app.use(express.static(publicPath));
server.listen(port, () => console.log(`Server is up on port ${port}`));
