// lib/socket.js
import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  if (!io) {
    io = new Server(server, {
      path: "/api/socketio",
      cors: {
        origin: "*", // Consider replacing * with allowed origin(s) in production
        methods: ["GET", "POST", "PATCH"],
      },
    });

    console.log("Socket.io initialized");

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }
  return io;
};

export const getSocket = () => io;
