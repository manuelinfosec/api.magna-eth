import * as express from 'express';
import config from './config';
import loaders from './loaders';

// Main function to initialize and start the Express application
async function main() {
  // Create an Express application instance
  const app = express.default();

  // Load necessary configurations, middleware, routes, etc.
  await loaders(app);

  // Start the server with the specified options.
  // - port: Port number from the configuration (read from environment variable)
  // - hostname: Hostname on which the server will listen ('0.0.0.0' means listen on all available network interfaces).
  // - backlog: Maximum length of the queue of pending connections.
  app.listen({ port: config.port, hostname: '0.0.0.0', backlog: 511 }, () => {
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
