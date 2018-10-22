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
  socket.on("createMessage", message => console.log(message));
  socket.on("disconnect", () => console.log("Bye!"));

  socket.emit("newMessage", {
    from: "Sowmya",
    text: "Hi",
    createdAt: new Date().getTime()
  });
});
app.use(express.static(publicPath));
server.listen(port, () => console.log(`Server is up on port ${port}`));
