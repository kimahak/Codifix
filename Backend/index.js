require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// --- Load env variables ---
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

// --- Middleware ---
app.use(cors({ origin: CORS_ORIGIN }));

// --- MongoDB connection ---
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- Document model ---
const DocumentSchema = new mongoose.Schema({
  _id: String,
  content: String,
});
const Document = mongoose.model("Document", DocumentSchema);

// --- Helper ---
async function findOrCreateDocument(id) {
  if (!id) return;
  const doc = await Document.findById(id);
  if (doc) return doc;
  return await Document.create({ _id: id, content: "" });
}

// --- Socket.IO setup ---
const io = new Server(server, {
  cors: { origin: CORS_ORIGIN, methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("🔌 Connected:", socket.id);

  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.content);

    socket.on("code-change", async (delta) => {
      await Document.findByIdAndUpdate(documentId, { content: delta });
      socket.broadcast.to(documentId).emit("code-update", delta);
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
  });
});

app.get("/", (req, res) => res.send("Codifix Backend Running"));

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
