// const { createServer } = require("http");
// const { parse } = require("url");
// const next = require("next");
// const socketIo = require("socket.io");

// const dev = process.env.NODE_ENV !== "production";
// const app = next({ dev });
// const handle = app.getRequestHandler();

const express = require("express");
const app = express();
const PORT = 3001;
import { addMessage } from "../lib/database/mutation";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const http = require("http").Server(app);
const cors = require("cors");
app.use(cors());

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  //     // Handle chat messages
  socket.on("chat-message", async (message) => {
    console.log(message);
    const { recipientId, formData } = message;
    const newMessage = await addMessage(recipientId, formData);
    socketIO.emit("receive-message", newMessage); // Broadcast the message to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
