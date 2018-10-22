const socket = io();
socket.on("connect", () => {
  console.log("Connected!");
  socket.emit("createMessage", {
    from: "Deepak",
    text: "Hey!"
  });
});
socket.on("newMessage", message => console.log(message));
socket.on("disconnect", () => console.log("Disconnected!"));
