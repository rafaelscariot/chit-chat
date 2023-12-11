const path = require("path");
const express = require("express");
const app = express();

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () =>
  console.log("server started at port", PORT)
);

const io = require("socket.io")(server);

io.on("connection", onConnected);

const connectedSockets = new Set();

function onConnected(socket) {
  console.log("user connected", socket.id);
  connectedSockets.add(socket.id);

  io.emit("clients-total", connectedSockets.size);

  socket.on("message", (data) => {
    socket.broadcast.emit("message", data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    connectedSockets.delete(socket.id);
  });
}
