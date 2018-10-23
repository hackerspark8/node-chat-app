const socket = io();
socket.on("connect", () => {
  console.log("Connected!");
});
socket.on("newMessage", ({ from, text }) => {
  const li = $("<li></li>");
  li.text(`${from}: ${text}`);
  $("#messages").append(li);
});
socket.on("disconnect", () => console.log("Disconnected!"));

$("#message-form").on("submit", function(e) {
  e.preventDefault();
  socket.emit(
    "createMessage",
    {
      from: "User",
      text: $(this)
        .find("input")
        .val()
    },
    ack => console.log(ack)
  );
});
