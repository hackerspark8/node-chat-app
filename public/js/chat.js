const socket = io();

socket.on("connect", () => {
  const params = $.deparam(window.location.search);
  socket.emit("join", params, err => {
    if (err) {
      alert(err);
      window.location.href = "/";
    } else {
      console.log("No error");
    }
  });
});

socket.on("newMessage", ({ from, text, createdAt }) => {
  const formattedTime = moment(createdAt).format("h:mm a");
  const message = $("#message-template").html();
  const html = Mustache.render(message, {
    from,
    text,
    formattedTime
  });
  $("#messages").append(html);
  scrollToBottom();
});

socket.on("newLocationMessage", ({ from, url, createdAt }) => {
  const formattedTime = moment(createdAt).format("h:mm a");
  const locationMessage = $("#location-message-template").html();
  const html = Mustache.render(locationMessage, {
    from,
    url,
    formattedTime
  });
  $("#messages").append(html);
  scrollToBottom();
});

socket.on("disconnect", () => console.log("Disconnected!"));

socket.on("updateUserList", users => {
  const ol = $("<ol></ol>");
  users.forEach(user => {
    ol.append($("<li></li>").text(user));
  });
  $("#users").html(ol);
});

$("#message-form").on("submit", function(e) {
  const textField = $(this).find("input");
  e.preventDefault();
  socket.emit(
    "createMessage",
    {
      from: "User",
      text: textField.val()
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

const scrollToBottom = () => {
  const messages = $("#messages");
  const newMessage = messages.children("li:last-child");

  const clientHeight = messages.prop("clientHeight");
  const scrollTop = messages.prop("scrollTop");
  const scrollHeight = messages.prop("scrollHeight");
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();
  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop(scrollHeight);
  }
};
