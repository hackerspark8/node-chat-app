const socket = io();
socket.on("connect", () => {
  console.log("Connected!");
});
socket.on("newMessage", ({ from, text }) => {
  const li = $("<li></li>");
  li.text(`${from}: ${text}`);
  $("#messages").append(li);
});
socket.on("newLocationMessage", message => {
  const li = $("<li></li>");
  const a = $("<a target='_blank'>My Current Location</a>");
  li.text(`${message.from}: `);
  a.attr("href", message.url);
  li.append(a);
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
  $(this)
    .find("input")
    .val("");
});

const locationButton = $("#send-location");
locationButton.on("click", function() {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported by your browser.");
  }
  navigator.geolocation.getCurrentPosition(
    position => {
      console.log(position);
      socket.emit(
        "createLocationMessage",
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        ack => console.log(ack)
      );
    },
    () => console.log("Unable to fetch location")
  );
});
