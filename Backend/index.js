const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Codifix backend is awake! 🚀");
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // allow all origins for dev
});

io.on("connection", (socket) => {
  console.log("A friend connected:", socket.id);

  // Listen for a message from React
  socket.on("helloFromReact", (msg) => {
    console.log("React says:", msg);

    // Send a message back to React
    socket.emit("messageFromServer", "Hello React, this is backend!");
  });

  socket.on("disconnect", () => {
    console.log("A friend left:", socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Codifix backend listening at http://localhost:${PORT}`);
});
