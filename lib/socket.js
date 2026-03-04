// lib/socket.js
import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  if (io) {
    console.log("⚠️ Socket already initialized");
    return io;
  }

  console.log("🚀 Initializing socket server...");
  const allowedOrigins = (process.env.SOCKET_CORS_ORIGINS || "https://fixkaput.vercel.app,http://localhost:3000")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  io = new Server(server, {
    path: "/api/socketio",
    cors: {
      origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
      methods: ["GET", "POST", "PATCH"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Client connected:", socket.id);

    socket.setMaxListeners(20);

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  global._io = io; // 👈 Add this line to persist across requests

  return io;
};

export const getSocket = () => {
  return io || global._io || null; // 👈 Always fallback to global
};

