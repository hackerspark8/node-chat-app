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
  const textField = $(this).find("input");
  e.preventDefault();
  socket.emit(
    "createMessage",
    {
      from: "User",
      text: $textField.val()
    },
    ack => textField.val("")
  );
});

const locationButton = $("#send-location");
locationButton.on("click", function() {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported by your browser.");
  }
  locationButton.attr("disabled", "disabled").text("Sending location...");
  navigator.geolocation.getCurrentPosition(
    position => {
      socket.emit(
        "createLocationMessage",
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        ack => locationButton.removeAttr("disabled").text("Send location")
      );
    },
    () => {
      locationButton.removeAttr("disabled");
      alert("Unable to fetch location");
    }
  );
});
