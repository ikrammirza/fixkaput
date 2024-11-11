// import { Server } from "socket.io";

// export default function handler(req, res) {
//   if (req.method === "GET") {
//     // This allows you to visit /api/socket directly in the browser to test the route
//     return res.status(200).send("WebSocket endpoint running");
//   }

//   if (!res.socket.server.io) {
//     console.log("Initializing WebSocket server"); // Logs when initializing

//     const io = new Server(res.socket.server, {
//       path: "/api/socket.io", // Ensure this matches the client's path
//       cors: {
//         origin: "*", // Allow all origins for testing; adjust as necessary
//       },
//     });
//     res.socket.server.io = io;

//     io.on("connection", (socket) => {
//       console.log("Technician connected"); // Confirms connection
//       socket.on("disconnect", () => {
//         console.log("Technician disconnected");
//       });
//     });
//   } else {
//     console.log("WebSocket server already initialized");
//   }
//   res.end();
// }
let io;

export const config = {
  api: {
    bodyParser: false, // Important for socket.io
  },
};

export default function handler(req, res) {
  if (!io) {
    const server = res.socket.server;

    // Only create a new Socket.IO server if it hasn't been initialized
    io = new Server(server, {
      path: "/api/socket.io",
    });

    io.on("connection", (socket) => {
      console.log("New WebSocket connection");

      // Handle socket events here
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  }

  res.end();
}
