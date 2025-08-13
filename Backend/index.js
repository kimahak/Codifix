const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (change to your frontend URL in production)
  },
});

let sharedCode = "// Shared code will appear here...";

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Send current code to new user
  socket.emit("code-update", sharedCode);

  // Listen for changes
  socket.on("code-change", (newCode) => {
    sharedCode = newCode;
    socket.broadcast.emit("code-update", newCode); // Send to all except sender
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
