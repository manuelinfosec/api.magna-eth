import * as express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import config from './config';
import loaders from './loaders';

// Main function to initialize and start the Express application
async function main() {
  // Create an Express application instance
  const app = express.default();

  // Create an HTTP server and attach the Express app to it
  const server = createServer(app);

  // Initialize Socket.IO with the HTTP server
  const io = new SocketIOServer(server, {
    // cors: {
    //   origin: ['http://localhost:3000'],
    //   methods: ['GET', 'POST'],
    // },
    // transports: ['websocket'],
  });

  // Load necessary configurations, middleware, routes, etc.
  await loaders(app, io);

  // io.on('connection_error', (err) => {
  //   console.log(err.code); // 3
  //   console.log(err.message); // "Bad request"
  //   console.log(err.context); // { name: 'TRANSPORT_MISMATCH', transport: 'websocket', previousTransport: 'polling' }
  // });

  // Start the server with the specified options.
  server.listen({ port: config.port, hostname: '0.0.0.0', backlog: 511 }, () => {
    console.log(`Server is listening on port ${config.port}`);
  });

  // Setup graceful shutdown on receiving the SIGTERM signal
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received.');
    console.log('Express app closed.');
    process.exit(0);
  });
}

// Entrypoint
main();
