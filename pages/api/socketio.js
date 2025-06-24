// pages/api/socketio.js
import { initSocket } from "../../lib/socket";

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Initializing socket...");
    initSocket(res.socket.server);
  } else {
    console.log("Socket already initialized");
  }
  res.end();
}
