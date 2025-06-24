// lib/socket.js
import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  if (!io) {
    io = new Server(server, {
      path: "/api/socketio",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    console.log("Socket.io initialized");

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on('testEvent', (data) => {
        console.log('Received test event from server:', data);
      });
      socket.on('orderStatusChanged', (data) => {
        console.log('Order status changed:', data);
      });
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }
  return io;
};

export const getSocket = () => io;
