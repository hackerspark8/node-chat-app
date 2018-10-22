const socket = io();
socket.on("connect", () => {
  console.log("Connected!");
});
socket.on("newMessage", message => console.log(message));
socket.on("disconnect", () => console.log("Disconnected!"));
