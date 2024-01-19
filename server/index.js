const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const users = {}; // Store user information
const admin_id = "1234",
  user1 = "user1";
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_private_chat", () => {
    users[user1] = socket.id;
    console.log(`User with ID: ${socket.id} joined private chat `);
  });
  socket.on("join_admin_chat", () => {
    users[admin_id] = socket.id;
    console.log(`Admin with ID: ${socket.id} joined `);
  });

  socket.on("send_private_message_user", (data) => {
    console.log(data);
    const recipientSocketId = users[admin_id];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receive_private_message", data);
    } else {
      // Handle case when recipient is not connected
      console.log(`User with ID ${data.recipientId} is not connected.`);
    }
  });
  socket.on("send_private_message_admin", (data) => {
    console.log(data);
    const recipientSocketId = users[user1];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receive_private_message", data);
    } else {
      // Handle case when recipient is not c onnected
      console.log(`User with ID ${data.recipientId} is not connected.`);
    }
  });
  socket.on("disconnect", () => {
    // Remove user information on disconnect
    const userId = Object.keys(users).find((key) => users[key] === socket.id);
    if (userId) {
      console.log(`User with ID: ${userId} disconnected`);
      delete users[userId];
    }
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
