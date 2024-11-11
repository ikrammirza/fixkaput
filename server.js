// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST'],
//   },
// });

// io.on('connection', (socket) => {
//   console.log('A client connected');
//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });

// server.listen(3000, () => {
//   console.log('Server is running on http://localhost:3000');
// });