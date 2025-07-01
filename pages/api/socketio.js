// pages/api/socketio.js
import { initSocket } from "../../lib/socket";

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Initializing socket...");
    const io = initSocket(res.socket.server); // ✅ store the returned io instance
    res.socket.server.io = io; // ✅ attach to server for reuse
  } else {
    console.log("Socket already initialized");
  }
  res.end();
}
